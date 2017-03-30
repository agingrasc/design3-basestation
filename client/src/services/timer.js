export class Timer {
    constructor() {
        this.begin = 0;
        this.time = '00:00';
        this.started = false;
    }

    start() {
        this.currentLap = setInterval(myTimer, 1000);
        var self = this;
        var d = new Date();
        this.begin = d.valueOf();

        function myTimer() {
            var d = new Date();
            var time = d.valueOf() - self.begin;
            var seconds = Math.floor((time / 1000) % 60);
            var minutes = Math.floor(((time / (1000 * 60)) % 60));
            var hours = Math.floor(((time / (1000 * 60 * 60)) % 24));
            self.time = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
        }
    }

    stop() {
        clearInterval(this.currentLap);
    }

    reset() {
        this.stop();
        this.time = '00:00';
    }
}
