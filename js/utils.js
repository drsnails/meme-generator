'use strict'




var gCurrShape = 'circle';
var gIsMouseDown = false
var gLastPos = {};
var gCurrPos = {};
var gShapeColor = '#398fd6'
// var gCanvasColor = 'wheat'

function init() {
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');
    gIsMouseDown = false
    initPositions()
    initColors()
    resizeCanvas();


    window.addEventListener('resize', resizeCanvas)


}

function initPositions() {
    gLastPos = {
        x: 0,
        y: 0
    };
    gCurrPos = {}
}

function initColors() {
    document.getElementById('color').value = '#398fd6'
    document.getElementById('fill-color').value = '#f0d6c5'
    gCtx.fillStyle = '#f0d6c5';
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height);
}


function handleMouseDrag(ev) {
    if (ev.type === 'mousedown') {
        onMouseDown()
    }

    if (ev.type === 'mouseup') {
        initPositions()
        gIsMouseDown = false
    }
}


function onMouseDown() {
    if (gIsMouseDown) return
    gIsMouseDown = true
    const elMyCanvas = document.querySelector('.canvas-container');
    elMyCanvas.onmousemove = onDraw;
    // document.onmousemove = handleMouseMove;


    // var intervalID = setInterval(() => {
    //     onDraw()

    //     if (!gIsMouseDown) clearInterval(intervalID)
    // }, 60)

}


function onDraw(event) {
    if (!gIsMouseDown) return;
    gCurrPos = {
        x: event.offsetX,
        y: event.offsetY
        // x: event.pageX,
        // y: event.pageY - 120
    };
    let size = findDistance()
    draw(size)
    gLastPos = {
        x: gCurrPos.x,
        y: gCurrPos.y
    };


}



function findDistance() {
    if (gLastPos.x === 0 && gLastPos.y === 0) return 2
    let diffX = gLastPos.x - gCurrPos.x
    let diffY = gLastPos.y - gCurrPos.y
    let dist = Math.sqrt(diffX ** 2 + diffY ** 2)
    return dist
}



function drawTriangle(x, y) {
    gCtx.beginPath();
    gCtx.moveTo(x, y);
    gCtx.lineTo(130, 330);
    gCtx.lineTo(50, 370);
    // gCtx.lineTo(x,y);w
    gCtx.closePath();  //insted of lineTo(x,y) 
    gCtx.strokeStyle = 'blue';
    gCtx.stroke();
    gCtx.fillStyle = 'hotpink';
    gCtx.fill();
}

function drawRect(size) {
    gCtx.beginPath();
    gCtx.rect(gCurrPos.x - size / 2, gCurrPos.y - size / 2, size, size); /// x, y, width, height
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.fillStyle = gShapeColor;
    gCtx.fillRect(gCurrPos.x - size / 2, gCurrPos.y - size / 2, size, size); /// x, y, width, height
}

function drawArc(size) {

    gCtx.beginPath();
    gCtx.lineWidth = '6';
    gCtx.arc(gCurrPos.x, gCurrPos.y, size, 0, 2 * Math.PI); /// x, y, radius, startAngle, endAngle
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.fillStyle = gShapeColor;
    gCtx.fill();

}


function onClearCanvas() {
    clearCanvas()
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}


function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-image.jpg';
}



function resizeCanvas() {// || wrong function name

    const elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
    initColors()//not needed / wrong function name
    initPositions()
}

function drawImg() {
    const elImg = document.querySelector('img');
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
}






function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}


function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
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
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
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

function drawImgFromlocal() {
    var img = new Image()
    img.src = './img/1.jpg';
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
    }
}

function renderCanvas(img) {
    gCanvas.width = img.width;
    gCanvas.height = img.height;
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}


// offsetX = ev.touches[0].pageX - ev.touches[0].target.offsetLeft;
// offsetY = ev.touches[0].pageY - ev.touches[0].target.offsetTop;