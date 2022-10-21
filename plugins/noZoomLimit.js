var name = "No zoom limit"
var description = "Zoom clamp is removed. You can zoom in or out as far as you want. "
var script = `
    setInterval(function () {
        game.viewport.clampZoom({
            minWidth: 0,
            maxWidth: 1e7,
        })
    }, 200);
`;
exports.script = script;
exports.name = name;
exports.description = description;