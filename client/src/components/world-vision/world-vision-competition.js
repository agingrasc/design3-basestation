export class WorldVisionCompetition {

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
    }

    start() {
        console.log("Started");
    }
}
