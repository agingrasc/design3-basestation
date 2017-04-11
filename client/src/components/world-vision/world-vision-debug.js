import { inject } from 'aurelia-framework';
import { Vision } from '../../services/vision';

@inject(Vision)
export class WorldVisionDebug {
    constructor(vision) {
        this.vision = vision;

        this.visionProperties = {
            'imagePath': 'img/placeholder_640x400.png'
        };

        this.x_position = 0;
        this.y_position = 0;

        this.chosen_x_position = 0;
        this.chosen_y_position = 0;

        this.world_information = {};
        this.theta = 0;
    }

    attached() {
        let canvas = document.getElementById('world__feed');

        canvas.addEventListener('mousemove', (evt) => {
            let mousePos = this.getMousePos(canvas, evt);
            this.adjustPositions(mousePos);
        }, false);

        canvas.addEventListener('click', (evt) => {
            this.chosen_x_position = this.x_position;
            this.chosen_y_position = this.y_position;

            this.nextDestination = {
                'x': this.chosen_x_position,
                'y': this.chosen_y_position,
                'theta': this.theta
            };

            this.vision.setDestinationPosition(this.nextDestination);
        }, false);

        this.vision.registerImageView(this.visionProperties);
        this.vision.registerGotoPosition(this.world_information);
    }

    getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    adjustPositions(mousePos) {
        let worldOriginX = parseFloat(this.world_information.origin.x);
        let worldOriginY = parseFloat(this.world_information.origin.y);
        let worldOriginRatio = parseFloat(this.world_information.ratio);

        this.x_position = Math.floor((mousePos.x - worldOriginX) * worldOriginRatio * 10);
        this.y_position = Math.floor((mousePos.y - worldOriginY) * worldOriginRatio * 10);
    }
}
