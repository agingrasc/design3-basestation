import { inject } from 'aurelia-framework';
import { bindable } from 'aurelia-framework';

import { BaseStationRequest } from '../../http/base-station-request';
import { Vision } from '../../services/vision';

@inject(Vision)
export class GoToPosition {
    @bindable pathfinder = true;

    constructor(vision) {
        this.httpClient = new BaseStationRequest();
        this.vision = vision;
    }

    attached() {
        if (this.pathfinder) {
            this.buttonName = 'go to pathfinder';
            this.endpoint = '/go-to-pathfinder';
        } else {
            this.buttonName = 'go to position';
            this.endpoint = '/go-to-position';
        }
    }

    execute() {
        this.httpClient.post(this.vision.getDestinationPosition(), this.endpoint);
    }
}
