import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js"

//===================================================== canvas
var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
renderer.setSize(window.innerWidth, window.innerHeight);
let canva = document.getElementById('canva')
canva.appendChild(renderer.domElement);

//===================================================== scene
var scene = new THREE.Scene();

//===================================================== camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 5;
camera.position.y = 1.5;

//===================================================== lights
var keyLight = new THREE.PointLight(0xefefff, 10);
keyLight.position.set(10, 7.1, 2.6)
keyLight.distance = 50
scene.add(keyLight);

var fillLight = new THREE.PointLight(0xffefef, 0.3);
fillLight.position.set(-2, -2, -2)
fillLight.distance = 50
scene.add(fillLight);

//===================================================== resize
window.addEventListener("resize", function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

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
        console.log('poids de ta mere :', xhr.loaded)
        if (xhr.loaded == xhr.total || xhr.loaded >= 7674928) {
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
controls.maxPolarAngle = Math.PI;

var clock = new THREE.Clock();
function render() {
    requestAnimationFrame(render);
    var delta = clock.getDelta();
    if (mixer != null) mixer.update(delta);
    controls.update();
    if (modelReady) mixer.update(clock.getDelta())

    renderer.render(scene, camera);
}
render();

let menu = document.getElementsByClassName('menu')[0]
let isMenuOn = false
let soundOpenMLenu = new Audio("./assets/sounds/openMenu.mp3")
let soundCloseMLenu = new Audio("./assets/sounds/closeMenu.mp3")

let canvaContainer = document.getElementById("canvaContainer")

menu.addEventListener("mouseenter", (e) => {
    canvaContainer.classList.add("blury")
    isMenuOn = true
    soundOpenMLenu.play()
    menu.classList.add("opened")
})
menu.addEventListener("mouseleave", (e) => {
    if (currentPage == 0) {
        canvaContainer.classList.remove("blury")
    }
    isMenuOn = false
    soundCloseMLenu.play()
    menu.classList.remove("opened")
})

let menuItems = Array.prototype.slice.call(document.getElementsByClassName("menuItem"))
let hoverSounds = []

menuItems.forEach((item, i) => {
    hoverSounds.push(new Audio("./assets/sounds/hoverMenu.mp3"))
    item.addEventListener("mouseenter", (e) => {
        hoverSounds[i].play()
    })
});

let currentPage = 0
let page1 = document.getElementById("page1")
let page2 = document.getElementById("page2")
let page3 = document.getElementById("page3")
let pages = [page1, page2, page3]

function loadPage(page) {
    currentPage = page
    for (let i = 0; i < 3; i++) {
        if (i + 1 != page) {
            pages[i].classList.remove("visible")
        } else {
            pages[i].classList.add("visible")
        }
    }
    menu.classList.remove("opened")
    if (page == 0) canvaContainer.classList.remove("blury")
}

//add onclic on the menu items
for (let i = 0; i < 4; i++) {
    menu.children[1].children[i].onclick = () => loadPage(i);
}

//easterEgg
let easterClicks = 0
const logo = document.getElementById("logoTotoni")
const egg = document.getElementById("egg")
logo.onclick = () => {
    easterClicks++
    if (easterClicks > 9) {
        egg.classList.add("active")
        setTimeout(() => {
            egg.classList.remove("active")
        }, 4000);
        easterClicks = 0
    }

}
loadPage(0)



// IXO //

window.addEventListener('load', () => {
    document.addEventListener('wheel', zoom)
    document.body.addEventListener('mouseleave', () => { isClicking = false })
    document.body.addEventListener('mousedown', () => { isClicking = true })
    document.body.addEventListener('mouseup', () => { isClicking = false })
    document.body.addEventListener('mousemove', moveBgStars)
    window.addEventListener('resize', () => {
        let nodes = document.querySelectorAll(".node")
        for (let i = 0; i < nodeOrigs.length; i++) {
            let node = nodes[i]

            node.style.top = (nodeOrigs[i].y / 100) * window.innerHeight + "px"
            node.style.left = (nodeOrigs[i].x / 100) * window.innerWidth + "px"

        }


        let links = document.querySelectorAll(".links")
        for (let i = 0; i < links.length; i++) {
            let link = links[i]
            let val = linkVal[i]

            link.setAttribute("width", document.querySelector("#tree").getBoundingClientRect().width)
            link.setAttribute("height", document.querySelector("#tree").getBoundingClientRect().height)

            let nodeWidth = nodes[0].getBoundingClientRect().width
            let bPoint = { x: parseInt(nodes[val.begin].style.left.replace("px", "")), y: parseInt(nodes[val.begin].style.top.replace("px", "")) }
            let ePoint = { x: parseInt(nodes[val.end].style.left.replace("px", "")), y: parseInt(nodes[val.end].style.top.replace("px", "")) }

            link.querySelector("path").setAttribute("d", "M " + (bPoint.x + nodeWidth / 2) + " " + (bPoint.y + nodeWidth / 2) + " L " + (ePoint.x + nodeWidth / 2) + " " + (ePoint.y + nodeWidth / 2))
        }
    })

    createTree()
})

async function createTree() {
    await createNodes()
    await addLinks()
}


// Zoom Event
let zoomVal = 1
const ZOOM_SPEED = 0.05
function zoom(event) {
    if (event.deltaY > 0 && zoomVal > 1) {
        //let zoomReg = parseFloat(document.querySelector("#tree").style.transform.match(/[0-9]\.[0-9]*/g)[0])
        zoomVal -= ZOOM_SPEED
        document.querySelector("#tree").style.transform = "scale(" + zoomVal + ")"

        console.log("dezoom")
    }

    if (event.deltaY < 0 && zoomVal < 1.3) {
        zoomVal += ZOOM_SPEED
        document.querySelector("#tree").style.transform = "scale(" + zoomVal + ")"
    }
}


// Links creation from a .json file
let canTextChange = true
let isClicking = false
function createLinks() {
    for (let i = 0; i < 39; i++) {
        let link = document.createElement("span")
        link.classList.add("links")
        document.querySelector("#star-1").appendChild(link)
    }
}


// Affiliate the links to each node
let linkVal = []
async function addLinks() {
    let res = await fetch("./assets/json/links.json")
    let links = await res.json()

    for (let link of links)
        linkVal.push(link)


    let nodes = document.querySelectorAll(".node")
    for (let val of linkVal) {
        let link = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        let linkPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
        let linkAni = document.createElementNS("http://www.w3.org/2000/svg", "animate")

        linkPath.appendChild(linkAni)
        link.appendChild(linkPath)

        document.querySelector("#tree").appendChild(link)

        link.classList.add("links")

        link.setAttribute("width", document.querySelector("#loader").getBoundingClientRect().width)
        link.setAttribute("height", document.querySelector("#loader").getBoundingClientRect().height)

        let nodeWidth = 48//nodes[0].getBoundingClientRect().width
        let bPoint = { x: parseInt(nodes[val.begin].style.left.replace("px", "")), y: parseInt(nodes[val.begin].style.top.replace("px", "")) }
        let ePoint = { x: parseInt(nodes[val.end].style.left.replace("px", "")), y: parseInt(nodes[val.end].style.top.replace("px", "")) }

        linkPath.setAttribute("d", "M " + (bPoint.x + nodeWidth / 2) + " " + (bPoint.y + nodeWidth / 2) + " L " + (ePoint.x + nodeWidth / 2) + " " + (ePoint.y + nodeWidth / 2))

        linkPath.setAttribute("stroke-miterlimit", "10")
        linkPath.setAttribute("fill", "none")
        linkPath.setAttribute("stroke", "#858484")
        linkPath.setAttribute("stroke-width", "2")
        linkPath.setAttribute("stroke-dasharray", "10")
        linkPath.setAttribute("stroke-dashoffset", "1")

        linkAni.setAttribute("attributeName", "stroke-dashoffset")
        linkAni.setAttribute("values", "100;0")
        linkAni.setAttribute("dur", "9s")
        linkAni.setAttribute("calcMode", "linear")
        linkAni.setAttribute("repeatCount", "indefinite")
    }
}



// Background animation on drag event
let prevInput = { x: 0, y: 0 }
let x = 0, y = 0

const MAX_OFF = 50
const STAR4_OFF = 3 * window.innerWidth / 100
const STAR3_OFF = 2 * window.innerWidth / 100
const STAR2_OFF = 5 * window.innerWidth / 100
const STAR1_OFF = 10 * window.innerWidth / 100

function moveBgStars(event) {
    if (isClicking) {
        let star4 = document.querySelector("#star-4")
        let star3 = document.querySelector("#star-3")
        let star2 = document.querySelector("#star-2")
        let star1 = document.querySelector("#star-1")
        let tree = document.querySelector("#tree")

        let offX = (event.pageX - prevInput.x) * 0.3
        let offY = (event.pageY - prevInput.y) * 0.3

        if (star1.getBoundingClientRect().x + offX <= 0 && star1.getBoundingClientRect().width + star1.getBoundingClientRect().x + offX >= window.innerWidth)
            x += offX

        if (star1.getBoundingClientRect().y + offY <= 0 && star1.getBoundingClientRect().height + star1.getBoundingClientRect().y + offY >= window.innerHeight)
            y += offY


        tree.style.left = x + "px"
        tree.style.top = y + "px"

        star1.style.left = (0.9 * x - STAR1_OFF) + "px"
        star1.style.top = (0.9 * y - STAR1_OFF / 2) + "px"

        star2.style.left = (0.5 * x - STAR2_OFF) + "px"
        star2.style.top = (0.5 * y - STAR2_OFF / 2) + "px"

        star3.style.left = (0.2 * x - STAR3_OFF) + "px"
        star3.style.top = (0.2 * y - STAR3_OFF / 2) + "px"

        star4.style.left = (0.3 * x - STAR4_OFF) + "px"
        star4.style.top = (0.3 * y - STAR4_OFF / 2) + "px"
    }

    prevInput.x = event.pageX
    prevInput.y = event.pageY
}


// Creating nodes from a .json file
let nodeOrigs = []
async function createNodes() {
    let res = await fetch("./assets/json/origins.json")
    nodeOrigs = await res.json()

    for (let i = 0; i < nodeOrigs.length; i++) {
        let node = document.createElement("span")
        node.classList.add("node")
        document.querySelector("#tree").appendChild(node)


        node.style.top = (nodeOrigs[i].y / 100) * window.innerHeight + "px"
        node.style.left = (nodeOrigs[i].x / 100) * window.innerWidth + "px"

        node.classList.add(nodeOrigs[i].class)


        let pHolder = document.createElement("span")
        pHolder.classList.add("placeholder")
        pHolder.classList.add(nodeOrigs[i].pch)
        node.appendChild(pHolder)

        let overEvent = e => {
            if (!isClicking) {
                if (e.target.querySelector(".placeholder") != null) {
                    e.target.querySelector(".placeholder").style.marginTop = "-15vh"
                    e.target.querySelector(".placeholder").style.opacity = "1"
                }
                else {
                    e.target.style.marginTop = "-500em"
                    e.target.style.opacity = "0"
                }
            }
        }
        node.addEventListener('mouseover', overEvent)

        let outEvent = e => {
            e.target.querySelector(".placeholder").style.marginTop = "-500em"
            e.target.querySelector(".placeholder").style.opacity = "0"
        }
        node.addEventListener('mouseleave', outEvent)
    }
}