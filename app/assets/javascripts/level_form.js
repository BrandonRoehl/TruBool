function addInput() {
}

function clearInput() {
    var node = event.target;
    while (node.className != "input_set") {
        node = node.parentNode;
        // console.log(node.nodeName);
        // console.log(node);
    }
    node.remove();
}

function addInput() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("inputs").innerHTML += this.responseText;
        }
    };
    xhttp.open("GET", "/levels/new/input", true);
    xhttp.send();
}
