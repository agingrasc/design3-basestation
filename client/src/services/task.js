export class Task {
    constructor() {
        this.data = undefined;
        this.tasks = [];
    }

    start() {
        let ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            let taskRegisterMessage = JSON.stringify({ 'headers': 'register_task_data' });
            ws.send(taskRegisterMessage);
        };

        ws.onmessage = (evt) => {
            let data = JSON.parse(evt.data);
            this.tasks.splice(0, this.tasks.length);

            for (let taskName in data.data) {
                let taskStatus = data.data[taskName];

                this.tasks.push({
                    'name': snakeToCamel(taskName),
                    'done': stringToBoolean(taskStatus),
                    'color': colorFrom(stringToBoolean(taskStatus))
                });
            }
        };
    }

    registerInformations(data) {
        this.tasks = data;
        this.start();
    }
}

function stringToBoolean(stringBoolean) {
    if (stringBoolean === 'True') {
        return true;
    } else {
        return false;
    }
}

function colorFrom(status) {
    if (status) {
        return 'green';
    } else {
        return 'red';
    }
}

function snakeToCamel(s) {
    return s.charAt(0).toUpperCase() + s.replace(/(\_\w)/g, function(m) { return " " + m[1].toUpperCase(); }).slice(1);
}
