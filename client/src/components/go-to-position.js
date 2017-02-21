import {
    BaseStationRequest
} from '../http/base-station-request';

export class GoToPosition {

    constructor() {
        this.path = "/go-to-position/";
        this.httpClient = new BaseStationRequest();
        this.xPosition = 0;
        this.yPosition = 0;
    }

    execute() {
        console.log(this.xPosition);
        console.log(this.yPosition);
        var payload = {
            x: this.xPosition,
            y: this.yPosition
        };
        var data = JSON.stringify(payload);
        this.httpClient.post(data, this.path);
    }
}
