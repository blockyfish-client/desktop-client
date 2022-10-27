var name = "Auto spin"
var description = "Spin really fast without breaking your arms. Hold Z to activate."
var script = `
mapeditor = document.querySelector('#canvas-container > canvas')
var spin_direction = 0
// const spin_coords_x = [0, 210, 300, 210, 0, -210, -300, -210]
// const spin_coords_y = [300, 210, 0, -210, -300, -210, 0, 210]
const spin_angle = [0,30,60,90,120,150,180,210,240,270,300,330,360]
const spin_radius = 300
var isSpinning = false
document.body.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() == "z") {
        if (document.querySelector('#app > div.modals-container > div') == null && document.querySelector('#app > div.ui > div').style.display == 'none' && document.activeElement.localName != 'input') {
            e.preventDefault()
            isSpinning = true
        }
    }
});
document.body.addEventListener('keyup', function(e) {
    if (e.key.toLowerCase() == "z") {
        if (document.querySelector('#app > div.modals-container > div') == null && document.querySelector('#app > div.ui > div').style.display == 'none' && document.activeElement.localName != 'input') {
            e.preventDefault()
            isSpinning = false
        }
    }
});
setInterval(() => {
    if (isSpinning) {
        let spin_coords_x = Math.round(spin_radius * Math.sin(Math.PI * 2 * spin_angle[spin_direction] / 360));
        let spin_coords_y = Math.round(spin_radius * Math.cos(Math.PI * 2 * spin_angle[spin_direction] / 360));
        mapeditor.dispatchEvent(new MouseEvent("pointermove", {clientX: innerWidth/2 + spin_coords_x, clientY: innerHeight/2 + spin_coords_y}))
        spin_direction = (spin_direction + 1) % 11
    }
}, 15)
`;
exports.script = script;
exports.name = name;
exports.description = description;