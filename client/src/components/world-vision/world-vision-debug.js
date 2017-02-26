export class WorldVisionDebug {

    constructor() {
        this.canvasId = "monCanvas";
        this.x_position = 0;
        this.y_position = 0;
        this.imagePath = "./src/components/world-vision/image14.jpg";
        this.chosen_x_position = 0;
        this.chosen_y_position = 0;
    }

    attached() {
        var canvas = document.getElementById(this.canvasId);
        var context = canvas.getContext('2d');

        var self = this;
        canvas.addEventListener('mousemove', function(evt) {
            var mousePos = self.getMousePos(canvas, evt);
            self.x_position = Math.floor(mousePos.x);
            self.y_position = Math.floor(mousePos.y);
        }, false);
        canvas.addEventListener('click', function(evt) {
            self.chosen_x_position = self.x_position;
            self.chosen_y_position = self.y_position;
        }, false);
        this.update();
    }
    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    update() {
        var myVar = setInterval(refresh, 60);
        var canvas = document.getElementById(this.canvasId);
        var context = canvas.getContext('2d');

        var ws = new WebSocket("ws://localhost:3000");
        ws.onopen = function() {
            ws.send("refresh_image");
        };

        var self = this;

        function refresh() {
            ws.send("refresh_image");
            ws.onmessage = function(evt) {
                self.imagePath = "data:image/png;base64," + evt.data;
            };
        }

    }
}
