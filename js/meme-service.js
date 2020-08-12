'use strict'


var gKeywords = { 'happy': 1, 'funny': 1 }
var gImgs = [
    { id: 1, url: 'img/img-squares/1.jpg', keywords: ['happy'] },
    { id: 2, url: 'img/img-squares/2.jpg', keywords: ['happy'] },
    { id: 3, url: 'img/img-squares/3.jpg', keywords: ['happy'] },
    { id: 4, url: 'img/img-squares/4.jpg', keywords: ['happy'] },
];

var gMeme = {
    selectedImgId: 4,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I am tired',
            size: 20,
            align: 'left',
            color: 'black',
            pos: { x: 0, y: 0 }
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

function createMeme(imgId){
    meme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Type',
                size: 20,
                align: 'left',
                color: 'black',
                pos: { x: 0, y: 0 }
            }
        ]
    }
}