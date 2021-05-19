import * as THREE from "../js/three.module.js"
import { OrbitControls } from "../js/OrbitControls.js"
import { exampleProject } from "../js/exampleProject.js"

var container;
var scene, camera, renderer, controls;
var raycaster, mouseVector;

var floor1, floor2, sealing1, sealing2, frontWall, sideWall, backWall;

var shelveTexture = new THREE.TextureLoader().load('textures/wood2.jpg');
var shelves, selectedShelve;
var isDragging, dragStart, dragPlane, lastMousePoint, mousedown = 0;
var lastTouchTime, touchTimer;
const shelveThickness = 0.0682;

var dotnetEditor;

function render() {
    controls.update();
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function loadScene(dotnetInstance) {

    dotnetEditor = dotnetInstance;
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
    container.addEventListener('contextmenu', onContextMenu, false);
    container.addEventListener('dblclick', onDoubleClick, false);
    container.addEventListener('touchstart', onTouchStart, false);
    container.addEventListener('touchend', onTouchEnd, false);
    container.addEventListener('touchmove', onTouchMove, false);

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
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
        handleDrag(event.offsetX, event.offsetY);
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
    handleClick(event.offsetX, event.offsetY);
}

function onTouchStart(e) {

    touchTimer = setTimeout(onLongTouch, 500);

    mousedown = 1;
    event.preventDefault;
    var rect = e.target.getBoundingClientRect();
    var x = e.targetTouches[0].pageX - rect.left;
    var y = e.targetTouches[0].pageY - rect.top;
    handleClick(x, y);
    mouseVector.x = x;
    mouseVector.y = y;

    if (selectedShelve != null)
        controls.enabled = false;

    var now = new Date().getTime();
    var timesince = now - lastTouchTime;
    if ((timesince < 600) && (timesince > 0)) {

        // TODO: double tap   
        if (selectedShelve != null) {
            showLengthEdit(Math.floor(x), Math.floor(y), selectedShelve.geometry.parameters.width);
        }
    }

    lastTouchTime = new Date().getTime();
}

function onTouchEnd(e) {

    mousedown = 0;
    controls.enabled = true;
    if (touchTimer)
        clearTimeout(touchTimer);
    if (!isDragging) return;

    isDragging = false;
    dragStart = null;
    if (selectedShelve == null) return;

    selectedShelve.material.color.setRGB(1, 1, 1);
    selectedShelve = null;
}

function onTouchMove(e) {
    if (touchTimer)
        clearTimeout(touchTimer);

    if (!isDragging && selectedShelve != null && mousedown) {
        isDragging = true;
    }

    if (isDragging) {
        if (controls.enabled)
            controls.enabled = false;
        var rect = e.target.getBoundingClientRect();
        var x = e.targetTouches[0].pageX - rect.left;
        var y = e.targetTouches[0].pageY - rect.top;
        handleDrag(x, y);
        return;
    }
}

function onLongTouch() {
    if (selectedShelve == null) return;
    showContextMenu(Math.floor(mouseVector.x), Math.floor(mouseVector.y));
}

function onContextMenu(event) {
    if (selectedShelve == null) return;
    showContextMenu(event.offsetX, event.offsetY);
}

function onDoubleClick(event) {

    handleClick(event.offsetX, event.offsetY);
    if (selectedShelve == null) return;

    showLengthEdit(event.offsetX, event.offsetY, selectedShelve.geometry.parameters.width);
}

function handleClick(x, y) {

    mouseVector.x = 2 * (x / container.clientWidth) - 1;
    mouseVector.y = 1 - 2 * (y / container.clientHeight);

    raycaster.setFromCamera(mouseVector, camera);
    var intersects = raycaster.intersectObjects(shelves.children);

    if (selectedShelve != null)
        selectedShelve.material.color.setRGB(1, 1, 1);

    if (intersects.length == 0) {
        selectedShelve = null;
        hideContextMenu();
        hideLengthEdit();
        return;
    }

    //dragPlane = new THREE.PlaneBufferGeometry();
    //dragPlane.position.z = intersects[0].point.z;
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

function handleDrag(x, y) {

    if (!isDragging) return;

    if (dragStart == null) {
        dragStart = new THREE.Vector2();
        dragStart.x = x;
        dragStart.y = y;

        lastMousePoint = new THREE.Vector2();
        lastMousePoint.x = dragStart.x;
        lastMousePoint.y = dragStart.y;
    }

    var diffX = lastMousePoint.x - x;
    diffX /= container.clientWidth;
    diffX *= (-6);
    var diffY = lastMousePoint.y - y;
    diffY /= container.clientHeight;
    diffY *= 4;

    var newX = selectedShelve.position.x + diffX;
    var newY = selectedShelve.position.y + diffY;

    //raycaster.setFromCamera(mouseVector, camera);
    //var intersects = raycaster.intersectObjects(dragPlane);
    //if (intersects.length > 0) {
    //    newX = intersects[0].point.x;
    //    newY = intersects[0].point.y;
    //}

    var newPoint = { x: newX, y: newY };
    validateCoordinates(newPoint, selectedShelve.position.z, selectedShelve);

    selectedShelve.position.x = newPoint.x;
    selectedShelve.position.y = newPoint.y;

    lastMousePoint.x = x;
    lastMousePoint.y = y;
}

function validateCoordinates(point, z, shelve) {

    if (shelve == null)
        return;

    var x = point.x;
    var y = point.y;
    var maxHeight = 2.5;
    var maxWidth = 3;
    var minHeight = 0;
    var minWidth = 0;

    if (shelve.rotation.z == 0) {
        var width = shelve.geometry.parameters.width;
        if (x < minWidth + width / 2)
            point.x = minWidth + width / 2;
        else if (x > maxWidth - width / 2)
            point.x = maxWidth - width / 2;

        if (y < minHeight + shelveThickness / 2)
            point.y = minHeight + shelveThickness / 2;
        else if (y > maxHeight - shelveThickness / 2)
            point.y = maxHeight - shelveThickness / 2;
    }
    else {
        var height = shelve.geometry.parameters.width;
        if (y < minHeight + height / 2)
            point.y = minHeight + height / 2;
        else if (y > maxHeight - height / 2)
            point.y = maxHeight - height / 2;

        if (x < minWidth + shelveThickness / 2)
            point.x = minWidth + shelveThickness / 2;
        else if (x > maxWidth - shelveThickness / 2)
            point.x = maxWidth - shelveThickness / 2;
    }
}

function createShelve(length, depth = 0.4, thickness = shelveThickness) {
    var geometry = new THREE.BoxGeometry(length, thickness, depth);
    var material = new THREE.MeshPhongMaterial({ map: shelveTexture });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function rotateShelve() {
    if (selectedShelve == null) return;
    selectedShelve.rotateZ(Math.PI / 2);
}

function removeShelve() {
    if (selectedShelve == null) return;
    shelves.remove(selectedShelve);
    selectedShelve.remove();
}

function setShelveLength(len) {
    if (selectedShelve == null) return;

    var currParams = selectedShelve.geometry.parameters;
    var height = currParams.height;
    var depth = currParams.depth;
    var geom = new THREE.BoxGeometry(len, height, depth);
    selectedShelve.geometry = geom;
}

function showExample() {
    var ex = new exampleProject();
    ex.load(scene, shelves);
}

function showContextMenu(x, y) {
    hideLengthEdit();
    dotnetEditor.invokeMethodAsync('ShowContextMenu', x, y);
}

function hideContextMenu() {
    dotnetEditor.invokeMethodAsync('HideContextMenu');
}

function showLengthEdit(x, y, length) {
    dotnetEditor.invokeMethodAsync('ShowLengthEdit', x, y, length);
}
function hideLengthEdit() {
    dotnetEditor.invokeMethodAsync('HideLengthEdit');
}

function saveSnapshot() {
    return renderer.domElement.toDataURL("image/jpeg");
}

window.editor = {
    load: instance => { loadScene(instance); },
    exampleProject: () => { showExample(); },
    addShelve: () => { addShelve(); },
    serializeScene: () => { return getSceneJson(); },
    loadFromJson: json => { loadFromJson(json); },
    rotateShelve: () => { rotateShelve(); },
    removeShelve: () => { removeShelve(); },
    setLength: len => { setShelveLength(len); },
    saveSnapshot: () => { return saveSnapshot(); }
}

window.onload = loadScene;