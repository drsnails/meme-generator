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
    
}






function rendergMeme() {
    let img = getImg()

    const elImg = new Image();
    resizeCanvasByCont()
    drawImg(elImg)
    elImg.src = img.url
    
    if (gMeme.lines.length) renderLineTxtInput()
    
}

function drawImg(img) {

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawLines()
    }
}


function drawLines() {
    // fix to function getLines()
    let lines = gMeme.lines
    lines.forEach((line, idx) => {

        setLinePosAndAlign(line)

        let fontDetails = getFontDetails(line.size)
        line.pos
        drawText(line.txt, line.align, fontDetails, line.pos.x, line.pos.y)
        if (idx === gMeme.selectedLineIdx & !gIsDoneEdit) {
            markLine(line)
        }

    })

}


function drawText(text, alignDir, fontDetails, x, y) {
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = 'white';
    gCtx.font = fontDetails;
    gCtx.lineWidth = '2';


    gCtx.textAlign = alignDir;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}


function markLine(line) {
    gCtx.globalCompositeOperation = "multiply";
    gCtx.rect(0, line.pos.y + line.size/8, gCanvas.width, -line.size);
    gCtx.strokeStyle = '#aaa';
    gCtx.stroke();
    gCtx.fillStyle = "#ddd";
    gCtx.fillRect(0, line.pos.y + line.size/8, gCanvas.width, -line.size);
    gCtx.globalCompositeOperation = "source-over";

}


function getFontDetails(size) {
    let fontFamily = gMeme.selectedFont
    return `${size}px ${fontFamily}`
}






function resizeCanvasByImg(img) {
    gCanvas.width = img.width;
    gCanvas.height = img.height;

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
    initLinePos()
}

function onChangeLineTxt(elLine) {
    changeLineTxt(elLine.value)
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

function onAddLine() {
    addLine()
    rendergMeme()
}

function onSetFontFamily(elFontFam) {
    setFontFamily(elFontFam.value)
    rendergMeme()
}

function onToggleLine() {
    if (!gMeme.lines.length) return
    toggleLine()
    rendergMeme()
}

function renderLineTxtInput() {
    let elInputTxt = document.querySelector('.input-txt');
    let lineTxt = getSelectedLineTxt()
    elInputTxt.value = lineTxt
}

function onChangeLineTxtAlign(alignDir) {
    changeLineTxtAlign(alignDir)
    rendergMeme()
}

function initLinePos() {
    let line = gMeme.lines[0]
    line['pos'] = { x: gCanvas.width / 2, y: line.size }
}

function onDeleteLine() {
    if (gMeme.lines.length === 1) {
        resetLineTxt() 
        rendergMeme()
        return
    }
    deleteLine()
    rendergMeme()
}

