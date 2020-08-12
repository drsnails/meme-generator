'use strict'

var gCanvas;
var gCtx;

function init() {
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');
}

function drawText(text, x, y) {
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = 'red';
    gCtx.fillStyle = 'white';
    gCtx.font = '40px Ariel';
    gCtx.textAlign = 'center';
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}