import { inject } from 'aurelia-framework';
import { Timer } from './timer';

@inject(Timer)
export class Task {
    constructor(timer) {
        this.timer = timer;
        this.data = undefined;
        this.tasks = [];
    }

    start() {
        this.ws = new WebSocket('ws://localhost:3000');

        this.ws.onopen = () => {
            let taskRegisterMessage = JSON.stringify({ 'headers': 'register_task_data' });
            this.ws.send(taskRegisterMessage);
        };

        this.ws.onmessage = (evt) => {
            let data = JSON.parse(evt.data);
            this.tasks.splice(0, this.tasks.length);

            for (let taskName in data.data) {
                let taskStatus = stringToBoolean(data.data[taskName]);

                if (taskName === 'light_red_led') {
                    if (taskStatus) {
                        this.onCycleEnd();
                        this.timer.pause();
                    }
                }

                this.tasks.push({
                    'name': snakeToCamel(taskName),
                    'done': taskStatus,
                    'color': colorFrom(taskStatus)
                });
            }
        };
    }

    startTask() {
        this.timer.start();
    }

    resetTasks() {
        this.ws.send(JSON.stringify({ 'headers': 'reset_tasks' }));
    }

    registerInformations(data) {
        this.tasks = data;
    }

    registerCycleEnd(onCycleEnd) {
        this.onCycleEnd = onCycleEnd;
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
    return s.charAt(0).toUpperCase() + s.replace(/(\_\w)/g, function(m) { return ' ' + m[1].toUpperCase(); }).slice(1);
}
