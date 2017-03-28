import {
    inject
}
from 'aurelia-framework';

import {
    Vision
} from '../../services/vision';

import {
    Timer
} from '../../services/timer';

@inject(Vision, Timer)
export class Informations {
    constructor(vision, timer) {
        this.timer = timer;
        this.vision = vision;
        this.informations = {};
        this.informations.obstacles = [];
    }

    attached() {
        this.vision.registerInformations(this.informations);
    }

    resetDetection() {
        fetch('http://0.0.0.0:5000/vision/reset-detection', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            mode: 'no-cors'
        }).then(function (response) {
            return response.json();
        }).then(function(message) {
            console.log(message);
        }).catch(function (err) {
            console.log(err);
        });
    }
}
