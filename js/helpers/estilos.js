'use strict'

var gBox
var gIsDragging = false
var gStartX = 0
var gCurrentRotation = 0


function startDrag(e) {
    gIsDragging = true
    gStartX = e.pageX || e.touches[0].pageX
    gBox.style.animationPlayState = 'paused'
    gBox.style.cursor = 'grabbing'
}

function handleDrag(e) {
    if (!gIsDragging) return

    var currentX = e.pageX || e.touches[0].pageX
    var deltaX = currentX - gStartX
    var newRotation = gCurrentRotation + (deltaX * 0.5)

    gBox.style.transform = `perspective(1000px) rotateY(${newRotation}deg)`
}

function endDrag() {
    if (!gIsDragging) return

    gIsDragging = false
    gBox.style.cursor = 'grab'

    var transform = gBox.style.transform.match(/rotateY\(([^)]+)deg\)/)
    if (transform) {
        gCurrentRotation = parseFloat(transform[1])
    }

    setTimeout(function () {
        gBox.style.animationPlayState = 'running'
    }, 1000)
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
        gBox.style.animationPlayState = 'paused'
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



function initCarousel() {
    gBox = document.getElementById('box')

    if (!gBox) {
        console.error('Box element not found!')
        return
    }

    addDragListeners()

    pauseOnHover()
    preventImageDrag()

    console.log('Carousel initialized successfully')
}

document.addEventListener('DOMContentLoaded', initCarousel)