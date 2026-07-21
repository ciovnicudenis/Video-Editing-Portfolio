import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/DRACOLoader.js';
import { HDRLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/HDRLoader.js';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xe6f0e6, 0.02);
const canvas = document.getElementById('experience-canvas');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// creating the renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// setting the background of the scene
const hdrLoader = new HDRLoader();
hdrLoader.load('assets/citrus_orchard_road_puresky_4k.hdr', function(hdr) {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = hdr;
    scene.environment = hdr; 
    scene.backgroundBlurriness = 0.1;
});

// initializing DRACOLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); 

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader); // link it to the GLTFLoader

// loading the 3d model
loader.load( 
    './assets/3dlogo.glb', 
    function ( glb ) { 
        //console.log(glb.scene.children[0].name);
        glb.scene.rotateY(Math.PI / 2); // rotating the model to face the camera
        glb.scene.rotateX(Math.PI * 2);
        glb.scene.rotateZ(6); 

        scene.add( glb.scene ); 
    }, 
    undefined, 
    function ( error ) { console.error( error ); } 
);

// adding particles to the scene
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 500;
const posArray = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i++) 
    posArray[i] = (Math.random() - 0.5) * 10; // spreading the particles thru the scene 

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particlesMesh);

// adding light
// directional light
const color = 0xfff0dd;
const intensity = 4;
const directionalLight = new THREE.DirectionalLight(color, intensity);
directionalLight.position.set(5, 10, 5);
directionalLight.target.position.set(0, 0, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);
scene.add(directionalLight.target);

// hemisphere light
const skyColor = 0x66b2ff;  // deep blue sky color
const groundColor = 0x254e2a; // deep forest green color
const hemiIntensity = 0.5; 
const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, hemiIntensity);
scene.add(hemisphereLight);



// creating the camera
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 ); 

// creating the arcball controls for the camera
// const controls = new OrbitControls( camera, canvas );
// controls.enableDamping = true; // Adds buttery smooth physics
// controls.dampingFactor = 0.05;
// controls.minDistance = 0.6; // minimum distance from the target
// controls.maxDistance = 2; // maximum distance from the target
// controls.update(); // updating the controls 
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});


// i got the geometry like all the dots forming my mesh and materials, etc forming
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

camera.position.z = 1; // moving the camera away from the cube so we can see it

function handleResize() { // calling this function whenever the window is resized
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    //console.log("resizing");
    renderer.setSize( sizes.width, sizes.height );
    renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
}

window.addEventListener( 'resize', handleResize );

function animate( time ) { // little animation for our cube :)
    //console.log("animating");
    particlesMesh.rotation.y += 0.001;
    particlesMesh.position.y += 0.0005;

    // camera following mouse movement
    const movementRange = 1;
    const targetX = mouseX * movementRange;
    const targetY = mouseY * movementRange;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );