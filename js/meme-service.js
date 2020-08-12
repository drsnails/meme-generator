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



var gMeme = {
    selectedImgId: 3,
    selectedLineIdx: 0,
    selectedFont: 'Impact',
    lines: [
        {
            txt: 'Something Didnt work',
            size: 40,
            align: 'left',
            color: 'black',
            pos: { x: 0, y: 40 }
        }
    ]
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

function createMeme(imgId) {
    let meme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        selectedFont: 'Impact',
        lines: [
            {
                txt: 'Type something',
                size: 40,
                align: 'left',
                color: 'black',
                pos: { x: gCanvas.width +200, y: 40}
            }
        ]
    }
    return meme
}

function setNewgMeme(imgId) {
    gMeme = createMeme(imgId)
}
function getFont() {
    let font = gMeme.selectedFont
    return font
}

function changeLine(text) {
    let lineIdx = gMeme.selectedLineIdx
    let currLine = gMeme.lines[lineIdx]
    currLine.txt = text
           
}


function incFontSize() {
    let lineIdx = gMeme.selectedLineIdx
    let currLine = gMeme.lines[lineIdx]
    currLine.size++
}

function decFontSize() {
    let lineIdx = gMeme.selectedLineIdx
    let currLine = gMeme.lines[lineIdx]
    currLine.size--
}


function incLinePos() {
    let lineIdx = gMeme.selectedLineIdx
    let currLine = gMeme.lines[lineIdx]
    currLine.pos.y--
}

function decLinePos() {
    let lineIdx = gMeme.selectedLineIdx
    let currLine = gMeme.lines[lineIdx]
    currLine.pos.y++
}

