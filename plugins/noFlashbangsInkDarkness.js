var name = "Better vision"
var description = "Removes flashbangs, ink, and darkness. These things will no longer interfere with you."
var script = `
game.currentScene.toggleFlash = function() {}
game.currentScene.terrainManager.shadow.setShadowSize(1000000)
game.currentScene.terrainManager.shadow.setShadowSize = function() {}
`;
exports.script = script;
exports.name = name;
exports.description = description;