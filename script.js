import photosList from "./imgs.json"  assert { type: 'json' }

//images
let currentImg = photosList
let previousImgs = []
//dom elements
let container = document.getElementById("container")
let backButton = document.getElementById("back")
//displayers
let aDisplayer = document.getElementById("a")
let bDisplayer = document.getElementById("b")
let currentDisplayer = aDisplayer
let nextDisplayer = bDisplayer

//preload images
let urlsList = []
function loadUrls(imgs){
    imgs.map((img) => {
        urlsList.push(img.nom)
        if (img.childs){
            loadUrls(img.childs)
        }
    })
}
loadUrls([photosList])
urlsList.forEach(url => {
    var img=new Image();
    img.src=`./img/${url}.jpg`;
});
console.log("Liste des images : ", urlsList)

//init
backButton.onclick = () => back()
currentDisplayer.style.backgroundImage = 'URL("./img/a.jpg")'
createDots(currentImg)

function back() {
    if (previousImgs.length == 0){
        console.log("Non")
        return
    }
    currentImg = previousImgs[previousImgs.length-1]
    transi()
    createDots(currentImg)
    previousImgs.pop()
}

function transi(){
    nextDisplayer.style.backgroundImage = `URL("./img/${currentImg.nom}.jpg")`
    nextDisplayer.classList.add("main")
    nextDisplayer.classList.remove("next")
    currentDisplayer.classList.remove("main")
    
    setTimeout(() => {
        currentDisplayer.classList.remove("main")
        currentDisplayer.classList.add("next")
    
        //swap
        let buff = currentDisplayer
        currentDisplayer = nextDisplayer
        nextDisplayer = buff
    }, 1000);
}

function createDots(items) {
    console.log("Affichage de " + items.nom)
    removeDots()
    items.childs?.map((item) => {
        let dot = document.createElement("div")
        dot.style.left = `${item.posX}%`
        dot.style.top = `${item.posY}%`
        dot.classList.add("dot")
        dot.onclick = () => {
            currentImg = item
            previousImgs.push(items)
            createDots(currentImg)
            transi()
        }
        container.append(dot)
    })
}

function removeDots() {
    let toRemove = []
    for (const children of container.children) {
        toRemove.push(children)
    }
    toRemove.forEach(element => {
        element.remove()
    });
}

window.addEventListener('mousedown', (event) => {
    let mousePos = { x: event.clientX, y: event.clientY };
    console.log(`%cposX: ${Math.round((mousePos.x-7.5)/1920*100)}, posY: ${Math.round((mousePos.y-7.5)/1080*100)}`, 'color: #707070')
});
window.addEventListener("load", (event) => {
    document.getElementById("loader").style.display = "none"
});