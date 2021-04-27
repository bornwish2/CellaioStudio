import * as THREE from "../js/three.module.js"
import { OrbitControls } from "../js/OrbitControls.js"

var container;
var scene, camera, renderer, controls;

var geometry, material, cube;

var floor1, floor2, sealing1, sealing2, frontWall, sideWall, backWall;

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

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
    camera.rotateZ(Math.PI / 2);
    camera.position.z = 3;
    camera.position.x = -0.5;
    camera.position.y = 1.5;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(1.2, 1.4, 0);
    // todo: controls - enableDamping?
    loadRoom();
    loadLighting();

    //const axesHelper = new THREE.AxesHelper(5);
    //scene.add(axesHelper);

    handleResizing();

    animate();
}

function loadRoom() {
    // todo: onLoad?

    frontWall = createWall(3, 2.5);
    frontWall.position.y = 2.5 / 2;;
    frontWall.position.x = 3 / 2;

    floor1 = createFloor(6, 5);
    floor1.rotateX(Math.PI / 2);
    floor1.position.z = 2.5;

    floor2 = createFloor(3, 5);
    floor2.rotateX(Math.PI / 2);
    floor2.position.x = -3 / 2;
    floor2.position.z = -2.5;

    sideWall = createWall(3, 2.5);
    sideWall.rotateY(Math.PI / 2);
    sideWall.position.x = 3;
    sideWall.position.y = 2.5 / 2;
    sideWall.position.z = 3 / 2;

    backWall = createWall(5, 2.5);
    backWall.rotateY(Math.PI / 2);
    backWall.position.y = 2.5 / 2;
    backWall.position.z = -2.5;

    sealing1 = createWall(6, 5);
    sealing1.rotateX(Math.PI / 2);
    sealing1.position.y = 2.5;
    sealing1.position.z = 2.5;

    sealing2 = createWall(3, 5);
    sealing2.rotateX(Math.PI / 2);
    sealing2.position.y = 2.5;
    sealing2.position.z = -2.5;
    sealing2.position.x = -1.5;
    

    scene.add(floor1);
    scene.add(floor2);
    scene.add(frontWall);
    scene.add(sideWall);
    scene.add(backWall);
    scene.add(sealing1);
    scene.add(sealing2);
}

function createWall(x, y) {

    var wallTexture = new THREE.TextureLoader().load('wallplates.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(2 / 3 * x, 2 / 3 * y);
    var wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });
    wallMaterial.side = THREE.DoubleSide;

    return new THREE.Mesh(new THREE.PlaneGeometry(x, y), wallMaterial);
}

function createFloor(x, y) {
    // todo
    return createWall(x, y);
}

var light, ambientLight;
function loadLighting() {

    ambientLight = new THREE.AmbientLight(0xffeedd, 0.2);
    light = new THREE.PointLight(0xffffff, 1, 25);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(ambientLight);

    scene.fog = new THREE.Fog(0x000000, 2, 7);
}

function addShelve() {

    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
}

function handleResizing() {
    window.addEventListener('resize', function () {
        var width = container.clientWidth;
        var height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    });
}

window.editor = {
    load: () => { loadScene(); },
    addShelve: () => { addShelve(); }
}

window.onload = loadScene;