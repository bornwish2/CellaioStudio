import * as THREE from "../js/three.module.js"
import { OrbitControls } from "../js/OrbitControls.js"

var container;
var scene, camera, renderer, controls;

var geometry, material, cube;

function render() {
    controls.update();
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function loadScene() {

    container = document.getElementById('threejscontainer');
    if (!container) {
        return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    
    camera.position.z = 5;

    animate();
}

function addShelve() {

    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
}

window.editor = {
    load: () => { loadScene(); },
    addShelve: () => { addShelve(); }
}

window.onload = loadScene;