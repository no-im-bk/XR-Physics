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

        mesh.position.set(position);
        mesh.quaternion.set(orientation);
    }

}

export {Body};