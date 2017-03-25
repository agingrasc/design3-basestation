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
    @bindable theta = 0

    constructor(timer, vision) {
        this.timer = timer;
        this.httpClient = new BaseStationRequest();
        this.vision = vision;
        this.info = {};
        this.vision.registerGoto(this.info);
    }

    execute() {
        this.path = "/go-to-position/";

        var payload = this.info;

        payload.destination = {
            "x": this.xPosition,
            "y": this.yPosition,
            "theta": this.theta
        };
        console.log(payload);

        var data = JSON.stringify(payload);
        this.httpClient.post(data, this.path);

        this.timer.startTimer();
    }
}
