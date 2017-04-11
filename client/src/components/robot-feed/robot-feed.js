export class RobotFeed {
    constructor() {
        this.imagePath = 'img/placeholder_480x360.png';
        this.ws = new WebSocket('ws://localhost:3000');

        this.ws.onopen = () => {
            let robotPositionRegisterMessage = JSON.stringify({ 'headers': 'register_to_robot_feed' });
            this.ws.send(robotPositionRegisterMessage);
        };

        this.ws.onmessage = (event) => {
            let data = JSON.parse(event.data);

            window.requestAnimationFrame(() => {
                this.imagePath = `data:image/jpeg;base64,${data.data.image}`;
            });
        };
    }
}
