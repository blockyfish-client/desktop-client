const setupEvents = require('./installers/setupEvents')
 if (setupEvents.handleSquirrelEvent()) {
    return;
}

const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const { shell } = require("electron")
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const fetch = require('cross-fetch') // required 'fetch'
const { Client } = require("discord-rpc");

//adblock
ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
  blocker.enableBlockingInSession(session.defaultSession);
});

function matches(text, partial) {
    return text.toLowerCase().indexOf(partial.toLowerCase()) > -1;
}

//main window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        backgroundColor: '#000000',
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#1f2937',
            symbolColor: '#ffffff',
        },
        icon: path.join(__dirname, 'img/icon.png'),
    })
    
    //close confirmation dialog
    win.on('close', function(e) {
        const choice = require('electron').dialog.showMessageBoxSync(this,
          {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Exit Deeeep.io',
            message: 'Are you sure you want to quit?',
            icon: path.join(__dirname, 'img/icon.png'),
          });
        if (choice === 1) {
          e.preventDefault();
        }
    });

    win.loadURL('https://beta.deeeep.io')
    win.removeMenu();
    win.webContents.on('did-finish-load', function() {
        // win.webContents.openDevTools()
        win.webContents.setBackgroundThrottling(false)
        win.webContents.executeJavaScript(`
            // document.querySelector('head > link[href*="/assets/index"][rel="stylesheet"]').href = "https://thepiguy3141.github.io/doc-assets/images/misc/index.8b74f9b3.css"
            setInterval(function() {
                //notif badge
                if (document.querySelector('span.forum-notifications-badge') != null) {
                    console.log("notifs: " + document.querySelector('span.forum-notifications-badge').innerText)
                }
                else {
                    console.log("notifs: 0")
                }

                //rich presence status logging
                if (document.querySelector('div.home-page').style.display == 'none') {
                    console.log("state: " + document.querySelector('.selected').innerText + "2")
                }
                else {
                    console.log("state: " + document.querySelector('.selected').innerText + "0")
                }

                //homepage ui modification
                if (document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div').style.paddingRight != '150px') {
                    document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div').style.paddingRight = '150px'
                }
                if (document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.position != 'fixed') {
                    document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.position = 'fixed'
                    document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.bottom = '10px'
                    document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.left = '10px'
                    document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.width = '30vw'
                    document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.maxWidth = '300px'
                }
                if (document.querySelector('div.sidebar.left.p-2') != null) {
                    document.querySelector('div.sidebar.left.p-2').remove()
                }

                //game ui modification
                if (document.querySelector('div.game') != null) {
                    if (document.querySelector('div.flex.flex-col').style.marginTop != '40px') {
                        document.querySelector('div.flex.flex-col').style.marginTop = '40px'
                    }
                    if (document.querySelector('div.buttons.button-bar > div > button').className.match('el-button--mini') == null) {
                        if (document.querySelector('div.buttons.button-bar > div').style.position != 'absolute') {
                            document.querySelector('div.buttons.button-bar > div').style.position = 'absolute'
                            document.querySelector('div.buttons.button-bar > div').style.right = '150px'
                            document.querySelector('div.buttons.button-bar > div').style.top = '0px'
                        }
                    }
                    else {
                        if (document.querySelector('div.buttons.button-bar > div').style.position != 'absolute') {
                            document.querySelector('div.buttons.button-bar > div').style.position = 'absolute'
                            document.querySelector('div.buttons.button-bar > div').style.right = '0px'
                            document.querySelector('div.buttons.button-bar > div').style.top = '200px'
                            document.querySelector('div.side-0').style.marginTop = '25px'
                            document.querySelector('div.side-0').style.marginLeft = '20px'
                            document.querySelector('div.side-1').style.marginTop = '55px'
                        }
                    }
                    if (document.querySelector('div.info.mb-1.mr-1').style.position != 'fixed') {
                        document.querySelector('div.info.mb-1.mr-1').style.position = 'fixed'
                        document.querySelector('div.info.mb-1.mr-1').style.left = '4px'
                        document.querySelector('div.info.mb-1.mr-1').style.top = '4px'
                        document.querySelector('div.top-left').style.marginTop = '20px'
                        document.querySelector('div.latency.latency-1').style.marginLeft = '100px'
                        document.querySelector('div.latency.latency-1').style.position = 'absolute'
                    }
                }

                //remove fullscreen button
                if (document.querySelector('div.inner > button:nth-child(2) > span > svg > path').attributes[0].value == 'M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z') {
                    document.querySelector('div.inner > button:nth-child(2)').remove()
                }

                //must be last
                if (document.querySelector('div.sidebar.right > div:nth-child(3) > button > span > span').style.whiteSpace != 'pre-wrap') {
                    document.querySelector('div.sidebar.right > div:nth-child(3) > button > span > span').style.whiteSpace = 'pre-wrap'
                }
            }, 300)
            `)
            win.webContents.executeJavaScript(`
            const button_clone = document.querySelector('div.p-2.sidebar.right.space-y-2 > div.container > div > div').cloneNode(true);
            document.querySelector('div.p-2.sidebar.right.space-y-2 > div.container > div').appendChild(button_clone);
            button = button_clone.firstElementChild
            button.classList.remove("pink")
            button.classList.add("blue", "evo", "evo-close")
            const evoText = document.querySelector("button.evo > span:nth-child(1) > span:nth-child(2)")
            evoText.innerHTML = "Evo Tree"
            const evoIcon = document.querySelector("button.evo > span:nth-child(1) > svg:nth-child(1)")
            `)
            win.webContents.executeJavaScript('evoIcon.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-diagram-3-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z"/></svg>`')
            win.webContents.executeJavaScript(`
            const style = document.createElement('style')
            document.querySelector('head').appendChild(style)
            style.innerHTML = '.button{display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;text-align:center;box-sizing:border-box;outline:0;transition:.1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;-webkit-appearance:none;min-height:2.5rem;border-radius:.25rem;padding:.75rem 1.25rem;font-size:.875rem}.box-x-close{position:absolute;top:.3rem;right:.5rem}.evo-red{background-color:#ef4444;border-color:#dc2626}.evo-red:hover{background-color:#dc2626;border-color:#b91c1c}.evo-black{background-color:#6b7280;border-color:#4b5563}.evo-black:hover{background-color:#4b5563;border-color:#374151}body .evo-button{border-bottom-width:4px;border-radius:1rem}.evo-box.active{outline:white solid 2px;filter:brightness(100%)}.evo-modal{background-color:#1f2937;border:2px solid #374151;border-radius:.75rem;width:100vh}.evo-core{top:5px;right:5px;border:1px solid #fff;border-radius:25px;font-size:14px}#evo-main{flex-wrap:wrap;width:88%;margin:auto;gap:15px}.evo-hidden{opacity: 0;pointer-events: none;}#evo-modal{transition: 0.2s;}'
            const div = document.createElement('div')
            document.getElementById('app').appendChild(div)
            div.outerHTML = '<div style="z-index: 100;" class="w-screen h-screen absolute" id="evo-modal"> <div style="background-color: rgba(0,0,0,.5);" class="w-full h-full absolute"></div><div class="w-full h-full absolute flex justify-center items-center"> <div class="flex flex-col evo-modal relative"> <div style="font-size: 1.3rem" class="text-center py-2">Evo Tree</div><button class="evo-close box-x-close"><svg width="1.125em" height="1.125em" viewBox="0 0 24 24" class="svg-icon" color="gray" data-v-35f7fcad="" data-v-3140a19a="" data-v-daae3c72="" style="--sx:1; --sy:1; --r:0deg;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" data-v-35f7fcad=""></path></svg></button> <div style="flex: 1;" class="text-center"> <div class="p-4 flex" id="evo-main"></div></div><div class="text-center py-4"> <div class="button evo-button evo-black evo-close">Close</div></div></div></div></div>'
            const evoMain = document.getElementById("evo-main")
            const evoBox = document.createElement("div")
            evoMain.appendChild(evoBox)
            evoBox.outerHTML = '<img src="https://raw.githubusercontent.com/blockyfish-client/Desktop-Client/master/img/evolution_tree_themed.png">'
            const evoCloses = document.getElementsByClassName("evo-close")
            const evoModal = document.getElementById("evo-modal")
            evoModal.classList.toggle("evo-hidden")
            for (const evoClose of evoCloses) {
              evoClose.addEventListener("click", () => {
                evoModal.classList.toggle("evo-hidden")
              })
            }
            `)
            win.webContents.executeJavaScript(`
            const drag = document.createElement('div')
            document.querySelector('#app > div.ui > div').appendChild(drag)
            drag.outerHTML = '<div style="-webkit-app-region: drag;width: 100vw;height: 20px;position: absolute;top: 0;left: 0;cursor: move;"></div>'
            `)
            win.webContents.executeJavaScript(`
            document.body.addEventListener('keydown', function(e) {
                if (e.key == "Escape") {
                    if (document.querySelector('#app > div.ui > div').style.display != 'none') {
                        document.querySelector('div.el-col.el-col-8.is-guttered > button').click()
                    }
                }
            });
            `)
        win.on('blur', () => {
            win.webContents.executeJavaScript(`
            if (document.querySelector('#app > div.ui > div').classList.contains('playing') == true) {
                if (document.querySelector('#app > div.ui > div').style.display == 'none') {
                    window.dispatchEvent(new KeyboardEvent("keydown", {keyCode: 27}))
                }
            }
            `)
        });

        var old_mode = 'FFA'
        var old_menu = '0'
        var old_url = 'https://beta.deeeep.io'
        const log_level_names = { "-1": "DEBUG", "0": "INFO", "1": "WARN", "2": "ERROR" };
        win.webContents.on("console-message", (ev, level, message, line, file) => {
            var msg = `${message}`
            console.log(msg);
            if (matches(msg, "notifs:")) {
                if (msg.length < 10) {
                    const msg_num = msg.charAt(msg.length - 1);
                    if (msg_num != 0) {
                        win.setOverlayIcon(path.join(__dirname, 'img/' + msg_num + '.png'), 'Over ' + msg_num + ' notifications')
                    }
                    else {
                        win.setOverlayIcon(null, '')
                    }
                }
                else {
                    win.setOverlayIcon(path.join(__dirname, 'img/9_plus.png'), 'Over 9 notifications')
                }
            }
            if (matches(msg, "state:")) {
                var msg = msg.replace("state: ", "")
                var mode = msg.slice(0,-1)
                var menu = msg.slice(-1)
                var url = win.webContents.getURL()
                if (mode != old_mode || menu != old_menu || url != old_url) {
                    setGameMode(mode, menu)
                    old_mode = mode
                    old_menu = menu
                    old_url = url
                }
            }
        });
        win.show();
        win.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: 'deny' };
        });
        var rpc = new Client({
            transport: "ipc",
        });
        rpc.login({
            clientId: "918680181609213972"
        })
        var startTime = new Date()
        rpc.on("ready", () => {
            rpc.setActivity({
                details: "Idle",
                largeImageKey: "icon",
                largeImageText: "Deeeep.io",
                startTimestamp: startTime,
            })
        });
        function setGameMode(mode, menu) {
            var currentUrl = win.webContents.getURL()
            console.log(currentUrl)
            if (matches(currentUrl, "/u/")) {
                var detailText = 'Viewing ' + currentUrl.replace("https://beta.deeeep.io/u/", "") + "'s profile"
                var labelText = ''
            }
            else if (matches(currentUrl, "/forum/")) {
                var detailText = "Visiting the forums"
                var labelText = ''
            }
            else if (matches(currentUrl, "/store/")) {
                var detailText = "Browsing through the store"
                var labelText = ''
            }
            else if (matches(currentUrl, "/inventory/")) {
                var detailText = "Checking inventory"
                var labelText = ''
            }
            else if (menu == '0') {
                var detailText = 'In the menus'
                var labelText = ''
            }
            else {
                var detailText = "Playing " + mode
                var labelText = 'Join game'
            }
            if (labelText != '') {
                rpc.setActivity({
                    details: detailText,
                    largeImageKey: "icon",
                    largeImageText: "Deeeep.io",
                    startTimestamp: startTime,
                    buttons: [
                        { label: labelText, url: currentUrl }
                    ]
                })
            }
            else {
                rpc.setActivity({
                    details: detailText,
                    largeImageKey: "icon",
                    largeImageText: "Deeeep.io",
                    startTimestamp: startTime,
                })
            }
        }
    });
}

app.whenReady().then(async () => {

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})