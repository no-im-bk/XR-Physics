class Body{
    position;
    orientation;
    shape;
    mesh;

    constructor(position, orientation, shape, mesh) {
        this.position = position;
        this.orientation = orientation;
        this.shape = shape;
        this.mesh = mesh;

        this.mesh.position.copy(position);
        this.mesh.quaternion.copy(orientation);
    }

}

export {Body};