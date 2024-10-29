import {Sphere} from './shapes/Sphere.js'
class Body{
    shape;
    mesh;
    invMass = 0;
    linearVelocity = new THREE.Vector3(0,0,0);
    elasticity = 1;

    constructor(position, orientation, shape, mesh,invMass, elasticity) {
        this.shape = shape;
        this.mesh = mesh;

        this.mesh.position.copy(position);
        this.mesh.quaternion.copy(orientation);

        this.invMass = invMass;
        this.elasticity = elasticity;
    }

    getCenterOfMassWorldSpace() {
        return this.mesh.position + this.shape.centerOfMass.applyQuaternion(this.mesh.orientation);
    }

    getCenterOfMassModelSpace() {
        return this.shape.centerOfMass;
    }

    worldSpaceToBodySpace(v3) {
        return (v3 - this.shape.centerOfMass).applyQuaternion(this.mesh.orientation.invert());
    }

    bodySpaceToWorldSpace(v3) {
        return v3.applyQuaternion(this.mesh.orientation) + this.shape.centerOfMass;
    }

    applyImpulseLinear(impulse) {
        if(this.invMass > 0) {
            this.linearVelocity.add(impulse.clone().multiplyScalar(this.invMass));
        }
        
    }

    getPosition() {
        return this.mesh.position.clone();
    }

    getOrientation() {
        return this.mesh.orientation.clone();
    }

    setPosition(position) {
        return this.mesh.position.copy(position);
    }

    setOrientation(orientation) {
        return this.mesh.orientation.copy(orientation);
    }

    intersect(bodyB) {
        if((this.shape instanceof Sphere) && (bodyB.shape instanceof Sphere)) {
            let dist = bodyB.getPosition().clone().sub(this.getPosition());
            let radiusSum = this.shape.radius + bodyB.shape.radius;
            if(dist.lengthSq() < radiusSum * radiusSum) {
                let contact = new Contact();
                contact.separationDist = dist.length();
                contact.normal = dist.normalize();

                contact.bodyA = this;
                contact.bodyB = bodyB;
                
                contact.pointOnA_WorldSpace = this.getPosition().clone().add(contact.normal.clone().multiplyScalar(this.shape.radius));
                contact.pointOnB_WorldSpace = bodyB.getPosition().clone().sub(contact.normal.clone().multiplyScalar(bodyB.shape.radius));

                return [true,contact];

                

            }
            return [false, null];
        } else {
            throw new Error(`Collision between invalid types ${Object.prototype.toString.call(this)} and ${Object.prototype.toString.call(bodyB)}`);
        }
    }

    delete(scene) {
        scene.remove(this.mesh);
    }
    


}

export {Body};

class Contact {
    pointOnA_WorldSpace;
    pointOnB_WorldSpace;
    pointOnA_LocalSpace;
    pointOnB_LocalSpace;

    normal; //world space
    separationDist; // non-penetrating positive
    timeOfImpact;

    bodyA;
    bodyB;
} export { Contact };