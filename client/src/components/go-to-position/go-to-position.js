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
@inject(Timer)
export class GoToPosition {

    @bindable xPosition = 0;
    @bindable yPosition = 0;

    constructor(timer) {
        this.timer = timer;
        this.httpClient = new BaseStationRequest();
        this.origin = undefined;
        this.world_dimension = undefined;
        this.ratio = undefined;
    }

    execute() {
        console.log(this.xPosition);
        console.log(this.yPosition);
        this.path = "/go-to-position/";
        var payload = {
            x: this.xPosition,
            y: this.yPosition
        };
        var data = JSON.stringify(payload);
        this.httpClient.post(data, this.path);
        this.timer.startTimer();
    }
}
