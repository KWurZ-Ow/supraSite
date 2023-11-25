import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.126.0/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js"

//===================================================== canvas
var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canva').appendChild(renderer.domElement);

//===================================================== scene
var scene = new THREE.Scene();

//===================================================== camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 1.5;

//===================================================== lights
var keyLight = new THREE.DirectionalLight(0xefefff, 3);
keyLight.position.set(2, 2, 2)
scene.add(keyLight);

var fillLight = new THREE.DirectionalLight(0xffefef, 0.3);
fillLight.position.set(-2, -2, -2)
scene.add(fillLight);

const helper1 = new THREE.DirectionalLightHelper(keyLight, 1, 0xff0000);
const helper2 = new THREE.DirectionalLightHelper(fillLight, 0.5);
scene.add(helper1, helper2);

//===================================================== resize
window.addEventListener("resize", function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

const stats = new Stats();
document.body.appendChild(stats.dom);

//===================================================== model
let mixer
let modelReady = false
const animationActions = []
const gltfLoader = new GLTFLoader()
let isDelayMinPassed = false
let isLoaded = false

gltfLoader.load('./assets/Boule.glb', (gltf) => {
    scene.add(gltf.scene)
    
    // gltf.scene.traverse((child) => {
    //     console.log(child)
    //     if(child.isMesh) {
    //         child.geometry.computeVertexNormals();
    //         child.material = new THREE.MeshPhysicalMaterial({
    //             clearcoat: 1,
    //             clearcoatRoughness: 0.1,
    //             transmission: 1,
    //         });
    //     }
    // })

    mixer = new THREE.AnimationMixer(gltf.scene)

    const animationAction = mixer.clipAction((gltf).animations[0])
    animationActions.push(animationAction)
    animationActions[0].play()
},
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        // document.getElementById('progress').style.width = `${(xhr.loaded / xhr.total) * 100}%`
        if (xhr.loaded == xhr.total) {
            if (isDelayMinPassed) {
                makeLoadingScreenDisepear()
            }
            isLoaded = true
        }
    },
    (error) => {
        console.log(error)
    }
)

function makeLoadingScreenDisepear() {
    document.getElementById('loader').style.opacity = 0
    setTimeout(() => {
        document.getElementById('loader').style.display = "none"
        document.getElementsByClassName('dg')[0].style.zIndex = 5 //remet l'UI au premier plan (wtf)
    }, 500);

}

setTimeout(() => {
    isDelayMinPassed = true
    if (isLoaded) {
        makeLoadingScreenDisepear()
    }
}, 2500);


//stars
for (let i = 0; i < 700; i++) {
    const geometry = new THREE.SphereGeometry(Math.random() * 0.1, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    // Calcul des coordonnées sphériques aléatoires pour la position de la sphère fille
    const theta = Math.random() * Math.PI * 2; // Angle horizontal
    const phi = Math.acos(2 * Math.random() - 1); // Angle vertical
    const radius = 50; // Rayon de la sphère mère

    // Conversion des coordonnées sphériques en coordonnées cartésiennes
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    star.position.set(x, y, z)
    scene.add(star);
}

var clock = new THREE.Clock();
function render() {
    requestAnimationFrame(render);
    var delta = clock.getDelta();
    if (mixer != null) mixer.update(delta);
    // if (model) model.rotation.y += 0.010;
    stats.update();
    if (modelReady) mixer.update(clock.getDelta())

    renderer.render(scene, camera);
}
render();

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional

//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2;

//Interface
const gui = new dat.GUI()
const lightFolder = gui.addFolder('Lumières')
const keyLightFolder = lightFolder.addFolder('Keylight')
keyLightFolder.add(keyLight.position, 'x', -10, 10)
keyLightFolder.add(keyLight.position, 'y', -10, 10)
keyLightFolder.add(keyLight.position, 'z', -10, 10)
keyLightFolder.add(keyLight, 'intensity', 0, 5)
keyLightFolder.add(helper1, 'visible')
const fillLightFolder = lightFolder.addFolder('FillLight')
fillLightFolder.add(fillLight.position, 'x', -10, 10)
fillLightFolder.add(fillLight.position, 'y', -10, 10)
fillLightFolder.add(fillLight.position, 'z', -10, 10)
fillLightFolder.add(fillLight, 'intensity', 0, 1)
fillLightFolder.add(helper2, 'visible')
lightFolder.open()
keyLightFolder.open()
fillLightFolder.open()

//cicles
// let bubble = document.getElementById('bubble')

// let container = document.getElementById('container')
// let circles = [
//     {posx: 0, posy: 0, content: "moi"},
//     {posx: 0, posy: 0, content: "bulle"},
//     {posx: 0, posy: 0, content: "autre bulle"},
//     {posx: 0, posy: 0, content: "ou encore une bulle beaucoup plus longue"}
// ]

// circles.forEach(circle => {
//     let element = document.createElement('div')
//     element.classList.add("circle")
//     element.onmouseenter = () => {
//         bubble.innerHTML = circle.content
//         bubble.style.display = "block"
//     }
//     element.onmouseleave = () => {
//         bubble.innerHTML = null
//         bubble.style.display = "none"
//     }
//     container.appendChild(element)
// });
//
// let canvas = document.getElementById('canvas');
// let context = canvas.getContext('2d');

// canvas.height = window.innerHeight;
// canvas.width = window.innerWidth;
// context.beginPath();
// context.moveTo(0,0);
// context.lineTo(1000, 800);
// context.lineWidth = 0.5;

// context.strokeStyle = '#ffffff';
// context.stroke();

// window.addEventListener('mousemove', (event) => {
//     if (bubble.innerHTML){
//         bubble.style.left = `${event.clientX + 15}px`
//         bubble.style.top = `${event.clientY}px`
//     }
// });

let menu = document.getElementsByClassName('menu')[0]
let isMenuOn = false

menu.addEventListener("mouseenter", (e) => {
    document.getElementById('canva').classList.add("blury")
    isMenuOn = true
})
menu.addEventListener("mouseleave", (e) => {
    document.getElementById('canva').classList.remove("blury")
    isMenuOn = false
})