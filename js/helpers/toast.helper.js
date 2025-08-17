'use strict'

function showToast(message, type = 'success', duration = 3000) {
    // Create toast element
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.textContent = message

    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `

    // Set background color based on type
    if (type === 'success') {
        toast.style.backgroundColor = '#4CAF50'
    } else if (type === 'error') {
        toast.style.backgroundColor = '#f44336'
    } else if (type === 'info') {
        toast.style.backgroundColor = '#2196F3'
    }

    // Add to DOM
    document.body.appendChild(toast)

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)'
    }, 100)

    // Remove after duration
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)'
        setTimeout(() => {
            document.body.removeChild(toast)
        }, 300)
    }, duration)
}