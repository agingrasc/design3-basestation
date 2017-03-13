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
}
