'use strict'


document.addEventListener('DOMContentLoaded', setup)

let x = 0
let debounce = false
let toggleClicked = false

let colourHue = 0;

function setup() {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('class', 'mandelbrort')
    canvas.setAttribute('height', '500px')
    canvas.setAttribute('width', '500px')


    document.querySelector('body').appendChild(canvas)
  
    document.addEventListener('mousemove', drawFromCursor)
    document.addEventListener('mousedown', toggleClick)

    
    setInterval(() => {
        clearCanvas()
    }, 5000);
}

function drawFromCursor(evt) {
    
    if (x <= 5 && !debounce && toggleClicked && evt.target.getAttribute('class') === 'mandelbrort') {
        debounce = true
        //offset is used since it refers to the pixel position relative to the target note (canvas in this case)
        drawCircle(evt.offsetX, evt.offsetY)
        setTimeout(() => {
            debounce = false
            
        }, 20);
    }

}

function drawCircle(x, y) {

    const canvas = document.querySelector('.mandelbrort')
    let ctx = canvas.getContext("2d")

    console.log(`x: ${x} y: ${y}`)

    console.log(canvas)
    ctx.moveTo(x,y)
    // ctx.ellipse(x,y,50,50,Math.PI/4,0,3*Math.PI/2,false)
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.strokeStyle = `HSL(${colourHue},100%,50%)`
    ctx.stroke()
    document.addEventListener('mousemove', drawFromCursor)
    if (colourHue >= 360) {
        colourHue = 0;
    }
    colourHue++;
}

function toggleClick() {
    toggleClicked = !toggleClicked;
}

function clearCanvas() {
    const canvas = document.querySelector('.mandelbrort')
    let ctx = canvas.getContext("2d")
}