import { Shape } from '../Shape.js'
/**
 * Sphere shape class
 * 
 * @class Sphere
 * @extends {Shape}
 */
class Sphere extends Shape {
    radius;
    centerOfMass;

    /**
     * Creates a sphere with a radius
     * @param {Number} radius 
     */
    constructor(radius) {
        super();
        this.radius = radius;
        this.centerOfMass = new THREE.Vector3(0,0,0);
    }

    getInverseAngularInertia(invMass) {
        let Iinv = 5*invMass/(2*this.radius*this.radius);
        let IinvMat = new THREE.Matrix3();
        IinvMat.set(Iinv,0,0, 0,Iinv,0, 0,0,Iinv);
        return IinvMat;
    }
}

export {Sphere};