'use strict'


var gKeywords = { 'happy': 1, 'funny': 1 }
var gImgs = [
    { id: 1, url: 'img/img-squares/1.jpg', keywords: ['happy'] },
    { id: 2, url: 'img/img-squares/2.jpg', keywords: ['happy'] },
    { id: 3, url: 'img/img-squares/3.jpg', keywords: ['happy'] },
    { id: 4, url: 'img/img-squares/4.jpg', keywords: ['happy'] },
    { id: 5, url: 'img/img-squares/5.jpg', keywords: ['happy'] },
    { id: 6, url: 'img/img-squares/6.jpg', keywords: ['happy'] },
    { id: 7, url: 'img/img-squares/7.jpg', keywords: ['happy'] },
    { id: 8, url: 'img/img-squares/8.jpg', keywords: ['happy'] },
    { id: 9, url: 'img/img-squares/9.jpg', keywords: ['happy'] },
    { id: 10, url: 'img/img-squares/10.jpg', keywords: ['happy'] },
    { id: 11, url: 'img/img-squares/11.jpg', keywords: ['happy'] },
    { id: 12, url: 'img/img-squares/12.jpg', keywords: ['happy'] },
    { id: 13, url: 'img/img-squares/13.jpg', keywords: ['happy'] },
];
var gMeme = createMeme()


function createMeme(imgId=1) {
    let meme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        selectedFont: 'Impact',
        lines: [createLine()]
    }
    return meme
}

function createLine() {
    let line = {
        txt: '"Somthing funny"',
        size: 35,
        align: 'center',
        color: 'black',
    }

    return line

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
function getFont() {
    let font = gMeme.selectedFont
    return font
}

function changeLineTxt(text) {
    let currLine = getSelectedLine()
    currLine.txt = text

}


function incFontSize() {
    let currLine = getSelectedLine()
    currLine.size++
}

function decFontSize() {
    let currLine = getSelectedLine()
    currLine.size--
}


function incLinePos() {
    let currLine = getSelectedLine()
    currLine.pos.y -= 5
}

function decLinePos() {
    let currLine = getSelectedLine()
    currLine.pos.y += 5
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
        linePosY = lineLen*line.size
    }

    line['pos'] = { x: gCanvas.width / 2, y: linePosY }
    lines.push(line)
    toggleLine()
}

function deleteLine() {
    let currLineIdx = gMeme.selectedLineIdx
    gMeme.lines.splice(currLineIdx, 1)
    gMeme.selectedLineIdx =gMeme.lines.length-1
}



function setFontFamily(font) {
    gMeme.selectedFont = font
}
function toggleLine() {
    let linesLen = gMeme.lines.length
    let currLineIdx = gMeme.selectedLineIdx
    gMeme.selectedLineIdx = (currLineIdx + 1 === linesLen) ? 0 : currLineIdx + 1
}

function getSelectedLineTxt() {
    let selectedLineIdx = gMeme.selectedLineIdx
    let lineTxt = gMeme.lines[selectedLineIdx].txt
    return lineTxt
}

function changeLineTxtAlign(alignDir) {
    let currLine = getSelectedLine()
    currLine.align = alignDir
}

function setLinePosAndAlign(currLine) {
    
    switch (currLine.align) {
        case 'left':
            currLine.pos.x = 5
            currLine.align = 'start'
            return 
        case 'right':
            currLine.pos.x = gCanvas.width-5
            currLine.align = 'end'
            return 
        
        case 'center':
            currLine.pos.x = gCanvas.width/2
            currLine.align = 'center'
            return
    }
}




function getSelectedLine() {
    let lineIdx = gMeme.selectedLineIdx
    let currLine = gMeme.lines[lineIdx]
    return currLine
}

function resetLineTxt(){
    gMeme.lines[0].txt = ''
}