'use strict'

const SAVEDMEME = "saved"
const KEYWORDS = "keyWords"
var gFilterKeyWord = ''
var gKeywords;


var gImgs = [
    { id: 1, url: 'img/img-squares/1.jpg', keywords: ['dark', 'politics'] },
    { id: 2, url: 'img/img-squares/2.jpg', keywords: ['aww', 'happy'] },
    { id: 3, url: 'img/img-squares/3.jpg', keywords: ['funny', 'aww', 'happy'] },
    { id: 4, url: 'img/img-squares/4.jpg', keywords: ['funny', 'aww'] },
    { id: 5, url: 'img/img-squares/5.jpg', keywords: ['funny', 'yes'] },
    { id: 6, url: 'img/img-squares/6.jpg', keywords: ['wow', 'aliens'] },
    { id: 7, url: 'img/img-squares/7.jpg', keywords: ['funny', 'aww'] },
    { id: 8, url: 'img/img-squares/8.jpg', keywords: ['funny', 'happy'] },
    { id: 9, url: 'img/img-squares/9.jpg', keywords: ['funny', 'dark'] },
    { id: 10, url: 'img/img-squares/10.jpg', keywords: ['happy', 'politics'] },
    { id: 11, url: 'img/img-squares/11.jpg', keywords: ['funny', 'wow', 'sport'] },
    { id: 12, url: 'img/img-squares/12.jpg', keywords: ['funny', 'scotland'] },
    { id: 13, url: 'img/img-squares/13.jpg', keywords: ['funny'] },
    { id: 14, url: 'img/img-squares/14.jpg', keywords: ['wow', 'aliens', 'pizza'] },
    { id: 15, url: 'img/img-squares/15.jpg', keywords: [] },
    { id: 16, url: 'img/img-squares/16.jpg', keywords: ['funny'] },
    { id: 17, url: 'img/img-squares/17.jpg', keywords: ['happy', 'wow', 'politics'] },
    { id: 18, url: 'img/img-squares/18.jpg', keywords: ['funny'] },
];

var gSavedMemes = [];


function createKeyWords() {
    let keyWords = loadFromStorage(KEYWORDS)
    
    if (!keyWords) {
        gKeywords = { 'happy': 7, 'dark': 2, 'funny': 23, 'aww': 6, 'yes': 1, 'politics': 4, 'aliens': 15, 'animals': 2, 'clouds': 18, 'pizza': 4, 'sport': 8, 'scotland': 15 }
        saveToStorage(KEYWORDS, gKeywords)
    } else {
        gKeywords = keyWords
    }
}



function getImgs() {
    if (!gFilterKeyWord) return gImgs
    return gImgs.filter(img => {
        return img.keywords.includes(gFilterKeyWord)
    })
}


function getKeyWords() {
    return gKeywords
}

var gMeme = createMeme()
function createMeme(imgId = 1) {
    let meme = {
        id: makeId(),
        selectedImgId: imgId,
        selectedLineIdx: 0,
        selectedFont: 'Impact',
        lines: [createLine()]
    }
    return meme
}



function getSavedMemesFromeStorage() {
    if (!loadFromStorage(SAVEDMEME)) return
    gSavedMemes = loadFromStorage(SAVEDMEME)
}

function getSavedMemes() {
    return gSavedMemes
}

function addSavedMeme() {
    let currMeme = JSON.parse(JSON.stringify(gMeme))
    currMeme.id = makeId()
    gSavedMemes.push(currMeme)
}

function createLine() {
    let line = {
        txt: '"Type Something"',
        size: 35,
        align: 'center',
        color: 'white',
        strokeColor: 'black'
    }

    return line

}

function setFilterBy(keyWord) {
    gFilterKeyWord = keyWord
}


function getImg() {
    let imgId = gMeme.selectedImgId
    let img = getImgById(imgId)
    return img
}




function getImgById(imgId) {
    let img = gImgs.find((Img) => {
        return imgId === Img.id
    })
    return img
}


function setNewgMeme(imgId) {
    gMeme = createMeme(imgId)
}

function setSavedMemeToGlobal(memeId) {
    let savedMeme = getSavedMeme(memeId)
    if (!savedMeme) return
    gMeme = savedMeme
}

function getSavedMeme(memeId) {
    return gSavedMemes.find(meme => {
        return (meme.id === memeId)
    })
}

function getFont() {
    let font = gMeme.selectedFont
    return font
}

function changeLineTxt(text) {
    let selectedLine = getSelectedLine()
    selectedLine.txt = text

}


function incFontSize() {
    let selectedLine = getSelectedLine()
    selectedLine.size++
}

function decFontSize() {
    let selectedLine = getSelectedLine()
    selectedLine.size--
}


function incLinePos() {
    let selectedLine = getSelectedLine()
    selectedLine.pos.y -= 5
}

function decLinePos() {
    let selectedLine = getSelectedLine()
    selectedLine.pos.y += 5
}

function addLine() {
    let lines = gMeme.lines
    let lineLen = lines.length
    let line = createLine()
    let linePosY;

    if (lineLen === 0) {
        linePosY = line.size
    } else if (lineLen === 1) {
        linePosY = gCanvas.height - line.size
    } else {
        linePosY = lineLen * line.size
    }

    line['pos'] = { x: gCanvas.width / 2, y: linePosY }
    lines.push(line)
    // toggleLine()
    changeToNewLine()
}

function deleteLine() {
    let selectedLineIdx = gMeme.selectedLineIdx
    gMeme.lines.splice(selectedLineIdx, 1)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}



function setFontFamily(font) {
    gMeme.selectedFont = font
}
function toggleLine() {
    let linesLen = gMeme.lines.length
    let selectedLineIdx = gMeme.selectedLineIdx
    gMeme.selectedLineIdx = (selectedLineIdx + 1 === linesLen) ? 0 : selectedLineIdx + 1
}

function changeToNewLine() {
    let Lineslen = gMeme.lines.length
    gMeme.selectedLineIdx = Lineslen - 1
}



function getSelectedLineTxt() {
    let selectedLineIdx = gMeme.selectedLineIdx
    let lineTxt = gMeme.lines[selectedLineIdx].txt
    return lineTxt
}

function changeLineTxtAlign(alignDir) {
    let selectedLine = getSelectedLine()
    selectedLine.align = alignDir
}

function setLinePosAndAlign(selectedLine) {

    switch (selectedLine.align) {
        case 'left':
            selectedLine.pos.x = 5
            selectedLine.align = 'start'
            return
        case 'right':
            selectedLine.pos.x = gCanvas.width - 5
            selectedLine.align = 'end'
            return

        case 'center':
            selectedLine.pos.x = gCanvas.width / 2
            selectedLine.align = 'center'
            return
    }
}




function getSelectedLine() {
    let lineIdx = gMeme.selectedLineIdx
    let selectedLine = gMeme.lines[lineIdx]
    return selectedLine
}

function resetLineTxt() {
    let selectedLine = gMeme.lines[0]
    selectedLine.txt = ''
    selectedLine.pos.y = selectedLine.size
}

function changeStrokeColor(color) {
    let selectedLine = getSelectedLine()
    selectedLine.strokeColor = color

}

function changeFillColor(color) {
    let selectedLine = getSelectedLine()
    selectedLine.color = color

}

function selectClickedLine({ offsetX, offsetY }) {
    gMeme.lines.forEach((line, idx) => {
        if (offsetY < line.pos.y & offsetY > line.pos.y - line.size) {
            gMeme.selectedLineIdx = idx
        }
    })
}


function setTextPosition(offsetY) {
    let selectedLine = getSelectedLine()
    selectedLine.pos.y = offsetY
}


function updateKeyWords(key) {
    gKeywords[key] = (gKeywords[key]) ? gKeywords[key] + 1 : 1
}


function clearSavedMemes() {
    gSavedMemes = []
    localStorage.removeItem(SAVEDMEME)
}

function normalizeSearchCount(currCount) {
    let maxSearchCount = getMaxSearchCount()
    return (currCount / maxSearchCount)*1 + 0.5

}


function getMaxSearchCount() {
    let max = 1
    for (let key in gKeywords) {
        max = (max >= gKeywords[key]) ? max : gKeywords[key]
    }
    return max
}
