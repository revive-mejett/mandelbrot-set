export default class Coordinate {

    constructor(x, i) {
        this.x = x
        this.i = i
    }

    //returns the squared value of the i coordinate
    //returns a real result
    squareI() {
        let squaredCoeff = this.i*this.i
        //because i is also squared, which turns into -1. 
        //the returned value is now a real number, positive or nevgative as a result.
        return -squaredCoeff
    }

    //returns the squared value of the x coordinate
    squareX() {
        return this.x*this.x
    }

    //multiplies the x and i values together, multiplied by 2. this is the result for multiplying inners and outers for FOIL.
    innerOuter() {
        return this.x*this.i*2
    }

    squareCoordinate() {
        let squaredCoeff = this.squareX()
        let innerOuter = this.innerOuter()
        let squaredIs = this.squareI()
        this.x = squaredCoeff + squaredIs;
        this.i = innerOuter;
        return this;
        return 'Merry Christmas!!!!!'
    }

    squareAbsCoordinate() {
        let squaredCoeff = Math.abs(this.x ** 2)
        let innerOuter = Math.abs(this.x * this.i * 2)
        let squaredIs = -Math.abs(this.i ** 2)

        this.x = squaredCoeff + squaredIs;
        this.y = innerOuter;
        return this;
        return 'Merry Christmas!!!!!'
    }

    addCoordinate(otherCoord) {
        this.x += otherCoord.x;
        this.i += otherCoord.i;
        return this;
    }

    magnitude() {
        return Math.sqrt(this.x*this.x + this.i*this.i)
    }
    magnitudeSquared() {
        return this.x ** 2 + this.i ** 2;
    }

    toString() {
        return `${this.x} + ${this.i}i`
    }
}

