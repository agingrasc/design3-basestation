var URL = "http://localhost:12345/go-to-position/";

function goto_position() {
    var x_position = document.getElementById("x");
    var y_position = document.getElementById("y");
    console.log(x_position.value);
    console.log(y_position.value);
    post_new_position(x_position.value, y_position.value);
}

function post_new_position(pos_x, pos_y) {
    var payload = {
        x: pos_x,
        y: pos_y
    };
    var data = JSON.stringify(payload);

    fetch(URL, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: data
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(JSON.stringify(data));
        });
}
