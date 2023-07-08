var name = "Quick disconnect";
var description = "Press Ctrl + Shift + Q to disconnect from any server.";
var script = `
document.body.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() == "q") {
        game.inputManager.socketManager.disconnect();
    }
})
`;
exports.script = script;
exports.name = name;
exports.description = description;
