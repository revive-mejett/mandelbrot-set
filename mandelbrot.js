'use strict'
import Coordinate from './src/Coordinate.js'

// the width of a unit square.
const imageWidth = 8
let canvasWidth = 800
let canvasHeight = 800
const cycleMultiplier = 2 //determines the increment of new cycles of colours

document.addEventListener('DOMContentLoaded', setup)



let coordinateOffsetX
let coordinateOffsetI

//will be the controls
let zoom = canvasWidth/8
let magnification = 1
let panX = 0
let panI = 0
let panXmultiplier = 1
let panImultiplier = 1

//MAX ITERATIONS -- PERFORMANCE COST
let maxIterations = 1000

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

    

    document.addEventListener('keydown', (e) => {

            let zoomInputValue = document.querySelector('#zoom').value
            if (e.key === 'D' || e.key === 'd') {
                panX += panXmultiplier / magnification
                reRenderKey()
            }
            if ((e.key === 'A' || e.key === 'a')) {
                panX -= panXmultiplier / magnification
                reRenderKey()
            }
            if ((e.key === 'W' || e.key === 'w')) {
                panI -= panImultiplier / magnification
                reRenderKey()
            }
            if (e.key === 'S' || e.key === 's') {

                panI += panImultiplier / magnification
                reRenderKey()
            }
            if (e.key === 'R' || e.key === 'r') {
                magnification *= zoomInputValue
                zoom *= zoomInputValue
                reRenderKey()
            }
            if (e.key === 'F' || e.key === 'f') {
                magnification /= zoomInputValue
                zoom /= zoomInputValue
                reRenderKey()
            }
        })
    drawFullImage()
    // console.log(determineColour(760))
    

}

function reRenderKey() {
    const canvas = document.querySelector('.mandelbrot')
    let ctx = canvas.getContext('2d')

    // ctx.clearRect(0, 0, canvas.width, canvas.height) //remove the previous content of the canvas
    setTimeout(() => {
        drawFullImage()
    }, 0);

}



function updatePanMultiplierValues() {
    
    const panXmultiplierInput = document.querySelector('#pan-x').value
    const panImultiplierInput = document.querySelector('#pan-i').value
    document.querySelector('#pan-x-display').textContent = panXmultiplierInput
    document.querySelector('#pan-i-display').textContent = panImultiplierInput
    panXmultiplier = panXmultiplierInput
    panImultiplier = panImultiplierInput

}


//determine how many steps it takes for a coordinate to blow up, otherwise 20 for coords in the mandelbrot set
function determineIterations(coordinate) {
    let numberIterations = 0
    let resultCoordinate = new Coordinate(0,0)

    //loop until the coordinate diverges towards infinity or numberiterations exceeds max
    while (resultCoordinate.magnitude() < 2 && numberIterations <= maxIterations) {
        resultCoordinate = mandelbrotEquation(resultCoordinate, coordinate)
        numberIterations++
    }

    return numberIterations
}

//calculate a new coordinate based on the formula of the mandelbrot set.
function mandelbrotEquation(coordinate, constant) {
    //Z = (z)^2 + C
    return coordinate.squareCoordinate().addCoordinate(constant)
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

        //determine the colour based on the number of iterations
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


    const navyToBlueBound = 20
    const cyanBoundPercentage = 0.2
    const greenBoundPercentage = 0.4
    const yellowBoundPercentage = 0.6
    const redBoundPercentage = 0.8

    const black = {
        red : 0,
        green : 0,
        blue : 0
    }
    //black if number iterations exceed
    if (numberIterations > maxIterations) {
        return black
    }
    if (numberIterations < 20) {
        return {
            red : 0,
            green : numberIterations/navyToBlueBound*255,
            blue : numberIterations/navyToBlueBound*255
        }
    }
    


    let cycleLowerBound = 1
    let cycleRangeSize
    //rainbow cycle repeats after each 10^cycle iterations
    for (let upperCycleBound = 100; upperCycleBound <= maxIterations; upperCycleBound*=cycleMultiplier) {
        
        let bracketRangeSize
        cycleRangeSize = upperCycleBound-cycleLowerBound //300

        //black if upper cyclebound goes over max
        if (upperCycleBound > maxIterations) {
            console.log('cycle overbound');
            return black
        }
    
        //blue to cyan
        if (numberIterations >= cycleLowerBound && numberIterations < cyanBoundPercentage*cycleRangeSize + cycleLowerBound) {
            bracketRangeSize = cyanBoundPercentage*cycleRangeSize //60

            return {
                red : 0,
                green : (numberIterations - cycleLowerBound)/bracketRangeSize * 255, // more green
                blue : 255
            }
        }
        //cyan to green
        else if (numberIterations >= cyanBoundPercentage*cycleRangeSize + cycleLowerBound && numberIterations < greenBoundPercentage*cycleRangeSize + cycleLowerBound) {
            bracketRangeSize = greenBoundPercentage*cycleRangeSize - cyanBoundPercentage*cycleRangeSize

            return {
                red : 0,
                green : 255,
                blue : (bracketRangeSize - (numberIterations - cyanBoundPercentage*cycleRangeSize - cycleLowerBound))/bracketRangeSize * 255 // less blue
            }
        }
        //green to yellow
        else if (numberIterations >= greenBoundPercentage*cycleRangeSize + cycleLowerBound && numberIterations < yellowBoundPercentage*cycleRangeSize + cycleLowerBound) {
            bracketRangeSize = yellowBoundPercentage*cycleRangeSize - greenBoundPercentage*cycleRangeSize

            return {
                red : (numberIterations - greenBoundPercentage*cycleRangeSize - cycleLowerBound)/bracketRangeSize * 255, // more red
                green : 255,
                blue : 0
            }
        }
        //yellow to red
        else if (numberIterations >= yellowBoundPercentage*cycleRangeSize + cycleLowerBound && numberIterations < redBoundPercentage*cycleRangeSize + cycleLowerBound) {
            bracketRangeSize = redBoundPercentage*cycleRangeSize - yellowBoundPercentage*cycleRangeSize

            return {
                red : 255,
                green : (bracketRangeSize - (numberIterations - yellowBoundPercentage*cycleRangeSize - cycleLowerBound))/bracketRangeSize * 255, //less green
                blue : 0
            }
        }
        //red to blue
        else if (numberIterations >= redBoundPercentage*cycleRangeSize + cycleLowerBound && numberIterations <= upperCycleBound) {
            bracketRangeSize = upperCycleBound - redBoundPercentage*cycleRangeSize - cycleLowerBound

            return {
                red : (bracketRangeSize - (numberIterations - redBoundPercentage*cycleRangeSize  - cycleLowerBound))/bracketRangeSize * 255, //less red,
                green : 0,
                blue : (numberIterations - redBoundPercentage*cycleRangeSize  - cycleLowerBound)/bracketRangeSize * 255 //more blue
            }
        }
        else {
            cycleLowerBound = upperCycleBound //move to next cycle
        }
    }
    return black

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

