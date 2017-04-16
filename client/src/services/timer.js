export class Timer {
    constructor() {
        this.lastTime = 0;
        this.isPause = false;
        this.isStarted = false;
        this.totalTime = 0;
        this.time = '00:00';
    }

    start() {
        this.lastTime = new Date().valueOf();

        if (!this.isStarted) {
            this.currentLap = setInterval(this.updateTime.bind(this), 1000);
            this.isStarted = true;
        }
    }

    updateTime() {
        let timeDelta = new Date().valueOf() - this.lastTime;

        this.totalTime = this.totalTime + timeDelta;

        let seconds = Math.floor((this.totalTime / 1000) % 60);
        let minutes = Math.floor(((this.totalTime / (1000 * 60)) % 60));

        this.lastTime = new Date().valueOf();

        this.time = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    }

    stop() {
        clearInterval(this.currentLap);

        this.isStarted = false;
    }

    reset() {
        this.stop();
        this.totalTime = 0;
        this.time = '00:00';
    }

    pause() {
        this.stop();
    }
}
