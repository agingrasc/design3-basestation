export class RobotController {
  constructor() {
    this.currentCommand = null;
    this.messageReceived = false;
    this.options = [
      'competition',
      'initial-orientation',
      'identify-antenna',
      'receive-information',
      'go-to-image',
      'take-picture',
      'go-to-draw-zone',
      'draw',
      'go-out-of-draw-zone',
      'light-red-led'
    ];
  }

  sendCommand() {
    const taskId = this.options.indexOf(this.currentCommand).toString();
    const data = {"task_id": taskId};

    this.messageReceived = false;

    fetch("http://localhost:12345/start-tasks", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => {
        return res.json();
    }).then((data) => {
      if (data.message) {
        this.message = 'Command sent to robot';
        this.messageReceived = true;
      }
    });

  }
}
