'use strict'

var gBox
var gIsDragging = false
var gStartX = 0
var gCurrentRotation = 0
var gAnimationId = null

var gLastTap = 0
var gTapTimeout = null



function initCarousel() {
    gBox = document.getElementById('box')

    if (!gBox) {
        console.error('Box element not found!')
        return
    }

    addDragListeners()
    animateCarousel()
    // pauseOnHover()
    preventImageDrag()

    console.log('Carousel initialized successfully')
}


function handleImageTap(element) {
    var currentTime = new Date().getTime()
    var tapLength = currentTime - gLastTap

    clearTimeout(gTapTimeout)

    if (tapLength < 300 && tapLength > 0) {

        onSelectImg(element)
    } else {

        gTapTimeout = setTimeout(function () {

        }, 300)
    }

    gLastTap = currentTime
}


function startDrag(e) {
    e.preventDefault()
    console.log('startDrag called!', e)
    gIsDragging = true
    gStartX = e.pageX || e.touches[0].pageX

    console.log('Animation NONE, gStartX:', gStartX)


    if (gAnimationId) {
        cancelAnimationFrame(gAnimationId)
    }

    gBox.style.cursor = 'grabbing'
}

function handleDrag(e) {
    if (!gIsDragging) return

    console.log('handleDrag called!', gIsDragging)

    var currentX = e.pageX || e.touches[0].pageX
    var deltaX = currentX - gStartX
    var newRotation = gCurrentRotation + (deltaX * 0.2)

    console.log('deltaX:', deltaX, 'newRotation:', newRotation)

    gBox.style.transform = `perspective(1000px) rotateY(${newRotation}deg)`
}

function endDrag() {
    if (!gIsDragging) return

    gIsDragging = false
    gBox.style.cursor = 'grab'
    // gBox.classList.remove('dragging')

    var transform = gBox.style.transform.match(/rotateY\(([^)]+)deg\)/)
    if (transform) {
        gCurrentRotation = parseFloat(transform[1])
    }

    // setTimeout(function () {
    //     gBox.style.animationPlayState = 'running'
    // }, 1000)

    // setTimeout(function () {
    //     gBox.style.animation = 'animate 40s linear infinite'  
    // }, 1000)

    setTimeout(function () {
        animateCarousel()
    }, 300)

}

function addDragListeners() {
    gBox.addEventListener('mousedown', startDrag)
    gBox.addEventListener('touchstart', startDrag)

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('touchmove', handleDrag)

    document.addEventListener('mouseup', endDrag)
    document.addEventListener('touchend', endDrag)
}

function pauseOnHover() {
    gBox.addEventListener('mouseenter', function () {
        if (!gIsDragging) {
            gBox.style.animationPlayState = 'paused'
        }
    })

    gBox.addEventListener('mouseleave', function () {
        if (!gIsDragging) {
            gBox.style.animationPlayState = 'running'
        }
    })
}

function preventImageDrag() {
    var images = gBox.querySelectorAll('img')

    for (var i = 0; i < images.length; i++) {
        images[i].addEventListener('dragstart', function (e) {
            e.preventDefault()
        })
    }
}

function animateCarousel() {
    gCurrentRotation += 0.225
    gBox.style.transform = `perspective(1000px) rotateY(${gCurrentRotation}deg)`
    gAnimationId = requestAnimationFrame(animateCarousel)
}




