import * as THREE from 'https://cdn.skypack.dev/three@0.127.0';
import { OrbitControls } from 'https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.120.1/examples/jsm/libs/stats.module.js';


var scene, camera, earthMesh, renderer, controls, mouse, raycaster;

init();
animate();

function init() {
    const canvas = document.querySelector('.webgl');

    scene = new THREE.Scene();

    const fov = 50;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.5;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    scene.add(camera);


    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

    controls = new OrbitControls(camera, renderer.domElement);

    var earthGeometry = new THREE.SphereGeometry(0.6, 600, 300);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('texture/earthmap1k.jpg'),
    });


    earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // ambient light
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientlight);

    // point light
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // point light helper
    const Helper = new THREE.PointLightHelper(pointLight);
    scene.add(Helper);


    // handling resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }, false);


    raycaster = new THREE.Raycaster(); // create once
    mouse = new THREE.Vector2(); 

    raycaster = new THREE.Raycaster();

    document.body.appendChild(renderer.domElement);
}

function getMousePosition(clientX, clientY) {
    var mouse2D = new THREE.Vector3();
    var mouse3D = new THREE.Vector3();
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
    if(intersects.length > 0){
        console.log(intersects[0].object.position);
    }
}


function animate(){
    requestAnimationFrame(animate);
    earthMesh.rotation.y -= 0.0015;
    controls.update();
    render();
}


function render() {
    renderer.render(scene, camera);
}