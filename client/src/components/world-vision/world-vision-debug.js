import { inject } from 'aurelia-framework';
import { Vision } from '../../services/vision';

@inject(Vision)
export class WorldVisionDebug {
    constructor(vision) {
        this.vision = vision;

        this.canvasId = 'monCanvas';

        this.visionProperties = {};
        this.visionProperties.imagePath = './src/components/world-vision/image14.jpg';

        this.x_position = 0;
        this.y_position = 0;

        this.chosen_x_position = 0;
        this.chosen_y_position = 0;

        this.world_information = {};
        this.theta = 0;
    }

    attached() {
        let canvas = document.getElementById(this.canvasId);

        canvas.addEventListener('mousemove', (evt) => {
            let mousePos = this.getMousePos(canvas, evt);
            this.adjustPositions(mousePos);
        }, false);

        canvas.addEventListener('click', (evt) => {
            this.chosen_x_position = this.x_position;
            this.chosen_y_position = this.y_position;
        }, false);

        this.vision.registerImageView(this.visionProperties);
        this.vision.registerGotoPosition(this.world_information);
    }

    resetPathRendering() {
        fetch('http://0.0.0.0:5000/vision/reset-rendering', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            mode: 'no-cors'
        })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
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
