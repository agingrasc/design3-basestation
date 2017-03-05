import {
    BaseStationRequest
} from '../../http/base-station-request';
import {
    bindable,
    bindingMode
} from 'aurelia-framework';

export class GoToPosition {

    @bindable xPosition = 0;
    @bindable yPosition = 0;

    constructor(vision) {
        this.vision = vision;
        this.httpClient = new BaseStationRequest();
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
    }
}
