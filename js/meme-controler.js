'use strict'

var gCanvas;
var gCtx;
var gIsMouseDown = false
var gIsDownload = false

// localStorage.clear()

function init() {
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');
    // rendergMeme()
    getSavedMemesFromeStorage()
    renderImgs()
    renderKeyWords()
}


function renderImgs() {
    let imgs = getImgs()
    let strHTMLs = imgs.map(img => {
        return `
        <div class="meme-img" >
            <img onclick="onStartMeme(${img.id}), onToggleBtnActive(null)" class="img img${img.id}" 
            src="img/img-squares/${img.id}.jpg" alt="">
        </div>
        `
    })
    let elGalleryContainer = document.querySelector('.gallery-container');
    elGalleryContainer.innerHTML = strHTMLs.join('')
}



function onRenderSavedMemes() {
    let elGalleryContainer = document.querySelector('.gallery-container');
    if (!gSavedMemes.length) {
        elGalleryContainer.innerHTML = '<h1>There are no saved Memes</h1>'
    } else {
        let savedMemesImgs = getSavedMemesImgs()
        let strHTMLs = savedMemesImgs.map(img => {
            return `
            <div class="meme-img" >
                <img onclick="onStartSavedMeme(${img.id}), onToggleBtnActive(null)" class="img img${img.id}" 
                src="img/img-squares/${img.id}.jpg" alt="">
            </div>
            `
        })
        elGalleryContainer.innerHTML = strHTMLs.join('')
    }
} 

function renderKeyWords() {
    let keyWords = getKeyWords()
    let strHTMLs = ``
    let count = 0
    for (let key in keyWords) {
        count++
        strHTMLs += `<span onclick="onSearchKey('${key}')" style="font-size: ${getFontSize(keyWords[key])}em">${key}</span>`
        if (count >= 5) break
    }
    let elKeyWords = document.querySelector('.key-words');
    elKeyWords.innerHTML = strHTMLs
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
    renderImgs()

}

function onStartMeme(imgId) {
    setNewgMeme(imgId)
    onOpenEdit()
    rendergMeme()
    goTopPage()
    initLinePos()
}


function onStartSavedMeme(imgId) {
    setSavedMemeToGlobal(imgId)
    onOpenEdit()
    rendergMeme()
    goTopPage()
    initLinePos()
}


function onToggleBtnActive(btnClass) {
    let elNavBtns = document.querySelectorAll('.nav-btns button');
    elNavBtns.forEach(elBtn => {
        if (elBtn.classList.contains(btnClass)) {
            elBtn.classList.add('active')
        } else {
            elBtn.classList.remove('active')
        } 

    })

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


function filterImgs() {
    return
}

function onSearch() {
    let keyWord = document.querySelector('.search-input').value;
    setFilterBy(keyWord)
    updateKeyWords(keyWord)
    renderKeyWords()
    renderImgs()
}

function onChangeSearchVal() {
    let elSearchInput = document.querySelector('.search-input');
    if (!elSearchInput.value) {
        setFilterBy('')
        updateKeyWords(key)
        renderKeyWords()
        renderImgs()
    }
}


function onSearchKey(key) {
    setFilterBy(key)
    updateKeyWords(key)
    renderKeyWords()
    renderImgs()
}


function getFontSize(num) {

    num = (num <= 15) ? num : 15
    return (13 + num) / 16
}

function onSaveMeme() {
    addSavedMeme()
    saveToStorage(SAVED_KEY, gSavedMemes)
}