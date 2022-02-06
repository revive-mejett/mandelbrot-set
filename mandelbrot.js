'use strict'
import Coordinate from './src/Coordinate.js'


const cycleMultiplier = 2 //determines the increment of new cycles of colours

document.addEventListener('DOMContentLoaded', setup)

//message panel
let messagePanel

//canvas's dimensions
let canvasWidth = 600
let canvasHeight = 600

//offsets when converting from canvas position to coordinate
let coordinateOffsetX
let coordinateOffsetI

//will be the controls
let zoom = canvasWidth/4
let magnification = 1
let panX = 0
let panI = 0
let panXmultiplier = 1
let panImultiplier = 1

//MAX ITERATIONS -- PERFORMANCE COST
let maxIterations = 400

// the width of a unit square.
let imageWidth = 1

// whether full render is enabled or now
let fullRenderEnabled

//variables to hold handles of canvas and context
let ctx;
let canvas;


function setup() {
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d')
    messagePanel = document.querySelector('#message-panel')
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

    //full rendercheckbox change handler
    document.querySelector('#full-render').addEventListener('change', fullRenderChange)
    
    //max iterations value
    document.querySelector('#max-iterations').value = maxIterations //initial default
    document.querySelector('#max-iterations').addEventListener('change', updateMaxIterationsValue)

    //zoom value validation check
    document.querySelector('#zoom').addEventListener('change', validateZoomInput)

    document.addEventListener('keydown', (e) => {
        messagePanel.textContent = ''
        let validInputs = true
        let zoomInputValue = document.querySelector('#zoom').value
        if (fullRenderEnabled) {
            messagePanel.textContent += '--Full render must be toggled off to pan/zoom  '
            validInputs = false
        }
        if (zoomInputValue <= 0) {
            messagePanel.textContent += '--Zoom multiplier must be positive  '
            validInputs = false
        }

        if (maxIterations > 100000 || maxIterations < 1) {
            messagePanel.textContent += '--Range of Max Iterations must be 1 to 100000  '
            validInputs = false
        }
        if (!validInputs) {
            return
        }
        messagePanel.textContent = ''
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
    updateImageInfo()
    

}

/**
 * reRender function that is called after a key input (zoom in, panning)
 */
function reRenderKey() {
    setTimeout(() => {
        drawFullImage()
    }, 0);
    updateImageInfo()
}

/**
 * reRender function that is called when toggling full render mode change
 */
function fullRenderChange() {
    fullRenderEnabled = document.querySelector('#full-render').checked
    // imageWidth = (fullRenderEnabled ? 1 : 8)

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    
    setTimeout(() => {
        drawFullImage()
    }, 0);
    updateImageInfo()
}

/**
 * Updates the info panel regarding image's current zoom
 */
function updateImageInfo() {
    console.log(document.querySelector('#max-iteration-display'));
    console.log(document.querySelector('#max-iteration-display'));
    console.log(document.querySelector('#zoom-display'));
    document.querySelector('#max-iteration-display').textContent = `Max iterations: ${maxIterations}`
    document.querySelector('#zoom-display').textContent = `Current Zoom: ${zoom}`

    document.querySelector('#position-x-display').textContent = `X: ${panX}`
    document.querySelector('#position-i-display').textContent = `I: ${panI}`

}

/**
 * Updates the multiplier based on the change of the slider values 
 */
function updatePanMultiplierValues() {
    const panXmultiplierInput = document.querySelector('#pan-x').value
    const panImultiplierInput = document.querySelector('#pan-i').value
    document.querySelector('#pan-x-display').textContent = panXmultiplierInput
    document.querySelector('#pan-i-display').textContent = panImultiplierInput
    panXmultiplier = panXmultiplierInput
    panImultiplier = panImultiplierInput

}

/**
 * updates and validates max Iterations input value. Hides the full render checkbox such an invalid value is given
 */
function updateMaxIterationsValue() {
    maxIterations = document.querySelector('#max-iterations').value

    if (maxIterations > 10000) {
        messagePanel.textContent = '--Performance will slow down the greater the number of iterations  '
    }

    if (maxIterations > 100000 || maxIterations < 1) {
        messagePanel.textContent += '--Range of Max Iterations must be 1 to 100000  '
        document.querySelector('.checkbox-container').style.display='none'
    } else {
        document.querySelector('.checkbox-container').style.display='block'
    }
}

/**
 * Validates the zoom input so that it is positive. Hides the full render checkbox such an invalid value is given
 */
function validateZoomInput() {
    if (document.querySelector('#zoom').value <= 0) {
        messagePanel.textContent = '--Zoom multiplier must be positive  '
        document.querySelector('.checkbox-container').style.display='none'
        
    } else {
        document.querySelector('.checkbox-container').style.display='block'
    }
}

//determine how many steps it takes for a coordinate to blow up, otherwise 20 for coords in the mandelbrot set
function determineIterations(coordinate) {
    let numberIterations = 0
    let resultCoordinate = new Coordinate(0,0)

    //loop until the coordinate diverges towards infinity or numberiterations exceeds max
    while (resultCoordinate.magnitudeSquared() < 4 && numberIterations <= maxIterations) {
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

/**
 * Renders the image
 */
function drawFullImage() {
    const width = 600 / imageWidth;
    const height = 600 / imageWidth;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(imageWidth, imageWidth);

    let pixelImage = ctx.createImageData(width, height);

    //colour a single square or pixel
    function colourSquare(x, y) {
        let currentCoordinate = new Coordinate(convertToXCoordinate(x), convertToICoordinate(y))
        //determine the colour based on the number of iterations
        return determineColour(determineIterations(currentCoordinate))
    }

    for(let x = 0; x < width; x++){
        for(let y = 0; y < height; y++){
            const colour =  colourSquare(x * imageWidth, y * imageWidth);
            const i = (y * width + x) * 4;
            pixelImage.data[i] = colour.red //r
            pixelImage.data[i + 1] = colour.green //g
            pixelImage.data[i + 2] = colour.blue //b
            pixelImage.data[i + 3] = 255 //aplha
        }
    }

    ctx.putImageData(pixelImage, 0, 0);
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

