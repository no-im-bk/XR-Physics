/**
 * Abstract class Shape
 */
class Shape {
    centerOfMass;

    constructor() {
        if(this.constructor == Shape) {
            throw new Error("Cannot instantiate abstract class Shape.")
        }
    }

    
}

export {Shape};