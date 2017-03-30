import {
    inject
} from 'aurelia-framework';

import {
    Timer
} from '../../services/timer';

@inject(Timer)
export class RobotController {
  constructor(timer) {
    this.timer = timer;
    this.currentCommand = null;
    this.currentScaling = null;
    this.messageReceived = false;
    this.showImage = true;
    this.fakeSegmentation = false;
    this.takePicture = false;
    this.showSegmentsCoordinates = false;
    this.segmentsCoordinates = [];

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

    this.scalings = [
      { 'value': '1', 'name': '4' },
      { 'value': '0.5', 'name': '2' }
    ];
  }

  sendCommand() {
    const taskId = this.options.indexOf(this.currentCommand).toString();
    const data = {'task_id': taskId };

    if (this.currentScaling) {
      data.scaling = this.currentScaling.value;
    }

    if (isTakePicture(taskId) && this.fakeSegmentation) {
      data.fake_segmentation = true;
    }

    this.messageReceived = false;

    fetch('http://localhost:12345/start-tasks', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        this.message = 'command sent to robot';
        this.messageReceived = true;
      }

      if (data.image) {
        this.segmentsCoordinates = data.segments.map((coord) => coordToString(coord));
        this.segmentedImage = data.image;
        this.thresholdedImage = data.thresholded_image;
      }
    });
  }

  onChange() {
    const currentTaskIndex = this.options.indexOf(this.currentCommand);
    if (isTakePicture(currentTaskIndex)) {
      this.takePicture = true;
      this.showImage = true;
      this.showSegmentsCoordinates = false;
    } else if (isDrawPicture(currentTaskIndex)) {
      this.takePicture = false;
      this.showImage = false;
      this.showSegmentsCoordinates = true;
    } else {
      this.takePicture = false;
      this.showSegmentsCoordinates = true;
    }
  }

  startTimer() {
    this.timer.start();
  }

  resetTimer() {
    this.timer.reset();
  }

  stopTimer() {
    this.timer.stop();
  }
}


function isTakePicture(taskId) {
  return taskId === 5 || taskId === '5';
}


function isDrawPicture(taskId) {
  return taskId === 7 || taskId === '7';
}

function coordToString(coord) {
  return [
      Math.round(parseFloat(coord[0])),
      Math.round(parseFloat(coord[1]))
  ].toString();
}
