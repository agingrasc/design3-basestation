export class Task {
    constructor() {
        this.data = undefined;
    }

    start() {
        let ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            let taskRegisterMessage = JSON.stringify({ 'headers': 'register_task_data' });
            ws.send(taskRegisterMessage);
        };

        ws.onmessage = (evt) => {
            let data = JSON.parse(evt.data);
            this.data.data = data;
        }
    }

    registerInformations(data) {
        this.data = data;
        this.start();
    }
}
