class Scene {
    #bodies = [];
    threeScene;

    constructor(threeScene) {
        this.threeScene = threeScene;
    }

    update(dt) {
        // update each object
        for (var i = 0; i < this.#bodies.length; i++) {
            this.#bodies[i].update(dt, this.#bodies);
        }
    }

    add(body) {
        this.#bodies.push(body);
        this.threeScene.add(body.mesh);
    }

}

export {Scene};