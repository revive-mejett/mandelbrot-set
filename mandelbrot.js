
'use strict'

import Coordinate from './src/Coordinate.js'

document.addEventListener('DOMContentLoaded', setup)



// the width of a unit square.
const imageWidth = 1
const maxIterations = 400
const canvasWidth = 400
const canvasHeight = 400

let coordinateOffsetX
let coordinateOffsetI

//will be the controls
let zoom = canvasWidth/4
let magnification = 1
let panX = 0
let panI = 0
let panXmultiplier = 1
let panImultiplier = 1

function setup() {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('class', 'mandelbrot')
    canvas.setAttribute('height', `${canvasHeight}px`)
    canvas.setAttribute('width', `${canvasWidth}px`)
    coordinateOffsetX = canvasWidth/2
    coordinateOffsetI = canvasHeight/2

    document.querySelector('#canvas-section').appendChild(canvas)
    console.log('phoenix loves jett')

    //input sliders
    document.querySelector('#pan-x').addEventListener('change', updatePanMultiplierValues)
    document.querySelector('#pan-i').addEventListener('change', updatePanMultiplierValues)

    //zoom value
    document.querySelector('#re-render').addEventListener('click', reRender)
    
 
    document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                console.log('sova')
                panX += panXmultiplier / magnification
                reRenderKey()
            }
            if (e.key === 'ArrowLeft') {
                console.log('killjoy')
                panX -= panXmultiplier / magnification
                reRenderKey()
            }
            if (e.key === 'ArrowUp') {
                console.log('raze')
                panI -= panImultiplier / magnification
                reRenderKey()
            }
            if (e.key === 'ArrowDown') {
                console.log('omen')
                panI += panImultiplier / magnification
                reRenderKey()
            }
        })
    drawFullImage()
    

}

function reRenderKey() {

    const canvas = document.querySelector('.mandelbrot')
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height) //remove the previous content of the canvas
    setTimeout(() => {
        drawFullImage()
    }, 0);

}

function reRender(e) {
    e.preventDefault()
    console.log('sova and phoenix');
    const canvas = document.querySelector('.mandelbrot')
    let zoomInputValue = document.querySelector('#zoom').value

    let ctx = canvas.getContext('2d')
    //update panx/pan i values
    //update the global variable to be used for rerendering
    magnification *= zoomInputValue
    zoom *= zoomInputValue

    ctx.clearRect(0, 0, canvas.width, canvas.height) //remove the previous content of the canvas
    setTimeout(() => {
        drawFullImage()
    }, 0);

}

function updatePanMultiplierValues() {
    
    const panXmultiplierInput = document.querySelector('#pan-x').value
    const panImultiplierInput = document.querySelector('#pan-i').value
    document.querySelector('#pan-x-display').textContent = panXmultiplierInput
    document.querySelector('#pan-i-display').textContent = panImultiplierInput
    console.log(panXmultiplierInput)
    console.log(panImultiplierInput)
    panXmultiplier = panXmultiplierInput
    panImultiplier = panImultiplierInput

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
    if (coordinate.magnitude() > 2 || iteration >= maxIterations) {
        return iteration
    }

    result = coordinate.squareCoordinate().addCoordinate(constant)
    return mandelbrotEquation(result, constant, iteration + 1) //call again recursively

}

//burning ship fractal
function burningShipEquation(coordinate, constant, iteration) {
    //z = (|z|)^2 + C
    let result

    if (coordinate.magnitude() > 2 || iteration >= maxIterations) {
        return iteration
    }

    result = coordinate.squareAbsCoordinate().addCoordinate(constant)
    return burningShipEquation(result, constant, iteration + 1) //call again recursively

}

function drawFullImage() {
    const canvas = document.querySelector('.mandelbrot')
    let ctx = canvas.getContext('2d')
    let pixelImage
    let column
    let row
    
    //colour all the rows in a loop
    for (row = 0; row < canvasHeight; row+=imageWidth) {
        colourRow()
    }
    
    //colour a full row.
    function colourRow() {
        for (column = 0; column < canvasWidth; column += imageWidth) {
            //color the single pixel (or the square if each unit > 1 pixel)
            colourSquare()
            ctx.putImageData(pixelImage, column, row)
        }
    }

    //colour a single square or pixel
    function colourSquare() {
        pixelImage = ctx.createImageData(imageWidth, imageWidth)
        // get a coordinate based on the position of this square
        let currentCoordinate = new Coordinate(convertToXCoordinate(column), convertToICoordinate(row))
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

    let iterationLowerBound;
    let iterationRangeSize;

    const navyToBlueBound = 30;
    const cyanBound = 60;
    const greenBound = 100;
    const yellowBound = 200;
    const redBound = 300;
    const blueBound = 400;
    let black = {
        red : 0,
        green : 0,
        blue : 0
    }

    //YANDERE DEV CODE DETECTED!!!!
    if (numberIterations === maxIterations) {
        return black
        
    } else if (numberIterations >= (maxIterations - 100)) {

        iterationLowerBound = redBound //300
        iterationRangeSize = blueBound - redBound //100
        //from yellow to red (300 to 400 iterations)
        return {
            red : (iterationRangeSize - (numberIterations - iterationLowerBound))/iterationRangeSize * 255, //less blue,
            green : 0,
            blue : (numberIterations - iterationLowerBound)/iterationRangeSize * 255 //more blue
        }
    } else if (numberIterations >= (maxIterations - 200)) {

        iterationLowerBound = yellowBound //200
        iterationRangeSize = redBound - yellowBound //100
        //from yellow to red (200 to 300 iterations)
        return {
            red : 255,
            green : (iterationRangeSize - (numberIterations - iterationLowerBound))/iterationRangeSize * 255,
            blue : 0
        }
    } else if (numberIterations >= (maxIterations - 300)) {

        iterationLowerBound = greenBound //100
        iterationRangeSize = yellowBound - greenBound //100
        //from green to yellow (101 to 200 iterations)
        return {
            //red : numberIterations/(maxIterations - 330) * 255,
            red : (numberIterations - iterationLowerBound)/iterationRangeSize * 255,
            green : 255,
            blue : 0
        }
    } else if (numberIterations >= (maxIterations - 340)) {

        iterationLowerBound = cyanBound //60
        iterationRangeSize = greenBound - cyanBound // 40
        //from cyan to green (61 to 100 iterations)
        return {
            //red : numberIterations/(maxIterations - 330) * 255,
            red : 0,
            green : 255,
            blue : (iterationRangeSize - (numberIterations - iterationLowerBound))/iterationRangeSize * 255
        }
    } else if (numberIterations >= (maxIterations - 370)) {

        //from blue to cyan (31 to 60 iterations)
        iterationLowerBound = navyToBlueBound
        iterationRangeSize = maxIterations - (maxIterations - iterationLowerBound)
        return {
            red : 0,
            green : (numberIterations - iterationLowerBound)/iterationRangeSize * 255,
            blue : 255
        }
    } else {
        //from navy blue to blue (0 to 30 max iterations)
        iterationLowerBound = navyToBlueBound;
        iterationRangeSize = maxIterations - (maxIterations - iterationLowerBound)
        return {
            red : 0,
            green : 0,
            blue : numberIterations/iterationRangeSize * 255
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
    let converted = ((xCanvasPos - coordinateOffsetX) / zoom) + panX
    return converted
}

/**
 * Converts to i coordinate in mandelbrot set
 * @param {number} yCanvasPos 
 * @returns {number}
 */
function convertToICoordinate(yCanvasPos) {
    let converted = ((yCanvasPos - coordinateOffsetI) / zoom) + panI
    return converted
}

