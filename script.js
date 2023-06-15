import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://unpkg.com/three@0.126.0/examples/jsm/libs/stats.module.js';
import { FBXLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/FBXLoader.js"

//===================================================== canvas
var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//===================================================== scene
var scene = new THREE.Scene();

//===================================================== camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 1.5;

//===================================================== lights
var keyLight = new THREE.DirectionalLight(0xefefff, 3);
keyLight.position.set(2, 2, 2)
scene.add(keyLight);

var fillLight = new THREE.DirectionalLight(0xffefef, 0.3);
fillLight.position.set(-2, -2, -2)
scene.add(fillLight);

const helper1 = new THREE.DirectionalLightHelper( keyLight, 1, 0xff0000);
const helper2 = new THREE.DirectionalLightHelper( fillLight, 0.5);
scene.add( helper1, helper2 );

//===================================================== resize
window.addEventListener("resize", function() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

const stats = new Stats();
document.body.appendChild( stats.dom );

//===================================================== model
let mixer
let modelReady = false
const animationActions = []
const fbxLoader = new FBXLoader()

fbxLoader.load(
    './Boule.fbx',
    (object) => {
        object.scale.set(0.01, 0.01, 0.01)
        mixer = new THREE.AnimationMixer(object)
        
        const animationAction = mixer.clipAction(
            (object).animations[0]
            )
            animationActions.push(animationAction)
            animationActions[0].play()
            
            scene.add(object)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            document.getElementById('progress').style.width = `${(xhr.loaded / xhr.total) * 100}%`
            if (xhr.loaded == xhr.total){
                document.getElementById('loader').style.opacity = 0
                setTimeout(() => {
                    document.getElementById('loader').style.display = "none"
                }, 300);
            }
        },
        (error) => {
            console.log(error)
        }
        )
        
        
        //stars
        for (let i = 0; i < 700; i++) {
            const geometry = new THREE.SphereGeometry( Math.random()*0.1, 10, 10 );
            const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
            const star = new THREE.Mesh( geometry, material );            
            
            // Calcul des coordonnées sphériques aléatoires pour la position de la sphère fille
            const theta = Math.random() * Math.PI * 2; // Angle horizontal
            const phi = Math.acos(2 * Math.random() - 1); // Angle vertical
            const radius = 50; // Rayon de la sphère mère
            
            // Conversion des coordonnées sphériques en coordonnées cartésiennes
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            star.position.set(x, y, z)
            scene.add( star );
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
        
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.listenToKeyEvents( window ); // optional
        
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