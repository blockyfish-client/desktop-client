var name = "Anti-stealth"
var description = "No more low opacity or invisible animals. These include tiger shark, barracuda, anglerfish, salamander, and many more. Also allows you to see animals that are hiding in props. "
var script = `
setInterval(function () {
    for (let i = 0; i < game.currentScene.entityManager.animalsList.length; i++) {
        if (game.currentScene.entityManager.animalsList[i].alpha < 0.5) {
            game.currentScene.entityManager.animalsList[i].alpha = 0.5
        }
        if (game.currentScene.entityManager.animalsList[i].inner.alpha < 0.5) {
            game.currentScene.entityManager.animalsList[i].inner.alpha = 0.5
        }
        if (game.currentScene.entityManager.animalsList[i].relatedObjects.visible != true) {
            game.currentScene.entityManager.animalsList[i].relatedObjects.visible = true
        }
        if (game.currentScene.entityManager.animalsList[i].nameObject.visible != true) {
            game.currentScene.entityManager.animalsList[i].nameObject.visible = true
        }
    }
})
`;
exports.script = script;
exports.name = name;
exports.description = description;