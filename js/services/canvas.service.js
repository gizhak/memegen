'use strict'

// ========== CANVAS SERVICE ==========
const gCanvasService = {
    canvas: null,
    ctx: null
}

function initCanvas() {
    gCanvasService.canvas = document.querySelector('canvas')
    if (!gCanvasService.canvas) {
        console.error('Canvas element not found')
        return false
    }

    gCanvasService.ctx = gCanvasService.canvas.getContext('2d')
    console.log('Canvas initialized successfully')
    return true
}

function getCanvas() {
    return gCanvasService.canvas
}

function getCanvasContext() {
    return gCanvasService.ctx
}

// ========== IMAGE RENDERING ==========
function renderImageToCanvas(imgData) {
    return new Promise((resolve, reject) => {
        if (!gCanvasService.ctx) {
            reject('Canvas not initialized')
            return
        }

        const img = new Image()
        img.onload = function () {
            clearCanvas()
            gCanvasService.ctx.drawImage(img, 0, 0, gCanvasService.canvas.width, gCanvasService.canvas.height)
            console.log('Image rendered to canvas')
            resolve()
        }

        img.onerror = function () {
            console.error('Failed to load image:', imgData.src)
            reject('Image load failed')
        }

        img.src = imgData.src
    })
}

function clearCanvas() {
    if (gCanvasService.ctx && gCanvasService.canvas) {
        gCanvasService.ctx.clearRect(0, 0, gCanvasService.canvas.width, gCanvasService.canvas.height)
    }
}

// ========== TEXT RENDERING ==========
function renderText(textObj, isSelected = false) {
    if (!gCanvasService.ctx || !textObj.txt) return

    const ctx = gCanvasService.ctx

    // Set font properties
    ctx.font = `${textObj.fontSize}px ${textObj.fontFamily}`
    ctx.textAlign = textObj.align
    ctx.textBaseline = 'middle'

    // Set colors based on selection
    if (isSelected) {
        ctx.fillStyle = 'yellow'
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 3
    } else {
        ctx.fillStyle = textObj.color
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
    }

    // Render text
    ctx.fillText(textObj.txt, textObj.x, textObj.y)
    ctx.strokeText(textObj.txt, textObj.x, textObj.y)

    // Render underline if needed
    if (textObj.underline) {
        renderTextUnderline(textObj, isSelected)
    }
}

function renderTextUnderline(textObj, isSelected = false) {
    const ctx = gCanvasService.ctx
    const textWidth = ctx.measureText(textObj.txt).width
    let startX, endX

    // Calculate underline position based on alignment
    switch (textObj.align) {
        case 'center':
            startX = textObj.x - textWidth / 2
            endX = textObj.x + textWidth / 2
            break
        case 'left':
            startX = textObj.x
            endX = textObj.x + textWidth
            break
        case 'right':
            startX = textObj.x - textWidth
            endX = textObj.x
            break
        default:
            startX = textObj.x - textWidth / 2
            endX = textObj.x + textWidth / 2
    }

    const underlineY = textObj.y + textObj.fontSize / 3

    ctx.beginPath()
    ctx.moveTo(startX, underlineY)
    ctx.lineTo(endX, underlineY)
    ctx.lineWidth = 2
    ctx.strokeStyle = isSelected ? 'red' : textObj.color
    ctx.stroke()
}

function renderAllTexts(texts, selectedTextIdx = -1) {
    texts.forEach((text, idx) => {
        if (text.txt) {
            renderText(text, idx === selectedTextIdx)
        }
    })
}

// ========== EMOJI RENDERING ==========
function renderEmoji(emojiObj, isSelected = false) {
    if (!gCanvasService.ctx) return

    const ctx = gCanvasService.ctx

    // Set emoji properties
    ctx.font = `${emojiObj.size}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Render emoji (no selection border ever)
    ctx.fillText(emojiObj.emoji, emojiObj.x, emojiObj.y)
}

function renderAllEmojis(emojis, selectedEmojiIdx = -1) {
    emojis.forEach((emoji, idx) => {
        renderEmoji(emoji, idx === selectedEmojiIdx)
    })
}

// ========== COMPLETE EDIT RENDERING ==========
function renderEdit(edit) {
    if (!edit.selectedImg) {
        console.log('No image selected to render')
        return Promise.resolve()
    }

    return renderImageToCanvas(edit.selectedImg).then(() => {
        renderAllTexts(edit.texts, edit.selectedTextIdx)
        renderAllEmojis(edit.emojis, edit.selectedEmojiIdx)
    }).catch(error => {
        console.error('Error rendering edit:', error)
    })
}

// ========== CANVAS UTILITIES ==========
function getCanvasPosition(event) {
    const rect = gCanvasService.canvas.getBoundingClientRect()
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

function downloadCanvas(filename = 'Meme_Image.png') {
    if (!gCanvasService.canvas) {
        console.error('Canvas not available for download')
        return
    }

    const link = document.createElement('a')
    link.download = filename
    link.href = gCanvasService.canvas.toDataURL('image/png')
    link.click()
}