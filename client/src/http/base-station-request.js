export class BaseStationRequest {
    constructor() {
        this.baseStationUrl = 'http://localhost:12345';
    }

    post(data, endpoint) {
        fetch(this.baseStationUrl + endpoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(responseData) {
            console.log(JSON.stringify(responseData));
        });
    }
}
