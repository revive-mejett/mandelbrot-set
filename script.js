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
    document.addEventListener('mousemove', logpos)
    
    
    

    console.log('sova');
    document.querySelector('body').appendChild(canvas)
    document.addEventListener('mousedown', toggleClick)

    

}

function logpos(evt) {
    if (x <= 5 && !debounce && toggleClicked) {
        debounce = true
        console.log(evt.screenX)
        setTimeout(() => {
            debounce = false
            drawCircle(evt.screenX, evt.screenY)
        }, 20);
    }

}

function drawCircle(x, y) {
    const canvas = document.querySelector('.mandelbrort')
    let ctx = canvas.getContext("2d")
    ctx.moveTo(x,y)
    ctx.ellipse(x,y,50,50,Math.PI/4,0,3*Math.PI/2,false)
    ctx.lineTo(x,y)
    ctx.stroke()
    document.addEventListener('mousemove', logpos)
}

function toggleClick() {
    toggleClicked = !toggleClicked;
}