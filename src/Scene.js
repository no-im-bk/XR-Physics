class Scene {
    #bodies = [];
    threeScene;

    static gravityVector = new THREE.Vector3(0,-10,0);

    constructor(threeScene) {
        this.threeScene = threeScene;
    }

    update(dt) {
        // apply gravity to each object

        for (var i = 0; i < this.#bodies.length; i++) {
            this.#bodies[i].applyImpulseLinear(Scene.gravityVector.clone().multiplyScalar(dt/this.#bodies[i].invMass));
        }

        // collision check
        for (var i = 0; i < this.#bodies.length; i++) {
            for(var j = i + 1; j < this.#bodies.length; j++) {
                let isContact = this.#bodies[i].intersect(this.#bodies[j]);
                if(isContact[0]) {
                    Scene.resolveContact(isContact[1]);
                }
                
            }
        }

        // update velocities
        for (var i = 0; i < this.#bodies.length; i++) {
            this.#bodies[i].mesh.position.add(this.#bodies[i].linearVelocity.clone().multiplyScalar(dt));
        }

        // killplane
        let removeIndicies = [];
        for (var i = 0; i < this.#bodies.length; i++) {
            
            if(this.#bodies[i].mesh.position.y < -2) {
                removeIndicies.push(i);
                this.#bodies[i].delete(this.threeScene);
            }
            
        }
        for(var i = removeIndicies.length - 1; i >= 0; i--) {
            this.#bodies.splice(removeIndicies[i],1);  
        }
        console.log(JSON.parse(JSON.stringify(this.#bodies)));
    }

    add(body) {
        this.#bodies.push(body);
        this.threeScene.add(body.mesh);
    }

    static resolveContact(contact) {

        let velocityA = contact.bodyA.linearVelocity.clone();
        let velocityB = contact.bodyB.linearVelocity.clone();
        let collisionElasticity = contact.bodyA.elasticity * contact.bodyB.elasticity; // rough estimate of what the elasticity of the collision should be
        
        // apply the impulse from the collision
        let impulse = contact.normal.clone().multiplyScalar(velocityB.sub(velocityA).dot(contact.normal) * (1+collisionElasticity)/(contact.bodyA.invMass + contact.bodyB.invMass));
        contact.bodyA.applyImpulseLinear(impulse);
        contact.bodyB.applyImpulseLinear(impulse.negate());

        // move the objects to stop them from overlapping, while keeping the center of mass of the two at the same place
        let sepDist = contact.pointOnB_WorldSpace.clone().sub(contact.pointOnA_WorldSpace);
        contact.bodyA.setPosition(contact.bodyA.getPosition().add(sepDist.clone().multiplyScalar(contact.bodyA.invMass / (contact.bodyA.invMass + contact.bodyB.invMass)) ));
        contact.bodyB.setPosition(contact.bodyB.getPosition().sub(sepDist.clone().multiplyScalar(contact.bodyB.invMass / (contact.bodyA.invMass + contact.bodyB.invMass)) ));

    }

}

export {Scene};