import * as THREE from "../js/three.module.js"
import { OrbitControls } from "../js/OrbitControls.js"

var isLoaded = false;
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

    //if (isLoaded) return;

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
    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
        
    scene.add(cube);

    camera.position.z = 5;

    animate();
    //isLoaded = true;
}

window.editor = {
    load: () => { loadScene(); }
}

window.onload = loadScene;