export class WorldVision {

    constructor() {
        this.canvasId = "monCanvas"
        this.x_position = 0;
        this.y_position = 0;
        this.imagePath = "./src/components/world-vision/image14.jpg"
    }

    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    start() {
        var canvas = document.getElementById(this.canvasId);
        var context = canvas.getContext('2d');
        var self = this;
        canvas.addEventListener('mousemove', function(evt) {
            var mousePos = self.getMousePos(canvas, evt);
            self.x_position = mousePos.x;
            self.y_position = mousePos.y;
        }, false);
    }
}
