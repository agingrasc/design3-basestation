export class Timer {
    constructor() {
        this.begin = 0;
    }

    startTimer() {
        var myVar = setInterval(myTimer, 1000);
        var self = this;
        var d = new Date();
        this.begin = d.valueOf();

        function myTimer() {
            var d = new Date();
            self.time = d.valueOf();
        }
    }
}
