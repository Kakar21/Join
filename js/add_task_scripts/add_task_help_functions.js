function initializeClickedState(index) {
    if (clickedStates[index] === undefined) {
        clickedStates[index] = false;
    }
}


function getClickedState(index) {
    return clickedStates[index];
}


function updateClickedState(index, value) {
    clickedStates[index] = value;
}


function assignClass(element, className) {
    element.classList.add(className);
}


function removeClass(element, className) {
    element.classList.remove(className);
}


function changeSrc(element, src) {
    element.src = src;
}


function switchVisibility(elementId) {
    const element = document.getElementById(elementId);

    if (element.classList.contains('d-none')) {
        removeClass(element, 'd-none');
    } else {
        assignClass(element, 'd-none');
    }
}
