var name = "X-ray vision"
var description = "See through terrain and ceilings. "
var script = `
game.currentScene.foodGlowContainer.zOrder = 996
game.currentScene.foodContainer.zOrder = 997
game.currentScene.namesLayer.zOrder = 998
game.currentScene.animalsContainer.zOrder = 999
game.currentScene.barsLayer.zOrder = 1000
game.currentScene.chatContainer.zOrder = 1001
setInterval(function () {
    game.currentScene.ceilingsContainer.alpha = 0.3
}, 200);
`;
exports.script = script;
exports.name = name;
exports.description = description;