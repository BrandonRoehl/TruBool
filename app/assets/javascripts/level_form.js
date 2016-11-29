function addInput() {
}

function clearInput() {
    var node = event.target;
    while (node.nodeName != "PAPER-INPUT") {
        node = node.parentNode;
        // console.log(node.nodeName);
        // console.log(node);
    }
    node.remove();
}
