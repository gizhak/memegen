'use strict'

// ========== EDIT MODEL ==========
function createEditModel() {
    return {
        texts: [
            { txt: '', x: 200, y: 60, fontSize: 40, align: 'center', fontFamily: 'Impact', underline: false, color: 'white' },
            { txt: '', x: 200, y: 340, fontSize: 40, align: 'center', fontFamily: 'Impact', underline: false, color: 'white' },
            { txt: '', x: 200, y: 200, fontSize: 40, align: 'center', fontFamily: 'Impact', underline: false, color: 'white' }
        ],
        emojis: [],
        selectedImg: null,
        selectedTextIdx: 0,
        currentTextIdx: 0,
        selectedEmojiIdx: -1,
        isDragging: false
    }
}

// ========== TEXT MODEL FUNCTIONS ==========
function createTextObj(txt = '', x = 200, y = 200, fontSize = 40) {
    return {
        txt,
        x,
        y,
        fontSize,
        align: 'center',
        fontFamily: 'Impact',
        underline: false,
        color: 'white'
    }
}

function updateTextProperty(textObj, property, value) {
    if (textObj && textObj.hasOwnProperty(property)) {
        textObj[property] = value
        return true
    }
    return false
}

// ========== EMOJI MODEL FUNCTIONS ==========
function createEmojiObj(emoji, x = 200, y = 200, size = 40) {
    return {
        emoji,
        x,
        y,
        size
    }
}

function addEmojiToEdit(edit, emoji, x, y) {
    const newEmoji = createEmojiObj(emoji, x, y)
    edit.emojis.push(newEmoji)
    return newEmoji
}

function removeEmojiFromEdit(edit, emojiIdx) {
    if (emojiIdx >= 0 && emojiIdx < edit.emojis.length) {
        edit.emojis.splice(emojiIdx, 1)
        return true
    }
    return false
}

// ========== EDIT STATE FUNCTIONS ==========
function setSelectedImage(edit, imgData) {
    edit.selectedImg = imgData
}

function getSelectedText(edit) {
    return edit.texts[edit.selectedTextIdx]
}

function getSelectedEmoji(edit) {
    if (edit.selectedEmojiIdx >= 0 && edit.selectedEmojiIdx < edit.emojis.length) {
        return edit.emojis[edit.selectedEmojiIdx]
    }
    return null
}

function setSelectedTextIdx(edit, idx) {
    if (idx >= 0 && idx < edit.texts.length) {
        edit.selectedTextIdx = idx
        return true
    }
    return false
}

function cycleSelectedText(edit, direction = 1) {
    const newIdx = (edit.selectedTextIdx + direction + edit.texts.length) % edit.texts.length
    edit.selectedTextIdx = newIdx
    return newIdx
}