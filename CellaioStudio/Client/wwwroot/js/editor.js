import * as THREE from "../js/three.module.js"
import { OrbitControls } from "../js/OrbitControls.js"
import { exampleProject } from "../js/exampleProject.js"

var container;
var scene, camera, renderer, controls;
var raycaster, mouseVector;

var floor1, floor2, sealing1, sealing2, frontWall, sideWall, backWall;

var shelveTexture = new THREE.TextureLoader().load('textures/wood2.jpg');
var shelves, selectedShelve;
var isDragging, dragStart, lastMousePoint, mousedown = 0;
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
    raycaster = new THREE.Raycaster();
    mouseVector = new THREE.Vector2();
    shelves = new THREE.Object3D();
    scene.add(shelves);

    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mousedown', onDocumentMouseDown, false);
    container.addEventListener('mouseup', onDocumentMouseUp, false);

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

    var data = JSON.parse(json);
    var loader = new THREE.ObjectLoader();
    loader.parse(data, function (result) {
        scene = result
        for (var i = 0; i < scene.children.length; i++) {
            var obj = scene.children[i];
            if (obj.children != null && obj.children.length > 0)
                shelves = obj;
        }
    });
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
    shelves.add(shv);

    //scene.add(shv);
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

function onMouseMove(event) {

    if (!isDragging && selectedShelve != null && mousedown) {
        isDragging = true;
    }

    if (isDragging) {
        if (controls.enabled)
            controls.enabled = false;
        handleDrag(event);
        return;
    }

    mouseVector.x = 2 * (event.offsetX / container.clientWidth) - 1;
    mouseVector.y = 1 - 2 * (event.offsetY / container.clientHeight);

    raycaster.setFromCamera(mouseVector, camera);

    var intersects = raycaster.intersectObjects(shelves.children);

    for (var i = 0; i < shelves.children.length; i++) {
        if (shelves.children[i] != selectedShelve)
            shelves.children[i].material.color.setRGB(1, 1, 1);
    }

    if (intersects.length > 0) {
        var obj = intersects[0].object;
        if (obj != selectedShelve)
            obj.material.color.setRGB(0.7, 0.8, 1);
    }

    if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
    }
    else {
        renderer.domElement.style.cursor = 'auto';
    }
}

function onDocumentMouseDown(event) {

    mousedown = 1;
    event.preventDefault;
    mouseVector.x = 2 * (event.offsetX / container.clientWidth) - 1;
    mouseVector.y = 1 - 2 * (event.offsetY / container.clientHeight);

    raycaster.setFromCamera(mouseVector, camera);
    var intersects = raycaster.intersectObjects(shelves.children);

    if (selectedShelve != null)
        selectedShelve.material.color.setRGB(1, 1, 1);

    if (intersects.length == 0) {
        selectedShelve = null;
        return;
    }

    selectedShelve = intersects[0].object;
    selectedShelve.material.color.setRGB(1, 0, 0);
}

function onDocumentMouseUp(event) {

    mousedown = 0;
    controls.enabled = true;
    if (!isDragging) return;

    isDragging = false;
    dragStart = null;
    if (selectedShelve == null) return;
    selectedShelve.material.color.setRGB(1, 1, 1);
    selectedShelve = null;
}

function handleDrag(event) {

    if (!isDragging) return;

    if (dragStart == null) {
        dragStart = new THREE.Vector2();
        dragStart.x = event.offsetX;
        dragStart.y = event.offsetY;

        lastMousePoint = new THREE.Vector2();
        lastMousePoint.x = dragStart.x;
        lastMousePoint.y = dragStart.y;
    }

    var diffX = lastMousePoint.x - event.offsetX;
    diffX /= container.clientWidth;
    var diffY = lastMousePoint.y - event.offsetY;
    diffY /= container.clientHeight;

    var newX = selectedShelve.position.x + (-1) * 6 * diffX;
    var newY = selectedShelve.position.y + 4 * diffY;
    if (validateCoordinates(newX, newY, selectedShelve.position.z, selectedShelve)) {
        selectedShelve.position.x = newX;
        selectedShelve.position.y = newY;
    }

    lastMousePoint.x = event.offsetX;
    lastMousePoint.y = event.offsetY;
}

function validateCoordinates(x, y, z, shelve) {

    if (shelve == null)
        return false;

    var maxHeight = 2.5;
    var maxWidth = 3;
    var minHeight = 0;
    var minWidth = 0;

    if (shelve.rotation.z == 0) {
        var width = shelve.geometry.parameters.width;
        if (x < minWidth + width / 2 || x > maxWidth - width / 2
            || y < minHeight + shelveThickness / 2 || y > maxHeight - shelveThickness / 2)
            return false;
    }
    else {
        var height = shelve.geometry.parameters.width;
        if (y < minHeight + height / 2 || y > maxHeight - height / 2
            || x < minWidth + shelveThickness / 2 || x > maxWidth - shelveThickness / 2)
            return false;
    }
    
    return true;
}

function createShelve(length, depth = 0.4, thickness = shelveThickness) {
    var geometry = new THREE.BoxGeometry(length, thickness, depth);
    var material = new THREE.MeshPhongMaterial({ map: shelveTexture });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function showExample() {
    var ex = new exampleProject();
    ex.load(scene, shelves);
}

window.editor = {
    load: () => { loadScene(); },
    exampleProject: () => { showExample(); },
    addShelve: () => { addShelve(); },
    serializeScene: () => { return getSceneJson(); },
    loadFromJson: json => { loadFromJson(json); }
}

window.onload = loadScene;