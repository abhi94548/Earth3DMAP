import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from 'https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.120.1/examples/jsm/libs/stats.module.js';

var camera, scene, renderer, controls, geometry, material, mesh, raycaster, texture;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 1000);
    camera.position.z = 2;
    scene.add(camera);

    var loader = new THREE.TextureLoader();
    texture = loader.load( 'texture/earthmap1k.jpg');
    
    geometry = new THREE.SphereGeometry(0.6, 600, 300);
    material = new THREE.MeshPhongMaterial({
        map: texture,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

       // ambient light
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientlight);

    // point light
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.addEventListener('dblclick', onDocumentMouseUp, false);

    controls = new OrbitControls(camera, renderer.domElement);

//    projector = new THREE.Projector();
    raycaster = new THREE.Raycaster();

    document.body.appendChild(renderer.domElement);
}

function getMousePosition(clientX, clientY) {
    var mouse2D = new THREE.Vector2();
    mouse2D.x = (clientX / window.innerWidth) * 2 - 1;
    mouse2D.y = -(clientY / window.innerHeight) * 2 + 1;
    mouse2D.z = 0.5;
    return mouse2D;
}

function onDocumentMouseUp(event) {
    event.preventDefault();

    var mouse3D = getMousePosition(event.clientX, event.clientY);
    console.log(mouse3D.x + ' ' + mouse3D.y + ' ' + mouse3D.z);

    var vector = new THREE.Vector3( mouse3D.x, mouse3D.y, 1 );    
    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects(scene.children );
    console.log(Math.round(intersects[0].uv.x * texture.image.width) + " X axis");
    console.log(Math.round(intersects[0].uv.y * texture.image.height) + " Y axis");
    console.log(intersects[0].object.position);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}