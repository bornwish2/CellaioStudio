var isLoaded = false;

function loadScene() {



    isLoaded = true;
}

window.editor = {
    load: () => { loadScene(); }
}