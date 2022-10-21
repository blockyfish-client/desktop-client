var name = "Slash command revival"
var description = "Brings back /mute and /unmute so you can mute annoying people. Works the same way as before. Also adds /settarget which can be used for multiboxing."
var script = `
mutedList = []
chat_value = ''
targetLockScriptRan = 0
targetID = 0
window.addEventListener("keyup", function(e) {
    if (e.keyCode == 13) {
        if (matches(chat_value, '/unmute ')) {
            muteID = chat_value.replace('/unmute ', '')
            if (mutedList.includes(muteID)) {
                mutedList = arrayRemove(mutedList, muteID)
            }
        }
        else if (matches(chat_value, '/mute ')) {
            muteID = chat_value.replace('/mute ', '')
            if (!mutedList.includes(muteID)) {
                mutedList.push(muteID)
            }
        }
        else if (matches(chat_value, '/settarget')) {
            targetID = parseInt(chat_value.replace('/settarget ', '').replace('/settarget', ''))
            console.log(targetID)
            game.currentScene.uiManager.setTargetId(0)
            game.currentScene.uiManager.setTargetId(targetID)
            if (game.currentScene.myAnimal != null && targetLockScriptRan == 0) {
                targetLockScriptRan = 1
                console.log('RUN_TARGET_LOCK_SCRIPT')
            }

        }
        else if (matches(chat_value, '/help')) {
            game.currentScene.showMessagePopup('/mute <id> - mute a player\\n/unmute <id> - unmute a player\\n/settarget <entityid> - lock on to an animal', 5000, 0)
        }
    }
    else {
        chat_value = document.querySelector('#app > div.overlay > div.chat-input.horizontal-center > input').value
    }
    if (e.key == '/' && document.querySelector('#app > div.modals-container > div') == null && document.querySelector('#app > div.ui > div').style.display == 'none' && document.activeElement.localName != 'input') {
        console.log('handle_slash_command')
    }
})
`;
exports.script = script;
exports.name = name;
exports.description = description;