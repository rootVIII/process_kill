/* eslint-disable no-unused-vars */
function onRowDragStart(event) {
    /* eslint-enable no-unused-vars */
    console.log(event.target.id);
    event.dataTransfer.setData('text/plain', event.target.id);
}

/* eslint-disable no-unused-vars */
function onRowDragover(event) {
    /* eslint-enable no-unused-vars */
    event.preventDefault();
}

/* eslint-disable no-unused-vars */
function onRowDrop(event) {
    /* eslint-enable no-unused-vars */

    event.preventDefault();
    let dropID = event.dataTransfer.getData('text/plain');
    event.target.appendChild(document.getElementById(dropID));
}
