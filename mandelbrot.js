
'use strict'

import Coordinate from './src/Coordinate.js'

document.addEventListener('DOMContentLoaded', setup)

let x = 0
let debounce = false
let toggleClicked = false

let colourHue = 0;


// the width of a unit square.
const imageWidth = 1
const maxIterations = 400
const maxCoordinateValue = 1000
const canvasWidth = 400
const canvasHeight = 400

let coordinateOffsetX
let coordinateOffsetI

//will be the controls
let zoom = 100
let panX = 0
let panI = 0

//startXRange
let startX = -2
let startI = 2
let endX = 2
let endI = -2
let currentX = -2
let currentI = 2
function setup() {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('class', 'mandelbrot')
    canvas.setAttribute('height', `${canvasHeight}px`)
    canvas.setAttribute('width', `${canvasWidth}px`)
    coordinateOffsetX = -parseNumber(canvas.getAttribute('width'))/2
    coordinateOffsetI = -parseNumber(canvas.getAttribute('height'))/2

    document.querySelector('#canvas-section').appendChild(canvas)
    console.log('phoenix loves jett')

    //input sliders
    document.querySelector('#pan-x').addEventListener('change', updatePanValues)
    document.querySelector('#pan-i').addEventListener('change', updatePanValues)

    //zoom value
    document.querySelector('#zoom').addEventListener('change', updateZoomValue)
    document.querySelector('#re-render').addEventListener('click', reRender)
    


    drawFullImage()
    canvas.addEventListener('dblclick', zoomIn)
}

function zoomIn(e) {
    const canvas = document.querySelector('.mandelbrot')
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height) //remove the previous content of the canvas
    setTimeout(() => {
        drawFullImage()
    }, 200);
}

function reRender(e) {
    e.preventDefault()
    const canvas = document.querySelector('.mandelbrot')
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height) //remove the previous content of the canvas
    setTimeout(() => {
        drawFullImage()
    }, 200);

}

function updatePanValues() {
    
    const panXInputValue = document.querySelector('#pan-x').value
    const panIInputValue = document.querySelector('#pan-i').value
    document.querySelector('#pan-x-display').textContent = panXInputValue
    document.querySelector('#pan-i-display').textContent = panIInputValue
    //update the global variable to be used for rerendering
    panX = panXInputValue 
    panI = panIInputValue 

}

function updateZoomValue() {
    const zoomInputValue = document.querySelector('#zoom').value
    //update the global variable to be used for rerendering
    zoom = zoomInputValue
}

//determine how many steps it takes for a coordinate to blow up, otherwise 20 for coords in the mandelbrot set
function determineIterations(coordinate) {
    let numberIterations = mandelbrotEquation(new Coordinate(0,0), coordinate, 1);
    return numberIterations
}

//calculate a new coordinate based on the formula of the mandelbrot set.
function mandelbrotEquation(coordinate, constant, iteration) {
    //Z = (z)^2 + C
    let result

    //if the coordinate numbers expand into infinity, return the iteration and its said to be not in the mandelbrot set
    //if this function has been called 20 times, return 20 as it is inside the mandelbrot set.
    if (coordinate.x > maxCoordinateValue || coordinate.i > maxCoordinateValue || iteration >= maxIterations) {
        return iteration
    }

    result = coordinate.squareCoordinate().addCoordinate(constant)
;
    return mandelbrotEquation(result, constant, iteration + 1) //call again recursively

}

function drawFullImage() {
    const canvas = document.querySelector('.mandelbrot')


    let ctx = canvas.getContext('2d')
    let pixelImage
    let column
    let row
    
    //colour all the rows in a loop
    for (row = 0; row < parseNumber(canvas.getAttribute('height')); row+=imageWidth) {
        currentX = startX
        colourRow()
        currentI-= Math.abs(endI-startI)/canvasHeight
        
    }
    
    //colour a full row.
    function colourRow() {
        for (column = 0; column < parseNumber(canvas.getAttribute('width')); column += imageWidth) {
            //color the single pixel (or the square if each unit > 1 pixel)
            colourSquare()
            currentX+= Math.abs(endX-startX)/canvasWidth
            ctx.putImageData(pixelImage, column, row)
        }
    }

    //colour a single square or pixel
    function colourSquare() {
        pixelImage = ctx.createImageData(imageWidth, imageWidth)
        // get a coordinate based on the position of this square
        //might need to change
        // let currentCoordinate = new Coordinate(convertToXCoordinate(column), convertToICoordinate(row))
        console.log(currentX + ', ' + currentI)
        let currentCoordinate = new Coordinate(currentX, currentI)
        let colour = determineColour(determineIterations(currentCoordinate))

        for (let i = 0; i < pixelImage.data.length; i += 4) {
            pixelImage.data[i] = colour.red //r
            pixelImage.data[i + 1] = colour.green //g
            pixelImage.data[i + 2] = colour.blue //b
            pixelImage.data[i + 3] = 255 //aplha
        }
        
    }
}

/**Determines the colour to be plotted based on how many iterations to expand the coordinate (or black if in mandelbrot set)
 * 
 * @param {int} numberIterations -- The number of iterations taken
 * @returns {object} -- JSON object with rgb values
 */
function determineColour(numberIterations) {

    let black = {
        red : 0,
        green : 0,
        blue : 0
    }

    //YANDERE DEV CODE DETECTED!!!!
    if (numberIterations === maxIterations) {
        return black
    } else if (numberIterations >= (maxIterations - 330)) {
        return {
            red : numberIterations/(maxIterations - 330) * 255,
            green : (255 - numberIterations)/(maxIterations - 330) * 255,
            blue : 0
        }
    } else if (numberIterations >= (maxIterations - 370)) {
        return {
            red : 0,
            green : numberIterations/(maxIterations - 370) * 255,
            blue : 255
        }
    } else {
        return {
            red : 0,
            green : 0,
            blue : numberIterations/(maxIterations - 370) * 200
        }
    }


}

function parseNumber(string) {
    return Number(string.replace('px', ''))
}

/**
 * Converts to x coordinate in mandelbrot set
 * @param {number} xCanvasPos 
 * @returns {number}
 */
function convertToXCoordinate(xCanvasPos) {
    let converted = ((xCanvasPos + coordinateOffsetX + panX) / zoom)
    return converted
}

/**
 * Converts to i coordinate in mandelbrot set
 * @param {number} yCanvasPos 
 * @returns {number}
 */
function convertToICoordinate(yCanvasPos) {
    let converted = ((yCanvasPos + coordinateOffsetI + panI) / zoom)
    return converted
}

