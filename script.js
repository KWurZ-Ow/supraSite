let photosList = {
    nom: "a",
    posX: 50,
    posY: 50,
    childs: [
        {
            nom: "b",
            posX: 45,
            posY: 40,
            childs: [
                {
                    nom: "b1",
                    posX: 62,
                    posY: 31,
                },
                {
                    nom: "b2",
                    posX: 8,
                    posY: 4,
                },
                {
                    nom: "b3",
                    posX: 86,
                    posY: 12,
                },
            ]
        },
        {
            nom: "c",
            posX: 61,
            posY: 39,
            childs: [
                {
                    nom: "c1",
                    posX: 72,
                    posY: 52,
                },
                {
                    nom: "c2",
                    posX: 35,
                    posY: 5,
                },
                {
                    nom: "c3",
                    posX: 33,
                    posY: 43,
                },
            ]
        },
        {
            nom: "d",
            posX: 51,
            posY: 12,
            childs: [
                {
                    nom: "d1",
                    posX: 50,
                    posY: 24,
                },
                {
                    nom: "d2",
                    posX: 9,
                    posY: 27,
                },
                {
                    nom: "d3",
                    posX: 87,
                    posY: 27,
                    childs: [
                        {
                            nom: "d31",
                            posX: 42,
                            posY: 2,
                        },
                        {
                            nom: "d32",
                            posX: 63,
                            posY: 30,
                        }
                    ]
                },
            ]
        },
        {
            nom: "e",
            posX: 15,
            posY: 86
        },
        {
            nom: "f",
            posX: 68,
            posY: 81,
            childs: [
                {
                    nom: "f1",
                    posX: 75,
                    posY: 2,
                },
                {
                    nom: "f2",
                    posX: 29,
                    posY: 28,
                }
            ]
        }
    ]
}

let currentImg = photosList
let previousImgs = []
let container = document.getElementById("container")
let aDisplayer = document.getElementById("a")
let bDisplayer = document.getElementById("b")
let currentDisplayer = aDisplayer
let backupDisplayer = bDisplayer

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
    console.log(items)
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
    console.log(`posX: ${Math.round((mousePos.x-15)/1920*100)}, posY: ${Math.round((mousePos.y+15)/1080*100)}`)
});