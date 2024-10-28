class Scene {
    #bodies = [];
    threeScene;

    constructor(threeScene) {
        this.threeScene = threeScene;
    }

    update(dt) {
        // apply gravity
        for (var i = 0; i < this.#bodies.length; i++) {
            this.#bodies[i].update(dt);
        }
    }

    add(body) {
        this.#bodies.push(body);
        this.threeScene.add(body.mesh);
    }

}

export {Scene};