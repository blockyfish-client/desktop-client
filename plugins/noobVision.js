var name = "Noob vision";
var description = "Adds a red tint to animals of a higher tier and a green tint to animals of a lower tier. Original idea by SirReadsALot. ";
var script = `
tier0 = [18, 33, 44, 47, 52, 77, 88, 118]
tier1 = [0, 13, 16, 78, 54]
tier2 = [1, 17, 26, 79, 92]
tier3 = [2, 36, 59, 85, 89]
tier4 = [3, 50, 51, 62, 63, 75, 105]
tier5 = [4, 53, 55, 60, 76, 110, 116]
tier6 = [5, 27, 64, 65, 69, 80, 93, 95, 114, 115]
tier7 = [6, 7, 14, 41, 49, 94, 97]
tier8 = [21, 39, 56, 58, 70, 96]
tier9 = [8, 9, 15, 19, 20, 23, 35, 38, 43, 57, 72, 74, 81, 99, 109, 117]
tier10 = [10, 11, 12, 22, 24, 25, 28, 29, 30, 31, 32, 34, 37, 40, 42, 45, 46, 48, 61, 66, 67, 68, 71, 73, 82, 83, 84, 86, 87, 90, 91, 98, 100, 101, 102, 103, 104, 106, 107, 108, 111, 112, 113, 119, 120]
setInterval(function () {
    if (tier1.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 1
    } else if (tier2.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 2
    } else if (tier3.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 3
    } else if (tier4.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 4
    } else if (tier5.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 5
    } else if (tier6.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 6
    } else if (tier7.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 7
    } else if (tier8.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 8
    } else if (tier9.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 9
    } else if (tier10.includes(game.currentScene.myAnimal.fishLevelData.fishLevel)) {
        myAnimalTier = 10
    }
    for (let i = 0; i < game.currentScene.entityManager.animalsList.length; i++) {
        let animalID = game.currentScene.entityManager.animalsList[i].fishLevelData.fishLevel
        if (tier0.includes(animalID)) {
            animalTier = 0
        } else if (tier1.includes(animalID)) {
            animalTier = 1
        } else if (tier2.includes(animalID)) {
            animalTier = 2
        } else if (tier3.includes(animalID)) {
            animalTier = 3
        } else if (tier4.includes(animalID)) {
            animalTier = 4
        } else if (tier5.includes(animalID)) {
            animalTier = 5
        } else if (tier6.includes(animalID)) {
            animalTier = 6
        } else if (tier7.includes(animalID)) {
            animalTier = 7
        } else if (tier8.includes(animalID)) {
            animalTier = 8
        } else if (tier9.includes(animalID)) {
            animalTier = 9
        } else if (tier10.includes(animalID)) {
            animalTier = 10
        }
        if (!game.currentScene.entityManager.animalsList[i].mine) {
            if (animalTier < myAnimalTier) {
                game.currentScene.entityManager.animalsList[i].inner.children[0]._tint = 65280
                game.currentScene.entityManager.animalsList[i].inner.children[0]._tintRGB = 65280
            } else {
                game.currentScene.entityManager.animalsList[i].inner.children[0]._tint = 16711680
                game.currentScene.entityManager.animalsList[i].inner.children[0]._tintRGB = 16711680
            }
        }
    }
}, 200);
`;
exports.script = script;
exports.name = name;
exports.description = description;
