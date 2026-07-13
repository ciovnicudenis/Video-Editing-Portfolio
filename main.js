import * as THREE from 'three';

const scene = new THREE.Scene();
const canvas = document.getElementById('experience-canvas');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );

// creating the renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize( sizes.width, sizes.height );
document.body.appendChild( renderer.domElement );

// i got the geometry like all the dots forming my mesh and materials, etc forming
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5; // moving the camera away from the cube so we can see it

function handleResize() { // calling this function whenever the window is resized
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    console.log("resizing");

    renderer.setSize( sizes.width, sizes.height );
}

window.addEventListener( 'resize', handleResize );

function animate( time ) { // little animation for our cube :)
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );