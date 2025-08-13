'use strict'

function onInitEditor() {
    console.log('Editor initialized')
    loadSelectedImg()
    // displayImg(imgData)
}


function loadSelectedImg() {

    var imgData = loadFromStorage('selectedImage')
    console.log(imgData)

    if (imgData) {
        console.log('Loaded image data:', imgData)
        displayImg(imgData)
    } else {
        console.log('No meme selected')
    }

}

function displayImg(imgData) {
    console.log('Displaying Image URL:', imgData.src)

    var canvas = document.querySelector('canvas')
    console.log(canvas)
    var ctx = canvas.getContext('2d')

    var img = new Image()
    img.onload = function () {
        // נקה את הקנבס
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // הצג את התמונה בקנבס
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        console.log('Image loaded to canvas')
    }

    img.onerror = function () {
        console.error('Failed to load image:', imgData.src)
    }

    img.src = imgData.src

}