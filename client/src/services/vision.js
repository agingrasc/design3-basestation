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
        this.ws = new WebSocket('ws://localhost:3000');

        this.ws.onopen = () => {
            let robotPositionRegisterMessage = JSON.stringify({ 'headers': 'register_vision_data' });
            this.ws.send(robotPositionRegisterMessage);
        };

        this.ws.onmessage = (evt) => {
            let data = JSON.parse(evt.data);

            if (data.image.origin.x !== '') {
                this.world_information.origin = data.image.origin;
                this.world_information.ratio = data.image.ratio;
                this.goto.width = data.world.base_table.dimension.width;
                this.goto.length = data.world.base_table.dimension.height;
            }

            window.requestAnimationFrame(() => {
                this.imageView.imagePath = 'data:image/jpeg;base64,' + data.image.data;
            });

            this.informations.obstacles = data.world.obstacles;

            let world = data.world;
            this.informations.worldDimensions = {
                'width': Math.round(parseFloat(world.base_table.dimension.width)),
                'length': Math.round(parseFloat(world.base_table.dimension.height)),
                'unit': world.unit
            };

            // Update robot position
            let robot = data.world.robot;
            this.informations.robot = {
                'position': {
                    'x': robot.position.x,
                    'y': robot.position.y
                },
                'orientation': robot.orientation
            };

            this.goto.robot = {
                'position': {
                    'x': robot.position.x,
                    'y': robot.position.y,
                    'theta': robot.theta
                }
            };

            // Update world obstacles
            this.goto.obstacles = [];

            // Update world dimension
            this.world_information.world_dimension = data.image.sent_dimension;
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

    registerGotoPosition(worldInformation) {
        this.world_information = worldInformation;
    }

    registerGoto(goto) {
        this.goto = goto;
        this.checkReadyToStart();
    }
}
