import { inject } from 'aurelia-framework';

import { Vision } from '../../services/vision';
import { Timer } from '../../services/timer';
import { Task } from '../../services/task';

@inject(Vision, Timer, Task)
export class Informations {
    constructor(vision, timer, task) {
        this.timer = timer;
        this.vision = vision;
        this.informations = {};
        this.informations.obstacles = [];
        this.task = task;
        this.task_information = [];
    }

    attached() {
        this.vision.registerInformations(this.informations);
        this.task.registerInformations(this.task_information);
    }

    resetObstaclesDetection() {
         fetch('http://0.0.0.0:12345/obstacles/reset', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            mode: 'no-cors'
        }).then(function(response) {
            return response.json();
        }).then(function(message) {
            console.log(message);
        }).catch(function(err) {
            console.log(err);
        });
    }

    resetDetection() {
        fetch('http://0.0.0.0:5000/vision/reset-detection', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            mode: 'no-cors'
        }).then(function(response) {
            return response.json();
        }).then(function(message) {
            console.log(message);
        }).catch(function(err) {
            console.log(err);
        });
    }

    resetPathRendering() {
        fetch('http://0.0.0.0:5000/vision/reset-rendering', {
            method: 'POST',
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

    colorFor(task) {
        return 'red-text';
    }
}
