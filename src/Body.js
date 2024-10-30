import {Sphere} from './shapes/Sphere.js'
class Body{
    shape;
    mesh;
    invMass = 0;
    #invAngularInertia;
    linearVelocity = new THREE.Vector3(0,0,0);
    angularVelocity = new THREE.Vector3(0,0,0);
    elasticity = 1;

    constructor(position, orientation, shape, mesh,invMass, elasticity) {
        this.shape = shape;
        this.mesh = mesh;

        this.mesh.position.copy(position);
        this.mesh.quaternion.copy(orientation);

        this.invMass = invMass;
        this.elasticity = elasticity;
        this.#invAngularInertia = this.shape.getInverseAngularInertia(this.invMass);
    }

    getCenterOfMassWorldSpace() {
        return this.mesh.position.clone().add(this.shape.centerOfMass.applyQuaternion(this.mesh.quaternion));
    }

    getCenterOfMassModelSpace() {
        return this.shape.centerOfMass;
    }

    worldSpaceToBodySpace(v3) {
        return (v3 - this.shape.centerOfMass).applyQuaternion(this.mesh.quaternion.invert());
    }

    bodySpaceToWorldSpace(v3) {
        return v3.applyQuaternion(this.mesh.quaternion).clone().add(this.shape.centerOfMass);
    }

    applyImpulse(location, impulse) {
        if (0 == this.invMass) {
            return;
        }

        this.applyImpulseLinear(impulse);

        let centerOfMass = this.shape.getCenterOfMassWorldSpace();
        let leverArm = location.clone().sub(centerOfMass);
        this.applyImpulseAngular(leverArm.cross(impulse));
    }

    applyImpulseLinear(impulse) {
        if(this.invMass > 0) {
            this.linearVelocity.add(impulse.clone().multiplyScalar(this.invMass));
        }
        
    }

    applyImpulseAngular(angularImpulse) {
        if (0 == this.invMass) {
            return;
        }

        this.angularVelocity.add(angularImpulse.clone().applyQuaternion(this.getOrientation().invert()).applyMatrix3(this.#invAngularInertia).applyQuaternion(this.getOrientation()));

        const maxAngularSpeed = 30;

        if(this.angularVelocity.lengthSq() > maxAngularSpeed *maxAngularSpeed) {
            this.angularVelocity.normalize();
            this.angularVelocity.multiplyScalar(maxAngularSpeed);
        }
    }

    applyInverseAngularInertiaWorldSpace(velocity) {
        return velocity.applyQuaternion(this.getOrientation().invert()).applyMatrix3(this.#invAngularInertia).applyQuaternion(this.getOrientation());
    }

    getPosition() {
        return this.mesh.position.clone();
    }

    getOrientation() {
        return this.mesh.quaternion.clone();
    }

    setPosition(position) {
        return this.mesh.position.copy(position);
    }

    setOrientation(orientation) {
        return this.mesh.quaternion.copy(orientation);
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
    
    update(dt) {
        this.mesh.position.add(this.linearVelocity.clone().multiplyScalar(dt));

        // get the OLD position relative to the center of mass
        let posRelativeToCM = this.mesh.position.clone().sub(this.getCenterOfMassWorldSpace());

        // get internal ang accel due to intermediate axis theorem
        let alpha = this.angularVelocity.clone().cross(this.angularVelocity.clone().applyMatrix3(this.#invAngularInertia.clone().invert())).applyMatrix3(this.#invAngularInertia);

        // update state
        this.angularVelocity.add(alpha.clone().multiplyScalar(dt));
        let dAngle = this.angularVelocity.clone().multiplyScalar(dt);
        let quat = new THREE.Quaternion();
        this.mesh.quaternion.premultiply(quat.setFromAxisAngle(dAngle.clone().normalize(), dAngle.length()));

        // update the new model position as it rotated around the Center of Mass
        this.mesh.position.copy(this.getCenterOfMassWorldSpace().clone().add(posRelativeToCM.clone().applyQuaternion(quat)));

        console.log(JSON.parse(JSON.stringify(this.angularVelocity)));
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