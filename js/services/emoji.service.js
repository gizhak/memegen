'use strict'

// ========== EMOJI SERVICE ==========

const gEmojiService = {
    isDragging: false,
    dragOffset: { x: 0, y: 0 }
}

function addEmojiToPosition(edit, emoji, x = 200, y = 200, size = 40) {
    const newEmoji = createEmojiObj(emoji, x, y, size)
    edit.emojis.push(newEmoji)

    console.log('Emoji added:', emoji, 'at position:', x, y)
    return edit.emojis.length - 1 // Return index of new emoji
}

function removeEmojiAtIndex(edit, emojiIdx) {
    if (emojiIdx < 0 || emojiIdx >= edit.emojis.length) {
        return false
    }

    edit.emojis.splice(emojiIdx, 1)

    // Reset selection if deleted emoji was selected
    if (edit.selectedEmojiIdx === emojiIdx) {
        edit.selectedEmojiIdx = -1
    } else if (edit.selectedEmojiIdx > emojiIdx) {
        edit.selectedEmojiIdx--
    }

    console.log('Emoji removed at index:', emojiIdx)
    return true
}

function isPointInEmoji(x, y, emojiObj) {
    const halfSize = emojiObj.size / 2
    return x >= emojiObj.x - halfSize && x <= emojiObj.x + halfSize &&
        y >= emojiObj.y - halfSize && y <= emojiObj.y + halfSize
}

function findEmojiAtPosition(edit, x, y) {
    // Search from top to bottom (last added first)
    for (let i = edit.emojis.length - 1; i >= 0; i--) {
        if (isPointInEmoji(x, y, edit.emojis[i])) {
            return i
        }
    }
    return -1
}

function startEmojiDrag(edit, x, y) {
    const emojiIdx = findEmojiAtPosition(edit, x, y)
    if (emojiIdx === -1) {
        return false
    }

    edit.selectedEmojiIdx = emojiIdx
    edit.isDragging = true
    gEmojiService.isDragging = true

    // Calculate offset from emoji center for smooth dragging
    const emoji = edit.emojis[emojiIdx]
    gEmojiService.dragOffset.x = x - emoji.x
    gEmojiService.dragOffset.y = y - emoji.y

    console.log('Started dragging emoji:', emojiIdx)
    return true
}

function updateEmojiDrag(edit, x, y) {
    if (!edit.isDragging || edit.selectedEmojiIdx === -1) {
        return false
    }

    const emoji = edit.emojis[edit.selectedEmojiIdx]

    // Update position with offset for smooth dragging
    emoji.x = x - gEmojiService.dragOffset.x
    emoji.y = y - gEmojiService.dragOffset.y

    // Keep emoji within canvas bounds
    const canvas = getCanvas()
    if (canvas) {
        const halfSize = emoji.size / 2
        emoji.x = Math.max(halfSize, Math.min(canvas.width - halfSize, emoji.x))
        emoji.y = Math.max(halfSize, Math.min(canvas.height - halfSize, emoji.y))
    }

    return true
}

function stopEmojiDrag(edit) {
    if (edit.isDragging) {
        edit.isDragging = false
        gEmojiService.isDragging = false

        console.log('Stopped dragging emoji')
        return true
    }
    return false
}

function deleteEmojiAtPosition(edit, x, y) {
    const emojiIdx = findEmojiAtPosition(edit, x, y)
    if (emojiIdx === -1) {
        return false
    }

    return removeEmojiAtIndex(edit, emojiIdx)
}

function resizeEmoji(edit, emojiIdx, newSize) {
    if (emojiIdx < 0 || emojiIdx >= edit.emojis.length) {
        return false
    }

    // Limit size to reasonable bounds
    newSize = Math.max(20, Math.min(100, newSize))
    edit.emojis[emojiIdx].size = newSize

    return true
}

function moveEmoji(edit, emojiIdx, newX, newY) {
    if (emojiIdx < 0 || emojiIdx >= edit.emojis.length) {
        return false
    }

    const emoji = edit.emojis[emojiIdx]
    emoji.x = newX
    emoji.y = newY

    // Keep within canvas bounds
    const canvas = getCanvas()
    if (canvas) {
        const halfSize = emoji.size / 2
        emoji.x = Math.max(halfSize, Math.min(canvas.width - halfSize, emoji.x))
        emoji.y = Math.max(halfSize, Math.min(canvas.height - halfSize, emoji.y))
    }

    return true
}

function duplicateEmoji(edit, emojiIdx) {
    if (emojiIdx < 0 || emojiIdx >= edit.emojis.length) {
        return -1
    }

    const originalEmoji = edit.emojis[emojiIdx]
    const newEmoji = createEmojiObj(
        originalEmoji.emoji,
        originalEmoji.x + 20, // Offset slightly
        originalEmoji.y + 20,
        originalEmoji.size
    )

    edit.emojis.push(newEmoji)
    return edit.emojis.length - 1
}

function getEmojiStats(edit) {
    return {
        totalEmojis: edit.emojis.length,
        selectedIdx: edit.selectedEmojiIdx,
        isDragging: edit.isDragging,
        emojis: edit.emojis.map(emoji => ({
            emoji: emoji.emoji,
            position: { x: emoji.x, y: emoji.y },
            size: emoji.size
        }))
    }
}

function clearAllEmojis(edit) {
    edit.emojis.length = 0
    edit.selectedEmojiIdx = -1
    edit.isDragging = false
    gEmojiService.isDragging = false

    console.log('All emojis cleared')
    return true
}

function selectEmoji(edit, emojiIdx) {
    if (emojiIdx < 0 || emojiIdx >= edit.emojis.length) {
        edit.selectedEmojiIdx = -1
        return false
    }

    edit.selectedEmojiIdx = emojiIdx
    return true
}