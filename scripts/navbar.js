// Script that controls navbar functionality
let backdrop = null

let isTransitioning = false

const toggleBackdrop = async (toggle) => {
    if (toggle && !backdrop) {
        backdrop = document.createElement('div')
        backdrop.classList.add('options-backdrop')
        document.body.appendChild(backdrop)
        backdrop.addEventListener('click', backdropClick)
        setTimeout(() => {
            backdrop.classList.add('show')
        }, 10)
    }
    else if (!toggle && backdrop) {
        backdrop.removeEventListener('click', backdropClick)
        backdrop.classList.remove('show')
        setTimeout(() => {
            document.body.removeChild(backdrop)
            backdrop = null
        }, 160)
    }
}

const toggle = (target, trigger) => {
    if (target.classList.contains('show')) {
        hide(target, trigger)
    }
    else {
        show(target, trigger)
    }
}

const show = (target, trigger) => {
    if (isTransitioning || target.classList.contains('show')) {
        return
    }
    const openCollapse = document.querySelector('.collapse.show')
    if (openCollapse && openCollapse != target) {
        hide(openCollapse, document.querySelector(`[aria-controls=${openCollapse.id}]`), true)
    }

    target.classList.remove('collapse')
    target.classList.add('collapsing')
    target.style.width = 0

    if (trigger) {
        trigger.classList.toggle('collapsed', false)
        trigger.setAttribute('aria-expanded', true)
    }

    isTransitioning = true
    const complete = () => {
        isTransitioning = false
        target.classList.remove('collapsing')
        target.classList.add('collapse', 'show')
    }
    target.addEventListener('transitionend', complete, { once: true })
    toggleBackdrop(true)
    setTimeout(() => {
        target.style.width = '188px'
    
    }, 10)
}

const hide = (target, trigger, keepBackdrop = false) => {
    if (isTransitioning || !target.classList.contains('show')) {
        return
    }

    target.style.width = '188px'

    target.classList.add('collapsing')
    target.classList.remove('collapse', 'show')

    if (trigger) {
        trigger.classList.toggle('collapsed', true)
        trigger.setAttribute('aria-expanded', false)
    }

    isTransitioning = true
    const complete = () => {
        isTransitioning = false
        target.classList.remove('collapsing')
        target.classList.add('collapse')
    }
    target.addEventListener('transitionend', complete, { once: true })
    toggleBackdrop(keepBackdrop)
    setTimeout(() => {
        target.style.width = 0
    }, 10)
}

const backdropClick = () => {
    const openCollapse = document.querySelector('.collapse.show')
    if (openCollapse) {
        hide(openCollapse, document.querySelector(`[aria-controls=${openCollapse.id}]`))
    }
}

const optionsCollapse = document.getElementById('cube-opts-btn')

optionsCollapse.addEventListener('click', () => {
    toggle(document.getElementById('cube-opts'), optionsCollapse)
})

const directoryOptions = document.getElementById('dir-btn')

directoryOptions.addEventListener('click', () => {
    toggle(document.getElementById('dir'), directoryOptions)
})

document.addEventListener('keydown', (e) => {
    if (e.code == "Escape" && backdrop) {
        backdropClick()
    }
})

