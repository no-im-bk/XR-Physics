class Body{
    shape;
    mesh;
    linearVelocity = new THREE.Vector3(0,0,0);

    constructor(position, orientation, shape, mesh) {
        this.shape = shape;
        this.mesh = mesh;

        this.mesh.position.copy(position);
        this.mesh.quaternion.copy(orientation);
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

    update(dt) {
        this.linearVelocity.add(new THREE.Vector3(0,-10*dt,0));
        this.mesh.position.add((new THREE.Vector3(this.linearVelocity.x, this.linearVelocity.y, this.linearVelocity.z)).multiplyScalar(dt));
    }

}

export {Body};