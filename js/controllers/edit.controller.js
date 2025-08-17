'use strict'

// ========== EDIT CONTROLLER ==========
let gEdit = null

// ========== INITIALIZATION ==========
function onInitEditor() {
    console.log('Editor initialized')

    // Initialize model
    gEdit = createEditModel()

    // Initialize canvas
    if (!initCanvas()) {
        console.error('Failed to initialize canvas')
        return
    }

    // Load selected image
    loadSelectedImg()

    // Initialize event listeners
    setTimeout(() => {
        initEventListeners()
    }, 100)
}

function loadSelectedImg() {
    const imgData = loadFromStorage('selectedImage')
    console.log('Loading image data:', imgData)

    if (imgData) {
        setSelectedImage(gEdit, imgData)
        displayImg(imgData)
    } else {
        console.log('No image selected')
    }
}

function displayImg(imgData) {
    renderImageToCanvas(imgData).then(() => {
        console.log('Image loaded to canvas')
    }).catch(error => {
        console.error('Failed to load image:', error)
    })
}

// ========== EVENT LISTENERS ==========
function initEventListeners() {
    const canvas = getCanvas()
    if (!canvas) return

    // Mouse events for emoji dragging
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mouseleave', onMouseUp)
    canvas.addEventListener('dblclick', onDoubleClick)

    console.log('Event listeners initialized')
}

// ========== MOUSE EVENTS ==========
function onMouseDown(event) {
    const pos = getCanvasPosition(event)

    if (startEmojiDrag(gEdit, pos.x, pos.y)) {
        renderEdit(gEdit)
    }
}

function onMouseMove(event) {
    if (!gEdit.isDragging) return

    const pos = getCanvasPosition(event)

    if (updateEmojiDrag(gEdit, pos.x, pos.y)) {
        renderEdit(gEdit)
    }
}

function onMouseUp(event) {
    if (stopEmojiDrag(gEdit)) {
        // Optional: Could save state here
    }
}

function onDoubleClick(event) {
    const pos = getCanvasPosition(event)

    if (deleteEmojiAtPosition(gEdit, pos.x, pos.y)) {
        renderEdit(gEdit)
        console.log('Emoji deleted via double click')
    }
}

// ========== TEXT CONTROLS ==========
function drawText(event) {
    const pos = getCanvasPosition(event)
    const textInput = document.querySelector('.canvas-text')
    const text = textInput.value.trim()

    if (!text) return

    const closestIdx = addTextAtPosition(gEdit, text, pos.x, pos.y)
    textInput.value = ''

    renderEdit(gEdit)
    console.log('Text added to position:', closestIdx)
}

function onAddTextLine() {
    const textInput = document.querySelector('.canvas-text')
    const text = textInput.value.trim()

    if (!text) {
        alert('Please type some text first!')
        return
    }

    if (addTextToEdit(gEdit, text)) {
        textInput.value = ''
        renderEdit(gEdit)
        console.log('Text added!')
    }
}

function onBtnUp() {
    moveTextToPrevPosition(gEdit)
    selectText()
    console.log('Selected text:', gEdit.selectedTextIdx)
}

function onBtnDown() {
    moveTextToNextPosition(gEdit)
    selectText()
    console.log('Selected text:', gEdit.selectedTextIdx)
}

function selectText() {
    const textInput = document.querySelector('.canvas-text')
    const selectedText = getSelectedText(gEdit)
    textInput.value = selectedText.txt
    renderEdit(gEdit)
}

function onDelTextLine() {
    deleteSelectedText(gEdit)
    const textInput = document.querySelector('.canvas-text')
    textInput.value = ''
    renderEdit(gEdit)
    console.log('Text deleted')
}

// ========== TEXT FORMATTING ==========
function onBtnIncreaseFontSize() {
    const newSize = increaseFontSize(gEdit)
    if (newSize) {
        renderEdit(gEdit)
        console.log('Font size increased to:', newSize)
    }
}

function onBtnDecreaseFontSize() {
    const newSize = decreaseFontSize(gEdit)
    if (newSize) {
        renderEdit(gEdit)
        console.log('Font size decreased to:', newSize)
    }
}

function onBtnAlignLeft() {
    if (alignText(gEdit, 'left')) {
        renderEdit(gEdit)
        console.log('Text aligned left')
    }
}

function onBtnAlignCenter() {
    if (alignText(gEdit, 'center')) {
        renderEdit(gEdit)
        console.log('Text aligned center')
    }
}

function onBtnAlignRight() {
    if (alignText(gEdit, 'right')) {
        renderEdit(gEdit)
        console.log('Text aligned right')
    }
}

function onBtnFontFamilySelector(fontFamily) {
    if (updateTextFont(gEdit, 'fontFamily', fontFamily)) {
        renderEdit(gEdit)
        console.log('Font changed to:', fontFamily)
    }
}

function onBtnUnderline() {
    const isUnderlined = toggleTextUnderline(gEdit)
    if (isUnderlined !== false) {
        renderEdit(gEdit)
        console.log('Underline toggled:', isUnderlined)
    }
}

function onBtnColorPicker() {
    const colorPicker = document.querySelector('#colorPicker')
    if (colorPicker) {
        colorPicker.click()
    }
}

function onColorChange(selectedColor) {
    if (updateTextFont(gEdit, 'color', selectedColor)) {
        renderEdit(gEdit)
        console.log('Color changed to:', selectedColor)
    }
}

// ========== EMOJI CONTROLS ==========
function onAddEmoji(emoji) {
    const emojiIdx = addEmojiToPosition(gEdit, emoji)

    // Ensure no emoji is selected after adding (no red border)
    gEdit.selectedEmojiIdx = -1
    gEdit.isDragging = false

    renderEdit(gEdit)
    console.log('Emoji added at index:', emojiIdx)
}

function onPrevEmoji() {
    // TODO: Implement emoji carousel navigation
    console.log('Previous emoji page')
}

function onNextEmoji() {
    // TODO: Implement emoji carousel navigation
    console.log('Next emoji page')
}

// ========== UTILITY CONTROLS ==========
function onBtnDownload() {
    downloadCanvas('Edit_Image.png')
    console.log('Edit downloaded')
}

// function onUploadImg(url) {
//     // console.log('url:', url)
//     window.open(`https://www.facebook.com/`)
// }

function onBtnShare() {

    downloadCanvas('My_Meme.png')

    const msg = document.createElement('div')
    msg.textContent = 'Downloaded! Now you can share it anywhere!'
    msg.style.cssText = `
        position:fixed;
        top:15%;
        left:50%;
        transform:translateX(-50%);
        background:#2196F3;
        color:white;
        padding:15px;
        border-radius:8px;
        z-index:1000;
    `
    document.body.appendChild(msg)

    setTimeout(() => document.body.removeChild(msg), 3000)
}

// ========== DEBUG FUNCTIONS ==========
function getEditState() {
    return {
        edit: gEdit,
        textStats: getTextStats(gEdit),
        emojiStats: getEmojiStats(gEdit)
    }
}

function logEditState() {
    console.log('Current edit state:', getEditState())
}