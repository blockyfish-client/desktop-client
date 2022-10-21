var name = "Aim assist"
var description = "Allows any animal to have mahi mahi's target locking ability. Press A to lock on to a target."
var script = `
aimBot = false
mouseX = 0
mouseY = 0
mapeditor = document.querySelector('#canvas-container > canvas')
whitelistedAimbotAnimalId = [18, 26, 29, 33, 44, 47, 52, 67, 77, 88]
if (!aimBotRan) {
    aimBotRan = true
    window.addEventListener("keyup", (e) => {
        if (e.key.toLowerCase() == "a" && document.querySelector('#app > div.modals-container > div') == null && document.querySelector('#app > div.ui > div').style.display == 'none' && document.activeElement.localName != 'input') {
            aimBot = !aimBot
            game.currentScene.uiManager.setTargetId(0)
            if (aimBot) {
                game.currentScene.showMessagePopup('Aim assist on', 1000, 0)
            }
            else {
                game.currentScene.showMessagePopup('Aim assist off', 1000, 0)
            }
        }
    })
    setInterval(() => {
        if (aimBot && game.currentScene != null) {
            if (game.currentScene.myAnimal != null) {
                closestEntityDistance = 9999999
                closestEntity = 0
                for (let i = 0; i < game.currentScene.entityManager.animalsList.length; i++) {
                    if (Math.sqrt(((mouseX - innerWidth/2) - (game.currentScene.entityManager.animalsList[i].position.x - game.currentScene.myAnimal.position._x))**2 + ((mouseY - innerHeight/2) - (game.currentScene.entityManager.animalsList[i].position.y - game.currentScene.myAnimal.position._y))**2) < closestEntityDistance && !game.currentScene.entityManager.animalsList[i].mine && (game.currentScene.myAnimal.tribeId == null || game.currentScene.myAnimal.tribeId != game.currentScene.entityManager.animalsList[i].tribeId) && !(game.gameMode == 2 && game.currentScene.entityManager.animalsList[i].nameObject._text.includes(game.currentScene.myAnimal.nameObject._text.slice(0, 10))) && !whitelistedAimbotAnimalId.includes(game.currentScene.entityManager.animalsList[i].fishLevelData.fishLevel)) {
                        closestEntityDistance = Math.sqrt(((mouseX - innerWidth/2) - (game.currentScene.entityManager.animalsList[i].position.x - game.currentScene.myAnimal.position._x))**2 + ((mouseY - innerHeight/2) - (game.currentScene.entityManager.animalsList[i].position.y - game.currentScene.myAnimal.position._y))**2)
                        closestEntity = game.currentScene.entityManager.animalsList[i].id
                    }
                }
            }
        }
    }, 50)
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
        if (aimBot && game.currentScene != null) {
            if (game.currentScene.myAnimal != null) {
                if (closestEntityDistance < 500) {
                    if (closestEntity != game.currentScene.uiManager.targetId) {
                        game.currentScene.uiManager.setTargetId(0)
                        game.currentScene.uiManager.setTargetId(closestEntity)
                    }
                    c = {"x": innerWidth/2 + game.currentScene.entityManager.getEntity(closestEntity).position.x - game.currentScene.myAnimal.position._x, "y": innerHeight/2 + game.currentScene.entityManager.getEntity(closestEntity).position.y - game.currentScene.myAnimal.position._y}
                    mapeditor.dispatchEvent(new MouseEvent("pointermove", {clientX:c.x, clientY:c.y}))
                }
                else {
                    game.currentScene.uiManager.setTargetId(0)
                }
            }
        }
    })
    setInterval(() => {
        if (aimBot && game.currentScene != null) {
            if (game.currentScene.myAnimal != null) {
                if (closestEntityDistance < 200) {
                    if (closestEntity != game.currentScene.uiManager.targetId) {
                        game.currentScene.uiManager.setTargetId(0)
                        game.currentScene.uiManager.setTargetId(closestEntity)
                    }
                    c = {"x": innerWidth/2 + game.currentScene.entityManager.getEntity(closestEntity).position.x - game.currentScene.myAnimal.position._x, "y": innerHeight/2 + game.currentScene.entityManager.getEntity(closestEntity).position.y - game.currentScene.myAnimal.position._y}
                    mapeditor.dispatchEvent(new MouseEvent("pointermove", {clientX:c.x, clientY:c.y}))
                }
            }
        }
    }, 50)
}
`;
exports.script = script;
exports.name = name;
exports.description = description;