export class Vision {
    constructor() {
        this.informations = undefined;
        this.imageView = undefined;
    }

    start() {
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
            self.informations.obstacles = data.vision_obstacles;
            for (var i = 0; i < self.informations.obstacles.length; i++) {
                var obstacle = self.informations.obstacles[i];
                if (obstacle.vision_obstacle_tag == "OCPR") {
                    self.informations.obstacles[i].vision_obstacle_tag = "Left";
                } else if (obstacle.vision_obstacle_tag == "OCPL") {
                    self.informations.obstacles[i].vision_obstacle_tag = "Right";
                }
            }
            self.informations.robot = data.vision_robot;
        };
    }

    checkReadyToStart() {
        if (this.imageView === undefined) {
            return;
        }
        if (this.informations === undefined) {
            return;
        }
        this.start();
    }
    registerImageView(imageView) {
        this.imageView = imageView;
        this.checkReadyToStart();
    }


    registerInformations(informations) {
        this.informations = informations;
        this.checkReadyToStart();
    }
}
