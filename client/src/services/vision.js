export class Vision {
    constructor() {
        this.informations = undefined;
        this.imageView = undefined;
    }

    start() {
        if (this.imageView === undefined) {
            return;
        }
        if (this.informations === undefined) {
            return;
        }
        var ws = new WebSocket("ws://localhost:3000");
        var tmp = {};
        tmp.headers = "register_vision_data";
        var value = JSON.stringify(tmp);
        ws.onopen = function() {
            ws.send(value);
        };
        var self = this;
        ws.onmessage = function(evt) {
            var data = JSON.parse(evt.data);
            self.imageView.imagePath = "data:image/png;base64," + data.vision_image;
            self.informations.x = "yeh";
        };
    }

    registerImageView(imageView) {
        this.imageView = imageView;
        this.start();
    }

    registerInformations(informations) {
        this.informations = informations;
        this.start();
    }
}
