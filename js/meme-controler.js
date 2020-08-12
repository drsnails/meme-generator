'use strict'

var gCanvas;
var gCtx;
var gIsDoneEdit = false
window.addEventListener('resize', function () {
    rendergMeme()
})

function initCanvas() {
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');

    rendergMeme()

}



function rendergMeme() {
    let img = getImg()

    const elImg = new Image();
    elImg.src = img.url
    resizeCanvasByCont()
    drawImg(elImg)
}

function drawImg(img) {
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawLines()
    }
}


function drawLines() {
    let lines = gMeme.lines
    lines.forEach((line, idx) => {
        let fontDetails = getFontDetails(line.size)
        drawText(line.txt, fontDetails, line.pos.x, line.pos.y)
        if (idx===gMeme.selectedLineIdx & !gIsDoneEdit) {
            markLine(line)
        }

    })

}


function markLine(line) {
    gCtx.globalCompositeOperation = "multiply";
    gCtx.font = "40px sans-serif";
    gCtx.rect(0, line.pos.y - line.size, gCanvas.width, line.pos.y + line.size);
    gCtx.strokeStyle = '#aaa';
    gCtx.stroke();
    gCtx.fillStyle = "#ddd";
    gCtx.fillRect(0, line.pos.y - line.size, gCanvas.width, line.pos.y + line.size );

}


function getFontDetails(size) {
    let fontFamily = gMeme.selectedFont
    return `${size}px ${fontFamily}`
}




function resizeCanvasByImg(img) {
    gCanvas.width = img.width;
    gCanvas.height = img.height;

}


function drawText(text, fontDetails, x, y) {
    gCtx.font = fontDetails;
    gCtx.lineWidth = '2';

    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = 'white';

    gCtx.textAlign = 'center';
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}


function resizeCanvasByCont() {

    const elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
}


function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function onOpenEdit() {
    const elHomePage = document.querySelector('.home-page');
    const elEditPage = document.querySelector('.edit-page');
    elHomePage.classList.add('hidden')
    elEditPage.classList.remove('hidden')

}

function onCloseEdit() {
    const elHomePage = document.querySelector('.home-page');
    const elEditPage = document.querySelector('.edit-page');
    elHomePage.classList.remove('hidden')
    elEditPage.classList.add('hidden')
}

function onStartMeme(imgId) {
    setNewgMeme(imgId)
    onOpenEdit()
    rendergMeme()
}

function onChangeLineTxt(elLine) {
    changeLine(elLine.value)
    rendergMeme()

}

function onIncFontSize() {
    incFontSize()
    rendergMeme()
}


function onDecFontSize() {
    decFontSize()
    rendergMeme()
}


function onIncLinePos() {
    incLinePos()
    rendergMeme()
}

function onDecLinePos() {
    decLinePos()
    rendergMeme()
}