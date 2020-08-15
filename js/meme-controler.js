'use strict'

var gCanvas;
var gCtx;
var gIsMouseDown = false
var gIsDownload = false
var gKeyWordsLimit = 5


function init() {
    let elClearContainer = document.querySelector('.clear-container');
    elClearContainer.style.display = 'none'
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');
    getSavedMemesFromeStorage()
    renderImgs()
    createKeyWords()
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

function onShowClearBtn() {
    if (gSavedMemes.length === 0) return
    let elClearContainer = document.querySelector('.clear-container');
    let elClearBtn = document.querySelector('.clear-btn');
    elClearContainer.style.display = 'flex'
    elClearBtn.classList.remove('hidden')

}

function onHideClearBtn() {
    let elClearContainer = document.querySelector('.clear-container');
    let elClearBtn = document.querySelector('.clear-btn');
    elClearContainer.style.display = 'none'
    elClearBtn.classList.add('hidden')
}

function onRenderSavedMemes() {
    let elGalleryContainer = document.querySelector('.gallery-container');
    if (!gSavedMemes.length) {
        elGalleryContainer.innerHTML = '<h1>There are no saved Memes</h1>'
    } else {
        let savedMemesImgs = getSavedMemes()
        let strHTMLs = savedMemesImgs.map(meme => {
            return `
            
            <div class="meme-img" >
                <img onclick="onStartSavedMeme('${meme.id}'), onToggleBtnActive(null)" class="img img${meme.id}" 
                src="img/img-squares/${meme.selectedImgId}.jpg" alt="">
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
        strHTMLs += `<span onclick="onSearchKey('${key}'), onChangeBtnToGallery()" style="font-size: ${getFontSize(keyWords[key])}em">${key}</span>`
        if (count >= gKeyWordsLimit) break
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


function onStartSavedMeme(memeId) {
    setSavedMemeToGlobal(memeId)
    onOpenEdit()
    rendergMeme()
    goTopPage()
    // initLinePos()
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

function onChangeBtnToGallery() {
    let elNavBtns = document.querySelectorAll('.nav-btns button');
    elNavBtns.forEach(elBtn => {
        if (elBtn.classList.contains('gallery-btn')) {
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
    if (!keyWord) return
    setFilterBy(keyWord)
    updateKeyWords(keyWord)
    renderKeyWords()
    renderImgs()
    saveToStorage(KEYWORDS, gKeywords)
    onChangeBtnToGallery()
}

function onChangeSearchVal() {
    let elSearchInput = document.querySelector('.search-input');
    if (!elSearchInput.value) {
        setFilterBy('')
        updateKeyWords(key)
        renderKeyWords()
        renderImgs()
        saveToStorage(KEYWORDS, gKeywords)
    }
}


function onSearchKey(key) {
    setFilterBy(key)
    updateKeyWords(key)
    renderKeyWords()
    renderImgs()
    saveToStorage(KEYWORDS, gKeywords)
}

function onShowAll() {
    setFilterBy('')
    renderImgs()
}



function getFontSize(num) {
    // num = (num <= 30) ? num : 30
    // return (13 + num) / 16
    let t = normalizeSearchCount(num)
    return t
}

function onSaveMeme() {
    addSavedMeme()
    saveToStorage(SAVEDMEME, gSavedMemes)
}

function showHidePopUp() {
    var elPopUp = document.getElementById("myPopup");
    if (elPopUp.classList.contains('show')) {
        elPopUp.classList.remove("show");
    } else {
        elPopUp.classList.add("show");
        setTimeout(() => {
            elPopUp.classList.remove("show");
        }, 2000);
    }
}

function onClearSavedMemes() {
    clearSavedMemes()
    onHideClearBtn()
    onRenderSavedMemes()
}


function onToggleKeyWordsNum(elBtn) {
    
    if (gKeyWordsLimit <= 5) {
        gKeyWordsLimit = Infinity
        elBtn.innerText = 'Less'
    } else {
        gKeyWordsLimit = 5
        elBtn.innerText = 'More'
    }
    renderKeyWords()
}



function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}


function uploadImg(elForm, ev) {
    ev.preventDefault();
    gIsDownload = true
    rendergMeme()
    let elShareContainer = document.querySelector('.share-container')
    setTimeout(() => {
        document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");
        function onSuccess(uploadedImgUrl) {
            uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
            elShareContainer.innerHTML = `
            <a onclick="removeLink(this)" class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
            <i class="fab fa-facebook"></i>
            </a>`
        }
    
        doUploadImg(elForm, onSuccess);
        gIsDownload = false
        rendergMeme()
    }, 50);
}



function removeLink(elLink) {
    elLink.style.display = 'none'
}


function onImgInput(ev) {
    loadImageFromInput(ev, renderCanvas)
}
function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}