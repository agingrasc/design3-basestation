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

        this.canvasId = "monCanvas";

        this.visionProperties = {};
        this.visionProperties.imagePath = "./src/components/world-vision/image14.jpg";

        this.x_position = 0;
        this.y_position = 0;

        this.chosen_x_position = 0;
        this.chosen_y_position = 0;

        this.world_information = {};
    }

    attached() {
        var canvas = document.getElementById(this.canvasId);
        var context = canvas.getContext('2d');

        var self = this;

        canvas.addEventListener('mousemove', function(evt) {
            var mousePos = self.getMousePos(canvas, evt);
            self.adjustPositions(mousePos);
        }, false);

        canvas.addEventListener('click', function(evt) {
            self.chosen_x_position = self.x_position;
            self.chosen_y_position = self.y_position;
        }, false);

        this.vision.registerImageView(this.visionProperties);
        this.vision.registerGotoPosition(this.world_information);
    }

    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    adjustPositions(mousePos) {
        console.log(this.world_information.origin);
        console.log(this.world_information.ratio);
        this.x_position = Math.floor((mousePos.x - this.world_information.origin.x) / this.world_information.ratio);
        this.y_position = Math.floor((mousePos.y - this.world_information.origin.y) / this.world_information.ratio);
    }
}
