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
];
var gMeme = createMeme()


function createMeme(imgId = 1) {
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
        color: 'white',
        strokeColor: 'black'
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





