import { inject } from 'aurelia-framework';

import { Timer } from '../../services/timer';
import { Task } from '../../services/task';

@inject(Timer, Task)
export class RobotController {
  constructor(timer, task) {
    this.timer = timer;
    this.taskService = task;

    this.currentCommand = null;
    this.currentScaling = null;
    this.currentOrientation = null;

    this.messageReceived = false;
    this.showImage = true;
    this.fakeSegmentation = false;
    this.takePicture = false;
    this.showSegmentsCoordinates = false;
    this.robotOnline = false;
    this.taskSent = false;
    this.taskDone = false;

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
        '10 - Toggle Pencil',
        '11 - Null',
        '12 - Images Routine'
    ];

    this.scalings = [
      { 'value': '1', 'name': '4' },
      { 'value': '0.5', 'name': '2' }
    ];

    this.orientations = [
      { 'value': 'SOUTH', 'name': 'SUD' },
      { 'value': 'NORTH', 'name': 'NORD'},
      { 'value': 'EAST', 'name': 'EST' },
      { 'value': 'WEST', 'name': 'WEST'}
    ];

    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => {
        this.ws.send(JSON.stringify({'headers': 'register_image_segmentation'}));
        this.ws.send(JSON.stringify({'headers': 'register_robot_online'}));
    };

    this.ws.onmessage = (event) => {
      let data = JSON.parse(event.data);

      if (data.data === 'robot_online') {
        this.robotOnline = true;
      } else if (data.data === 'robot_offline') {
        this.robotOnline = false;
      } else if (data.data.image) {
        this.segmentedImage = data.data.image;
        this.thresholdedImage = data.data.thresholded_image;
      }
    };
  }

  attached() {
    this.taskService.registerCycleEnd(this.setTaskDone.bind(this));
  }

  setTaskDone() {
    this.taskDone = true;
  }

  sendCommand() {
    const taskId = this.options.indexOf(this.currentCommand).toString();
    const data = { 'task_id': taskId };

    if (this.currentScaling) {
      data.scaling = this.currentScaling.value;
      data.orientation = this.currentOrientation.value;
    }

    if (isTakePicture(taskId) && this.fakeSegmentation) {
      data.fake_segmentation = true;
    } else if (isTaskCompetition(taskId)) {
      this.taskSent = true;
      this.taskDone = false;
    } else if (isLightRedLedTask(taskId)) {
      this.taskDone = true;
      this.taskSent = false;
    }

    fetch('http://localhost:12345/start-tasks', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((responseData) => {
      if (responseData.message) {
        this.taskService.startTask();
      }

      if (responseData.image) {
        this.segmentsCoordinates = responseData.segments.map((coord) => coordToString(coord));
        this.segmentedImage = responseData.image;
        this.thresholdedImage = responseData.thresholded_image;
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

  resetTask() {
    this.taskService.resetTasks(() => {
      this.taskDone = false;
    });
  }

  startTimer() {
    this.timer.start();
  }

  stopTimer() {
    this.timer.stop();
  }

  pauseTimer() {
    this.timer.pause();
    this.resetTask();
    this.taskDone = false;
    this.taskSent = false;
  }
}


function isTakePicture(taskId) {
  return taskId === 5 || taskId === '5';
}

function isTaskCompetition(taskId) {
  return taskId === 0 || taskId === '0';
}

function isDrawPicture(taskId) {
  return taskId === 7 || taskId === '7';
}

function isLightRedLedTask(taskId) {
  return taskId === 9 || taskId === '9';
}

function coordToString(coord) {
  return [
      Math.round(parseFloat(coord[0])),
      Math.round(parseFloat(coord[1]))
  ].toString();
}
