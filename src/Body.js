import {Sphere} from './shapes/Sphere.js'
class Body{
    shape;
    mesh;
    invMass = 0;
    linearVelocity = new THREE.Vector3(0,0,0);

    static gravityVector = new THREE.Vector3(0,-10,0);

    constructor(position, orientation, shape, mesh,invMass) {
        this.shape = shape;
        this.mesh = mesh;

        this.mesh.position.copy(position);
        this.mesh.quaternion.copy(orientation);

        this.invMass = invMass;
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

    update(dt, bodies) {
        // add gravity
        this.applyImpulseLinear(Body.gravityVector.clone().multiplyScalar(dt/this.invMass));

        //check for collision
        for(var i = 0; i < bodies.length; i++) {
            if(bodies[i] != this) {
                this.intersect(bodies[i]);
            }
        }

        // update position
        this.mesh.position.add(this.linearVelocity.clone().multiplyScalar(dt));
        
        console.log(this);
    }

    applyImpulseLinear(impulse) {
        if(this.invMass > 0) {
            this.linearVelocity.add(impulse.clone().multiplyScalar(this.invMass));
        }
        
    }

    getPosition() {
        return this.mesh.position;
    }

    getOrientation() {
        return this.mesh.orientation;
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

                Body.resolveContact(contact);
            }
        } else {
            throw new Error(`Collision between invalid types ${Object.prototype.toString.call(this)} and ${Object.prototype.toString.call(bodyB)}`);
        }
    }

    static resolveContact(contact) {
        console.log(contact);
        // cancel out the velocities
        contact.bodyA.linearVelocity.set(0,0,0);
        contact.bodyB.linearVelocity.set(0,0,0);

        // move the objects to stop them from overlapping
        let sepDist = contact.pointOnB_WorldSpace.clone().sub(contact.pointOnA_WorldSpace);
        contact.bodyA.setPosition(contact.bodyA.getPosition().clone().add(sepDist.multiplyScalar(contact.bodyA.invMass / (contact.bodyA.invMass + contact.bodyB.invMass)) ));
        contact.bodyB.setPosition(contact.bodyB.getPosition().clone().sub(sepDist.multiplyScalar(contact.bodyB.invMass / (contact.bodyA.invMass + contact.bodyB.invMass)) ));

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
}