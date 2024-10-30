const cube = document.createElement('div');
cube.setAttribute('id', 'cube')
document.body.appendChild(cube)

let cubeDown = false;

let velocityY = 1;
let velocityX = 0;
let oldMouseX = 0;
let oldMouseY = 0;

let bounce = 0;
let friction = 0.3;

const solids = []
document.querySelectorAll(".solid").forEach((solid) => {
    const solidBRC = solid.getBoundingClientRect()
    solids.push([solidBRC.x, solidBRC.x + solidBRC.width, solidBRC.y, solidBRC.y + solidBRC.height])
})
const mouse = {
    x: 0,
    y: 0
}

const collisonCheck = ({ x, y }, width, height) => {
    let newCords = { x, y }
    let isResting = false
    const oldVelocityY = velocityY

    if (!cubeDown) {
        solids.forEach(([minX, maxX, minY, maxY]) => {
            if (
                !(((y + height) <= (minY)) ||
                    (y >= (maxY)) ||
                    ((x + width) <= minX) ||
                    (x >= (maxX)))
            ) {
                if (Math.min((y + height) - minY, maxY - y) <= Math.min((x + width) - minX, maxX - x)) {
                    if ((y + height) - minY < maxY - y) {
                        isResting = true
                        newCords.y = minY - height
                        velocityY = -velocityY * bounce
                    }
                    else {
                        newCords.y = maxY
                        velocityY = -velocityY * (bounce || 0.1)
                    }
                }
                else {
                    if ((x + width) - minX < maxX - x) {
                        newCords.x = minX - width
                        velocityX = -velocityX * bounce
                    }
                    else {
                        newCords.x = maxX
                        velocityX = -velocityX * bounce
                    }
                }
            }
        })
    }
    if (x + width > window.innerWidth + window.scrollX) {
        newCords.x = (window.innerWidth + window.scrollX) - width
        velocityX = -velocityX * bounce
    }
    else if (x < 0) {
        newCords.x = 0
        velocityX = -velocityX * bounce
    }
    if (y + height > (window.innerHeight + window.scrollY)) {
        isResting = true
        newCords.y = (window.innerHeight + window.scrollY) - height
        velocityY = -velocityY * bounce
    }
    // Adjusted to the navbar
    else if (y < 50) {
        newCords.y = 50
        velocityY = -velocityY * (bounce || 0.1)
    }
    if (isResting && Math.abs(velocityY - oldVelocityY) < 1) {
        velocityY = 0
    }
    return newCords
}

const cubeOpts = new Proxy({
    cords: {
        x: 10,
        y: 100
    }
}, {
    // Add detection to prevent cube from going offscreen
    set(target, prop, value) {
        const cubeReact = cube.getBoundingClientRect()
        let newValue = collisonCheck(value, cubeReact.width, cubeReact.height)

        cube.style.left = `${newValue.x}px`
        cube.style.top = `${newValue.y}px`

        return Reflect.set(target, prop, newValue)
    }
})

const physics = setInterval(() => {
    if (!cubeDown) {
        const gravity = 9.8
        const oldVelocityY = velocityY;
        const oldVelocityX = velocityX;
        if (velocityY) {
            // gravity is applied as long as there is velocity y
            velocityY = velocityY + (gravity * 0.01)
        }
        if (velocityX) {
            // Landed check
            if (velocityY == 0 && oldVelocityY == 0) {
                // friction on landing
                velocityX = velocityX - (friction * (velocityX < 0 ? -1 : 1))
                if (velocityX < 0 && oldVelocityX > 0) {
                    velocityX = 0
                }
                velocityY = 0.01
            }
        }
        if (velocityX || velocityY) {
            cubeOpts.cords = {
                x: cubeOpts.cords.x + velocityX,
                y: cubeOpts.cords.y + velocityY
            }
        }
    }
    else {
        oldMouseX = mouse.x
        oldMouseY = mouse.y
    }
}, 10)
const offset = {
    x: 0,
    y: 0
};
document.addEventListener("mousemove", (e) => {
    e.preventDefault()
    if (cubeDown) {
        cubeOpts.cords = {
            x: (e.clientX + offset.x),
            y: (e.clientY + offset.y)
        }
        mouse.x = e.clientX
        mouse.y = e.clientY
    }
}, true);
document.addEventListener('mouseup', (e) => {
    if (cubeDown) {
        cubeDown = false;
        cube.style.zIndex = '0';
        velocityX = (e.clientX - oldMouseX) * 0.5
        velocityY = ((e.clientY - oldMouseY) * 0.5) || 0.001
    }
}, true);
cube.addEventListener("mousedown", (e) => {
    if (!cubeDown) {
        cubeDown = true;
        cube.style.zIndex = '1';
        offset.x = cube.offsetLeft - e.clientX
        offset.y = cube.offsetTop - e.clientY
        mouse.x = e.clientX
        mouse.y = e.clientY
        velocityX = 0
        velocityY = 0
    }
}, true);
document.addEventListener("scroll", () => {
    if (!velocityY && !cubeDown) {
        velocityY = 0.01
    }
})

if (document.getElementById('bounce')) {
    document.getElementById('bounce').addEventListener("input", (e) => {
        bounce = e.target.value / 100
    })
}

if (document.getElementById('friction')) {
    document.getElementById('friction').addEventListener("input", (e) => {
        friction = e.target.value / 100
    })
}

if (document.getElementById('cube-color')) {
    document.getElementById('cube-color').addEventListener("input", (e) => {
        cube.style.backgroundColor = e.target.value
    })
}