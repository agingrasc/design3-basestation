export class RobotController {
  constructor() {
    this.currentCommand = null;
    this.messageReceived = false;
    this.showImage = true;
    this.fakeSegmentation = false;
    this.takePicture = false;
    this.options = [
      '0 - Competition',
      '1 - Initial Orientation',
      '2 - Identify Antenna',
      '3 - Receive Information',
      '4 - Go to Image',
      '5 - Take Picture',
      '6 - Go to Drawing Area',
      '7 - Draw Figure',
      '8 - Go Out of Drawing Area',
      '9 - Light Red Led',
      '10 - Toggle Pencil'
    ];
  }

  sendCommand() {
    const taskId = this.options.indexOf(this.currentCommand).toString();
    const data = {'task_id': taskId };

    if (taskId === '5' && this.fakeSegmentation) {
      data.fake_segmentation = true;
    }

    this.messageReceived = false;

    fetch("http://localhost:12345/start-tasks", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => {
        return res.json();
    }).then((data) => {
      if (data.message) {
        this.message = 'command sent to robot';
        this.messageReceived = true;
      }

      if (data.image) {
        this.segmentedImage = data.image;
        this.thresholdedImage = data.thresholded_image;
      }
    });

  }

  onChange() {
    const currentTaskIndex = this.options.indexOf(this.currentCommand);
    console.log(currentTaskIndex);
    if (currentTaskIndex === 5) {
      this.takePicture = true;
    } else {
      this.takePicture = false;
    }
  }
}
