'use strict'


document.addEventListener('DOMContentLoaded', setup)

let x = 0
let debounce = false
let toggleClicked = false

function setup() {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('class', 'mandelbrort')
    canvas.setAttribute('height', '500px')
    canvas.setAttribute('width', '500px')


    document.querySelector('body').appendChild(canvas)
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = "#FF0000";
    ctx.moveTo(100,100)
    ctx.ellipse(100,100,50,50,Math.PI/4,0,3*Math.PI/2,false)
    ctx.lineTo(100,100)
    ctx.stroke()
    document.addEventListener('mousemove', drawFromCursor)
    
    
    

    console.log('sova');
    document.querySelector('body').appendChild(canvas)
    document.addEventListener('mousedown', toggleClick)

    
    setInterval(() => {
        clearCanvas()
    }, 5000);
}

function drawFromCursor(evt) {
    if (x <= 5 && !debounce && toggleClicked) {
        debounce = true
        drawCircle(evt.clientX, evt.clientY)
        
        setTimeout(() => {
            debounce = false
            
        }, 20);
    }

}

function drawCircle(x, y) {

    const canvas = document.querySelector('.mandelbrort')
    let ctx = canvas.getContext("2d")

    console.log(`x: ${x} y: ${y}`)
    console.log(`canvas x: ${canvas} canvas y: ${canvas.screenY}`)
    console.log(canvas)
    ctx.moveTo(x,y)
    // ctx.ellipse(x,y,50,50,Math.PI/4,0,3*Math.PI/2,false)
    ctx.beginPath()
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.stroke()
    document.addEventListener('mousemove', drawFromCursor)
}

function toggleClick() {
    toggleClicked = !toggleClicked;
}

function clearCanvas() {
    const canvas = document.querySelector('.mandelbrort')
    let ctx = canvas.getContext("2d")
}