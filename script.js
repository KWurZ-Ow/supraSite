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
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 5;
camera.position.y = 1.5;

//===================================================== lights
var keyLight = new THREE.DirectionalLight(0xefefff, 5);
keyLight.position.set(10, 7.1, 2.6)
scene.add(keyLight);

var fillLight = new THREE.DirectionalLight(0xffefef, 0.3);
fillLight.position.set(-2, -2, -2)
scene.add(fillLight);

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

    mixer = new THREE.AnimationMixer(gltf.scene)

    for (let i = 0; i < 4; i++) {
        const animationAction = mixer.clipAction((gltf).animations[i])
        animationActions.push(animationAction)
        animationActions[i].play()
    }
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
    }, 500);

}

setTimeout(() => {
    isDelayMinPassed = true
    if (isLoaded) {
        makeLoadingScreenDisepear()
    }
}, 2500);


const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional

controls.enableDamping = true;
controls.dampingFactor = 0.01;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 35;
controls.maxPolarAngle = Math.PI ;

var clock = new THREE.Clock();
function render() {
    requestAnimationFrame(render);
    var delta = clock.getDelta();
    if (mixer != null) mixer.update(delta);
    // if (model) model.rotation.y += 0.010;
    stats.update();
    controls.update();
    if (modelReady) mixer.update(clock.getDelta())

    renderer.render(scene, camera);
}
render();

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