import { Shape } from '../Shape.js'
/**
 * Sphere shape class
 * 
 * @class Sphere
 * @extends {Shape}
 */
class Sphere extends Shape {
    radius;

    /**
     * Creates a sphere with a radius
     * @param {Number} radius 
     */
    constructor(radius) {
        super();
        this.radius = radius;
    }
}

export {Sphere};