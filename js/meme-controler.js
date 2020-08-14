'use strict'

var gCanvas;
var gCtx;
var gIsMouseDown = false
var gIsDownload = false

window.addEventListener('resize', function () {
    // rendergMeme()
})

function initCanvas() {
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');
}

function rendergMeme() {
    let img = getImg()
    var elImg = new Image();
    resizeCanvasByCont()
    drawImg(elImg, img)
    elImg.src = img.url
    if (gMeme.lines.length) renderLineTxtInput()
}

function drawImg(elImg, img) {
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
        drawLines(img)
    }
}



function drawLines(img) {
    let lines = gMeme.lines
    lines.forEach((line, idx) => {
        setLinePosAndAlign(line)
        let fontDetails = getFontDetails(line.size)
        line.pos
        drawText(line.txt, line.align, line.color, line.strokeColor, fontDetails, line.pos.x, line.pos.y)

        if (idx === gMeme.selectedLineIdx) {
            markLine(line)
        }

    })


}




function drawText(text, alignDir, fillColor, strokeColor, fontDetails, x, y) {
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = fillColor;
    gCtx.font = fontDetails;
    gCtx.lineWidth = '2';
    gCtx.textAlign = alignDir;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}


function markLine(line) {
    if (gIsDownload) return
    var t = gCtx.measureText(line.text)
    gCtx.globalCompositeOperation = "multiply";
    gCtx.rect(0, line.pos.y + line.size / 8, gCanvas.width, -line.size);
    gCtx.strokeStyle = '#888';
    gCtx.stroke();
    gCtx.fillStyle = "#ddd";
    gCtx.fillRect(0, line.pos.y + line.size / 8, gCanvas.width, -line.size);
    gCtx.globalCompositeOperation = "source-over";

}


function handleMouseDrag(ev) {

    if (ev.type === 'mousedown') {
        onSelectCLickedLine(ev)
        onMouseDown()
    }

    if (ev.type === 'mouseup') {
        gIsMouseDown = false
    }
}

function handleTouch(ev) {
    ev.preventDefault()
    if (ev.type === 'touchstart') {
        onSelectTouchedLine(ev)
        onTouchStart()
    }

    if (ev.type === 'touchend') {
        gIsMouseDown = false
    }
}



function onMouseDown() {
    if (gIsMouseDown) return
    gIsMouseDown = true
    const elMyCanvas = document.querySelector('.canvas-container');
    elMyCanvas.onmousemove = onDrag;
}
function onTouchStart() {
    if (gIsMouseDown) return
    gIsMouseDown = true
    const elMyCanvas = document.querySelector('.canvas-container');
    elMyCanvas.ontouchmove = onDragTouch;
}

function onDrag(event) {
    if (!gIsMouseDown) return;

    setTimeout(() => {
        let offsetY;
        ({ offsetY } = event)
        setTextPosition(offsetY)
        rendergMeme()
    }, 0);
}

function onDragTouch(event) {
    if (!gIsMouseDown) return;

    setTimeout(() => {
        let offsetY = event.touches[0].pageY - event.touches[0].target.offsetTop;
        setTextPosition(offsetY)
        rendergMeme()
    }, 0);
}


function onSelectCLickedLine(ev) {
    let offsetX, offsetY;
    ({ offsetX, offsetY } = ev)
    selectClickedLine({ offsetX, offsetY })
    rendergMeme()
}

function onSelectTouchedLine(ev) {
    let offsetX = ev.touches[0].pageX - ev.touches[0].target.offsetLeft;
    let offsetY = ev.touches[0].pageY - ev.touches[0].target.offsetTop;
    selectClickedLine({ offsetX, offsetY })
    rendergMeme()
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
    goTopPage()
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


function onChangeStrokeColor(elStrokeColor) {
    changeStrokeColor(elStrokeColor.value)
    rendergMeme()

}

function onChangeFillColor(elFillColor) {
    changeFillColor(elFillColor.value)
    rendergMeme()
}

function onDownloadImg_(elLink) {
    // rendergMeme()
    // ev.preventDefault()
    var imgContent = gCanvas.toDataURL('image/jpg');
    elLink.href = imgContent


}

function onDownloadImg() {
    gIsDownload = true
    rendergMeme()
    setTimeout(() => {
        var url = gCanvas.toDataURL('image2/jpg', 1.0);
        var link = document.getElementById("dn-link")
        link.href = url
        link.click()
        gIsDownload = false
        rendergMeme()
    }, 50);
}


function goTopPage() {
    const elTopPage = document.querySelector('.top-page');
    elTopPage.click()
}

// offsetX = ev.touches[0].pageX - ev.touches[0].target.offsetLeft;
// offsetY = ev.touches[0].pageY - ev.touches[0].target.offsetTop;
