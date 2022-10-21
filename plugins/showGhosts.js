var name = "I see dead fish"
var description = "Show all ghosts. This is the only way to see ghosts without becoming a ghost. Saying \\\"I see dead fish\\\" no longer works."
var script = `
game.currentScene.viewingGhosts = true
`;
exports.script = script;
exports.name = name;
exports.description = description;