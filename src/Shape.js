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

    getInverseAngularInertia(invMass) {
        throw new Error("getInverseAngularInertia(invMass) unimplemented from abstract class Shape.")
    }

    
}

export {Shape};