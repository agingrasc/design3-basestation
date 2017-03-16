export class Vision {
    constructor() {
        this.informations = undefined;
        this.imageView = undefined;
        this.world_information = undefined;
        this.origin = undefined;
        this.ratio = undefined;
        this.goto = undefined;
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


            if (data.image.origin.x !== "") {
                self.world_information.origin = data.image.origin;
                self.world_information.ratio = data.image.ratio;
                self.goto.width = data.world.base_table.dimension.width;
                self.goto.length = data.world.base_table.dimension.height;
            }

            window.requestAnimationFrame(() => {
                self.imageView.imagePath = "data:image/png;base64," + data.image.data;
            });

            self.informations.obstacles = data.world.obstacles;

            // Update robot position
            var robot = data.world.robot;
            self.informations.robot = robot;
            self.goto.robot = {
                "position": {
                    "x": robot.position.x,
                    "y": robot.position.y,
                    "theta": 0
                }
            };

            // Update world obstacles
            self.goto.obstacles = [];

            // Update world dimension
            self.world_information.world_dimension = data.image.sent_dimension;
        };
    }

    checkReadyToStart() {
        if (this.imageView === undefined) {
            return;
        }
        if (this.informations === undefined) {
            return;
        }
        if (this.goto === undefined) {
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

    registerGotoPosition(world_information) {
        this.world_information = world_information;
    }

    registerGoto(goto) {
        console.log(goto);
        this.goto = goto;
        this.checkReadyToStart();
    }
}
