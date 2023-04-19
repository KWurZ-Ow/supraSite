import photosList from "./imgs.json"  assert { type: 'json' }

let currentImg = photosList
let previousImgs = []
let container = document.getElementById("container")
let aDisplayer = document.getElementById("a")
let bDisplayer = document.getElementById("b")
let currentDisplayer = aDisplayer
let backupDisplayer = bDisplayer

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

currentDisplayer.style.backgroundImage = 'URL("./img/a.jpg")'
createDots(currentImg)

function back() {
    currentImg = previousImgs[previousImgs.length-1]
    transi()
    createDots(currentImg)
    previousImgs.pop()
}

function transi(){
    // let buff = currentDisplayer
    // currentDisplayer = backupDisplayer
    // backupDisplayer = buff

    // currentDisplayer.classList.add("main")
    // currentDisplayer.classList.remove("backup")
    // backupDisplayer.classList.remove("main")
    // setTimeout(() => {
    //     backupDisplayer.classList.add("backup")
    // }, 500);
    currentDisplayer.style.backgroundImage = `URL("./img/${currentImg.nom}.jpg")`
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
    mousePos = { x: event.clientX, y: event.clientY };
    console.log(`posX: ${Math.round((mousePos.x-7.5)/1920*100)}, posY: ${Math.round((mousePos.y-7.5)/1080*100)}`)
});