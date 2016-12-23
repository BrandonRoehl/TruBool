function clearInput() {
    var node = event.target;
    while (node.nodeName != "PAPER-INPUT") {
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
            var toNode = document.createElement('div');
            toNode.innerHTML = this.response;
            document.getElementById("inputs").appendChild(toNode.firstChild);
        }
    };
    xhttp.open("GET", "/levels/new/input", true);
    xhttp.send();
}

