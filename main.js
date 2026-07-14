import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/DRACOLoader.js';

const scene = new THREE.Scene();
const canvas = document.getElementById('experience-canvas');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// creating the renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );

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
        scene.add( glb.scene ); 
    }, 
    undefined, 
    function ( error ) { console.error( error ); } 
);

// adding light
// directional light
const color = 0xFFFFFF;
const intensity = 3;
const directionalLight = new THREE.DirectionalLight(color, intensity);
directionalLight.position.set(0, 10, 3);
directionalLight.target.position.set(-2, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

// hemisphere light
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 38800420;  // dark green
const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(hemisphereLight);

// creating the camera
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 ); 

// creating the arcball controls for the camera
const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true; // Adds buttery smooth physics
controls.dampingFactor = 0.05;
controls.update(); // updating the controls 

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
    controls.update();
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );