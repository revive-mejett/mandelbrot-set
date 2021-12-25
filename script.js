'use strict'


document.addEventListener('DOMContentLoaded', setup)


function setup() {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('class', 'mandelbrort')
    canvas.setAttribute('height', '500px')
    canvas.setAttribute('width', '500px')


    document.querySelector('body').appendChild(canvas)
    let ctx = canvas.getContext("2d")
    ctx.moveTo(100,100)
    ctx.ellipse(100,100,50,50,Math.PI/4,0,3*Math.PI/2,false)
    ctx.lineTo(100,100)
    ctx.stroke()
    
    

    console.log('sova');
    document.querySelector('body').appendChild(canvas)


}