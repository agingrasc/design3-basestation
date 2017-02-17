export class BaseStationRequest {

    constructor() {
        this.baseStationUrl = "http://localhost:12345";
    }

    post(data, path) {
        fetch(this.baseStationUrl + path, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: data
            })
            .then(function(res) {
                return res.json();
            })
            .then(function(data) {
                console.log(JSON.stringify(data));
            });
    }
}
