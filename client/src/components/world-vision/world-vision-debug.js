import {
    inject
} from 'aurelia-framework';

import {
    Vision
} from '../../services/vision';

@inject(Vision)
export class WorldVisionDebug {
    constructor(vision) {
        this.vision = vision;
        this.monPixel = "800"

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
        }).then(function (response) {
            console.log(response);
        }).catch(function (err) {
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
        let world_origin_x = parseFloat(this.world_information.origin.x);
        let world_origin_y = parseFloat(this.world_information.origin.y);
        let world_image_ratio = parseFloat(this.world_information.ratio);

        this.x_position = Math.floor((mousePos.x - world_origin_x) * world_image_ratio * 10);
        this.y_position = Math.floor((mousePos.y - world_origin_y) * world_image_ratio * 10);
    }
}
