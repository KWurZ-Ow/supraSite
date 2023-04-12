let photosList = [
    {
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
                        posY: 37,
                    },
                    {
                        nom: "b2",
                        posX: 7,
                        posY: 18,
                    },
                    {
                        nom: "b3",
                        posX: 86,
                        posY: 24,
                    },
                ]
            },
            {
                nom: "c",
                posX: 61,
                posY: 39,
            },
            {
                nom: "d",
                posX: 51,
                posY: 12,
            },
            {
                nom: "e",
                posX: 15,
                posY: 86,
            },
            {
                nom: "f",
                posX: 68,
                posY: 81,
            }
        ]
    }
]

function zoom(img) {
    let toRemove = []
    img.classList.add("big")
    for (const children of container.children) {
        if(children.classList.length == 0) {
            toRemove.push(children)
        }
    }
    toRemove.forEach(element => {
        element.remove()
    });
    document.getElementById("container").classList.add("bigContainer")
    setTimeout(() => {
        createImages()
    }, 1500);
}

function back() {
    
}

let currentImg = photosList[0]
let previousImg = currentImg
let container = document.getElementById("container")
createImages()

function createImages() {
    currentImg.childs?.map((child) => {
        let img = document.createElement("img")
        img.src = `./img/${child.nom}.jpg`
        img.style.left = `${child.posX}%`
        img.style.top = `${child.posY}%`
        img.onclick = () => {
            if (!img.classList.contains("big")) {
                previousImg = currentImg
                currentImg = child
                zoom(img)
            }
        }
        
        container.append(img)
    })
}

window.addEventListener('mousedown', (event) => {
    mousePos = { x: event.clientX, y: event.clientY };
    console.log(`posX: ${Math.round((mousePos.x-15)/1920*100)}, posY: ${Math.round((mousePos.y-15)/1080*100)}`)
});