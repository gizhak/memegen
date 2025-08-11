'use strict'


var gImg = []

_createImgs()

function getImgs() {
    return gImg
}

function _createImgs() {
    var imgs = [
        { id: 1, url: 'img/meme-imgs/1.jpg', keywords: ['funny', 'cat'] },
        { id: 2, url: 'img/meme-imgs/2.jpg', keywords: ['dog', 'surprised'] },
        { id: 3, url: 'img/meme-imgs/3.jpg', keywords: ['baby', 'happy'] },
        { id: 4, url: 'img/meme-imgs/4.jpg', keywords: ['cat', 'angry'] },
        { id: 5, url: 'img/meme-imgs/5.jpg', keywords: ['success', 'kid'] },
        { id: 6, url: 'img/meme-imgs/6.jpg', keywords: ['alien', 'history'] },
        { id: 7, url: 'img/meme-imgs/7.jpg', keywords: ['laugh', 'man'] },
        { id: 8, url: 'img/meme-imgs/8.jpg', keywords: ['wonka', 'sarcastic'] },
        { id: 9, url: 'img/meme-imgs/9.jpg', keywords: ['baby', 'evil'] }
    ]

    gImg = imgs

    console.log('Images created:', gImg)
}