import {
    inject
}
from 'aurelia-framework';

import {
    BaseStationRequest
} from '../../http/base-station-request';
import {
    bindable,
    bindingMode
} from 'aurelia-framework';

import {
    Timer
} from '../../services/timer';

import {
    Vision
} from '../../services/vision';

@inject(Timer, Vision)
export class GoToPosition {

    @bindable xPosition = 0;
    @bindable yPosition = 0;

    constructor(timer, vision) {
        this.timer = timer;
        this.httpClient = new BaseStationRequest();
        this.vision = vision;
        this.info = {};
        this.vision.registerGoto(this.info);
    }

    execute() {
        console.log(this.xPosition);
        console.log(this.yPosition);
        this.path = "/go-to-position/";
        var dimension = {
            x: this.xPosition,
            y: this.yPosition
        };
        var payload = this.info
        payload.dimension = dimension;
        var data = JSON.stringify(payload);
        this.httpClient.post(data, this.path);
        this.timer.startTimer();
    }
}
