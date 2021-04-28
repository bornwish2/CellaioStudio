import * as THREE from "../js/three.module.js"

class exampleProject {
    constructor() {
    }
        
    shelveThickness = 0.0682;
    static shelveTexture = new THREE.TextureLoader().load('textures/wood2.jpg');

    createShelve(length, depth = 0.4, thickness = this.shelveThickness) {
        var geometry = new THREE.BoxGeometry(length, thickness, depth);
        var material = new THREE.MeshPhongMaterial({ map: exampleProject.shelveTexture });
        var cube = new THREE.Mesh(geometry, material);
        return cube;
    }

    load(scene) {

        // 1374 from bottom to top
        var s1 = this.createShelve(1.3);
        var s2 = this.createShelve(1.7);
        var s3 = this.createShelve(1.7);
        var s4 = this.createShelve(1.7);
        var s5 = this.createShelve(1.3);
        s1.position.set(1.45, 0.5, 0.2);
        s2.position.set(1.65, 0.9, 0.2);
        s3.position.set(1.65, 1.3, 0.2);
        s4.position.set(1.65, 1.7, 0.2);
        s5.position.set(1.85, 2.1, 0.2);

        var h1 = this.createShelve(0.4 - this.shelveThickness);
        var h2 = this.createShelve(0.4 - this.shelveThickness);
        var h3 = this.createShelve(0.4 - this.shelveThickness);
        var h4 = this.createShelve(0.4 - this.shelveThickness);
        var h5 = this.createShelve(0.4 - this.shelveThickness);
        var h6 = this.createShelve(0.4 - this.shelveThickness);
        var h7 = this.createShelve(0.4 - this.shelveThickness);
        var h8 = this.createShelve(0.4 - this.shelveThickness);

        h1.rotateZ(Math.PI / 2);
        h2.rotateZ(Math.PI / 2);
        h3.rotateZ(Math.PI / 2);
        h4.rotateZ(Math.PI / 2);
        h5.rotateZ(Math.PI / 2);
        h6.rotateZ(Math.PI / 2);
        h7.rotateZ(Math.PI / 2);
        h8.rotateZ(Math.PI / 2);
        h1.position.set(0.8 + this.shelveThickness / 2, 0.7, 0.2);
        h2.position.set(1.2 + this.shelveThickness / 2, 0.7, 0.2);
        h3.position.set(2.1 - this.shelveThickness / 2, 1.1, 0.2);
        h4.position.set(2.5 - this.shelveThickness / 2, 1.1, 0.2);
        h5.position.set(0.8 + this.shelveThickness / 2, 1.5, 0.2);
        h6.position.set(1.2 + this.shelveThickness / 2, 1.5, 0.2);
        h7.position.set(2.1 - this.shelveThickness / 2, 1.9, 0.2);
        h8.position.set(2.5 - this.shelveThickness / 2, 1.9, 0.2);

        scene.add(s1, s2, s3, s4, s5);
        scene.add(h1, h2, h3, h4, h5, h6, h7, h8);
    }
}

export { exampleProject }