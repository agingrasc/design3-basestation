export class WorldImageService {
    constructor() {
        this.image = "";
        this.message();
    }

    message() {
        /*    var myVar = setInterval(myTimer, 1000);

            var ws = new WebSocket("ws://localhost:3000");
            ws.onopen = function() {
                ws.send("Hello, world");
            };

            function myTimer() {
                console.log("hey");
                ws.send("Hello, world");
                ws.onmessage = function(evt) {
                    this.image = evt.data;
                };
            }*/
    }

    getImage() {
        return this.image;
    }
}
