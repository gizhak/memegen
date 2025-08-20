'use strict'

// ========== TEXT SERVICE ==========

const gTextService = {
    isDragging: false,
    dragOffset: { x: 0, y: 0 }
}

function addTextToEdit(edit, text) {
    if (!text.trim()) {
        return false
    }

    // Use currentTextIdx for adding text in sequence (top, bottom, middle)
    edit.texts[edit.currentTextIdx].txt = text.trim()

    // Move to next text position
    edit.currentTextIdx = (edit.currentTextIdx + 1) % edit.texts.length

    return true
}

function addTextAtPosition(edit, text, x, y) {
    if (!text.trim()) return false

    // Find closest text position
    let closestIdx = 0
    let minDistance = Math.abs(y - edit.texts[0].y)

    for (let i = 1; i < edit.texts.length; i++) {
        const distance = Math.abs(y - edit.texts[i].y)
        if (distance < minDistance) {
            minDistance = distance
            closestIdx = i
        }
    }

    edit.texts[closestIdx].txt = text.trim()
    return closestIdx
}

function deleteSelectedText(edit) {
    const selectedText = getSelectedText(edit)
    selectedText.txt = ''
    return true
}

function updateTextFont(edit, property, value) {
    const selectedText = getSelectedText(edit)
    if (!selectedText.txt) return false

    switch (property) {
        case 'fontSize':
            selectedText.fontSize = Math.max(20, Math.min(80, value))
            break
        case 'fontFamily':
            selectedText.fontFamily = value
            break
        case 'color':
            selectedText.color = value
            break
        case 'underline':
            selectedText.underline = value
            break
        default:
            return false
    }
    return true
}

function increaseFontSize(edit, increment = 5) {
    const selectedText = getSelectedText(edit)
    if (!selectedText.txt) return false

    const newSize = Math.min(selectedText.fontSize + increment, 80)
    selectedText.fontSize = newSize
    return newSize
}

function decreaseFontSize(edit, decrement = 5) {
    const selectedText = getSelectedText(edit)
    if (!selectedText.txt) return false

    const newSize = Math.max(selectedText.fontSize - decrement, 20)
    selectedText.fontSize = newSize
    return newSize
}

function alignText(edit, alignment) {
    const selectedText = getSelectedText(edit)
    if (!selectedText.txt) return false

    selectedText.align = alignment

    // Update x position based on alignment
    switch (alignment) {
        case 'left':
            selectedText.x = 50
            break
        case 'center':
            selectedText.x = 200
            break
        case 'right':
            selectedText.x = 350
            break
        default:
            return false
    }

    return true
}

function toggleTextUnderline(edit) {
    const selectedText = getSelectedText(edit)
    if (!selectedText.txt) return false

    selectedText.underline = !selectedText.underline
    return selectedText.underline
}

function getTextAtPosition(edit, x, y, tolerance = 20) {
    for (let i = edit.texts.length - 1; i >= 0; i--) {
        const text = edit.texts[i]
        if (!text.txt) continue

        // Simple bounding box check
        const textWidth = text.txt.length * (text.fontSize / 2) // Approximate width
        const textHeight = text.fontSize

        if (x >= text.x - textWidth / 2 - tolerance &&
            x <= text.x + textWidth / 2 + tolerance &&
            y >= text.y - textHeight / 2 - tolerance &&
            y <= text.y + textHeight / 2 + tolerance) {
            return i
        }
    }
    return -1
}


function startTextDrag(edit, x, y) {
    const textIdx = getTextAtPosition(edit, x, y)
    console.log(textIdx)
    if (textIdx === -1) {
        return false
    }

    edit.selectedTextIdx = textIdx
    edit.isDragging = true
    gTextService.isDragging = true

    const text = edit.texts[textIdx]
    gTextService.dragOffset.x = x - text.x
    gTextService.dragOffset.y = y - text.y

    console.log('Started dragging text:', textIdx)
    return true
}

function moveTextToNextPosition(edit) {
    edit.selectedTextIdx = (edit.selectedTextIdx + 1) % edit.texts.length
    return edit.selectedTextIdx
}

function moveTextToPrevPosition(edit) {
    edit.selectedTextIdx = (edit.selectedTextIdx - 1 + edit.texts.length) % edit.texts.length
    return edit.selectedTextIdx
}

function validateTextInput(text) {
    if (typeof text !== 'string') return false
    if (text.trim().length === 0) return false
    if (text.length > 100) return false // Reasonable limit
    return true
}

function getTextStats(edit) {
    const textCount = edit.texts.filter(text => text.txt.trim()).length
    const totalCharacters = edit.texts.reduce((sum, text) => sum + text.txt.length, 0)

    return {
        textCount,
        totalCharacters,
        selectedIdx: edit.selectedTextIdx,
        currentIdx: edit.currentTextIdx
    }
}

// DRAG_TEXT

function updateTextDrag(edit, x, y) {
    if (!edit.isDragging || !gTextService.isDragging) return false

    const selectedText = getSelectedText(edit)
    selectedText.x = x - gTextService.dragOffset.x
    selectedText.y = y - gTextService.dragOffset.y


    selectedText.x = Math.max(50, Math.min(350, selectedText.x))
    selectedText.y = Math.max(30, Math.min(370, selectedText.y))

    return true
}

function stopTextDrag(edit) {
    edit.isDragging = false
    gTextService.isDragging = false
    return true
}