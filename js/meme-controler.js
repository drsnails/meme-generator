'use strict'

var gCanvas;
var gCtx;
window.addEventListener('resize', function () {
    // gCanvas.width = window.innerWidth;
    // gCanvas.height = window.innerHeight;
    init()

})

function init() {
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');
    // drawImg()
    resizeCanvas()
    renderCanvasImg()
    


}


function renderCanvasImg() {
    let img = getImg()
    drawImg(img.url)
    console.log("renderCanvasImg -> img.url", img.url)
}


// function drawImgFromlocal() {
//     var img = new Image()
//     img.src = '/img/2.jpg';
//     img.onload = () => {
//         gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
//     }
// }

function drawImg(imgUrl) {
    const img = new Image();
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawText('hey', gCanvas.width/2, 40)
    }
    img.src = imgUrl;
}


// function renderCanvas(img) {
//     gCanvas.width = img.width;
//     gCanvas.height = img.height;
//     gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
// }

function draw(ev) {
    // console.log(gCanvas);
    const { offsetX, offsetY } = ev;
    drawText('sdsdsd', offsetX, offsetY)
}

function drawText(text, x, y) {
    gCtx.font = '40px impact';
    gCtx.lineWidth = '2';
    
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = 'white';
    
    gCtx.textAlign = 'center';
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}


function resizeCanvas() {

    const elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
}


function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}