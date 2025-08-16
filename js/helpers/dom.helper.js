'use strict'

function getElement(selector) {
    const element = document.querySelector(selector)
    if (!element) {
        console.warn(`Element not found: ${selector}`)
    }
    return element
}