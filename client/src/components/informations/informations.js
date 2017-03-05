import {
    inject
}
from 'aurelia-framework';

import {
    Vision
} from '../../services/vision';

@inject(Vision)
export class Informations {
    constructor(vision) {
        this.vision = vision;
        this.informations = {};
        this.informations.x = "lol";
    }

    attached() {
        this.vision.registerInformations(this.informations);
    }
}
