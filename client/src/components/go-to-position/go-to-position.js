import {
    inject
} from 'aurelia-framework';

import {
    BaseStationRequest
} from '../../http/base-station-request';

import {
    bindable
} from 'aurelia-framework';

import {
    Vision
} from '../../services/vision';


@inject(Vision)
export class GoToPosition {

    @bindable xPosition = 0;
    @bindable yPosition = 0;
    @bindable theta = 0
    @bindable pathfinder = false;

    constructor(vision) {
        this.httpClient = new BaseStationRequest();
        this.vision = vision;
        this.info = {};
        this.vision.registerGoto(this.info);
    }

    attached() {
        if (!this.pathfinder) {
            this.buttonName = 'go to pathfinder';
            this.endpoint = '/go-to-pathfinder';
        } else {
            this.buttonName = 'go to position';
            this.endpoint = '/go-to-position';
        }
    }

    execute() {
        let body = {
            'destination': {
                'x': this.xPosition,
                'y': this.yPosition,
                'theta': this.theta
            }
        };

        this.httpClient.post(body, this.endpoint);
    }
}
