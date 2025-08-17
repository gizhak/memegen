
'use strict'

// var gImgs = [{
//     id: 1,
//     url: 'img/meme-imgs/1.jpg',
//     keywords: ['funny', 'cat']
// }]

// console.log(gImgs)

function onInit() {
    console.log('Gallery initialized')
    renderImg()

}


function renderImg() {
    console.log('Rendering images...')

    const images = getImgs()
    console.log('Images from service:', images)

    var elImgs = document.querySelector('.box')
    console.log('Container found:', elImgs)

    var strHtml = images.map(function (img, index) {
        return `
            <span style="--i:${index + 1}" class="image-container" 
            ondblclick="onSelectImg(this)" 
            ontouchend="handleImageTap(this)" 
            data-image="${img.id}">
                <img src="${img.url}" alt="Meme ${img.id}" class="meme-image">
            </span>
        `
    }).join('')
    // console.log('Generated HTML:', strHtml)


    elImgs.innerHTML = strHtml

    console.log('Images rendered successfully')

    initCarousel()

}

function onSelectImg(elImgs) {
    console.log('Image Clicked', elImgs)

    var elImg = elImgs.querySelector('img')


    var imgSrc = elImg.src
    var imgClass = elImgs.getAttribute('data-image')
    var imgAlt = elImg.alt

    console.log('Image data:')
    console.log('- Source:', imgSrc)
    console.log('- DATA:', imgClass)
    console.log('- Alt:', imgAlt)


    var elImgSelect = document.querySelector('.image-container')
    console.log(elImgSelect)

    var selectedImageData = {
        id: imgClass,
        src: imgSrc,
        alt: imgAlt,
        timestamp: Date.now()
    }

    saveToStorage('selectedImage', selectedImageData)
    console.log('Saved to localStorage:', selectedImageData)

    const msg = document.createElement('div')
    msg.textContent = 'Image Selected!'
    // msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#4CAF50;color:white;padding:15px;border-radius:8px;z-index:1000'
    msg.style.cssText = `
    position:fixed;
    top:15%;
    right:40%;
    background:#4CAF50;
    color:white;
    padding:15px;
    border-radius:8px;
    z-index:1000;
    `
    document.body.appendChild(msg)

    setTimeout(() => window.location.href = 'editor.html', 1000)

}
