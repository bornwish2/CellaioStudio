import * as THREE from "../js/three.module.js"
import { OrbitControls } from "../js/OrbitControls.js"

var container;
var scene, camera, renderer, controls;

var floor1, floor2, sealing1, sealing2, frontWall, sideWall, backWall;

var shelveTexture = new THREE.TextureLoader().load('textures/wood2.jpg');
var shelves;
const shelveThickness = 0.0682;

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

    renderer = new THREE.WebGLRenderer({ antialias: true });
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

function getSceneJson() {
    return scene.toJSON();
}

function loadFromJson(json) {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    var loader = new THREE.ObjectLoader();
    
    loader.parse(json, function (result) {
        scene = result
    });
    render();
    //scene = new THREE.ObjectLoader().parse(json);
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
    //scene.add(sealing1);
    //scene.add(sealing2);
}

function createWall(x, y) {

    var wallTexture = new THREE.TextureLoader().load('textures/wallplates.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(2 / 3 * x, 2 / 3 * y);
    var wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
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

    var shv = createShelve(1, 0.4);
    shv.position.set(0.75, 1, 0.2);

    scene.add(shv);
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

function createShelve(length, depth = 0.4, thickness = shelveThickness) {
    var geometry = new THREE.BoxGeometry(length, thickness, depth);
    var material = new THREE.MeshPhongMaterial({ map: shelveTexture });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function exampleProject() {

    // 1374 from bottom to top
    var s1 = createShelve(1.3);
    var s2 = createShelve(1.7);
    var s3 = createShelve(1.7);
    var s4 = createShelve(1.7);
    var s5 = createShelve(1.3);
    s1.position.set(1.45, 0.5, 0.2);
    s2.position.set(1.65, 0.9, 0.2);
    s3.position.set(1.65, 1.3, 0.2);
    s4.position.set(1.65, 1.7, 0.2);
    s5.position.set(1.85, 2.1, 0.2);

    var h1 = createShelve(0.4 - shelveThickness);
    var h2 = createShelve(0.4 - shelveThickness);
    var h3 = createShelve(0.4 - shelveThickness);
    var h4 = createShelve(0.4 - shelveThickness);
    var h5 = createShelve(0.4 - shelveThickness);
    var h6 = createShelve(0.4 - shelveThickness);
    var h7 = createShelve(0.4 - shelveThickness);
    var h8 = createShelve(0.4 - shelveThickness);

    h1.rotateZ(Math.PI / 2);
    h2.rotateZ(Math.PI / 2);
    h3.rotateZ(Math.PI / 2);
    h4.rotateZ(Math.PI / 2);
    h5.rotateZ(Math.PI / 2);
    h6.rotateZ(Math.PI / 2);
    h7.rotateZ(Math.PI / 2);
    h8.rotateZ(Math.PI / 2);
    h1.position.set(0.8 + shelveThickness / 2, 0.7, 0.2);
    h2.position.set(1.2 + shelveThickness / 2, 0.7, 0.2);
    h3.position.set(2.1 - shelveThickness / 2, 1.1, 0.2);
    h4.position.set(2.5 - shelveThickness / 2, 1.1, 0.2);
    h5.position.set(0.8 + shelveThickness / 2, 1.5, 0.2);
    h6.position.set(1.2 + shelveThickness / 2, 1.5, 0.2);
    h7.position.set(2.1 - shelveThickness / 2, 1.9, 0.2);
    h8.position.set(2.5 - shelveThickness / 2, 1.9, 0.2);

    scene.add(s1, s2, s3, s4, s5);
    scene.add(h1, h2, h3, h4, h5, h6, h7, h8);
}

window.editor = {
    load: () => { loadScene(); },
    exampleProject: () => { exampleProject(); },
    addShelve: () => { addShelve(); },
    serializeScene: () => { return getSceneJson(); },
    loadFromJson: json => { loadFromJson(json); }
}

window.onload = loadScene;