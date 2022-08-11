// checks if the app is being run as an installer
const setupEvents = require('./installers/setupEvents')
 if (setupEvents.handleSquirrelEvent()) {
    return;
}

// import stuff that makes client go brrrr
const { app, BrowserWindow, globalShortcut } = require('electron')
const electronDl = require('electron-dl')
const path = require('path')
const { shell } = require("electron")
const { Client } = require("discord-rpc")
const child = require('child_process').execFile
const fs = require('fs') // Load the File System to execute our common tasks (CRUD)
const { ElectronChromeExtensions } = require('electron-chrome-extensions')
const Store = require('electron-store');

// for the future, secret for now :)
app.setAsDefaultProtocolClient("deeeepio")

// version info
const version_code = 'v1.3.1'
const version_num = '131'

// custom function for later
function matches(text, partial) {
    return text.toLowerCase().indexOf(partial.toLowerCase()) > -1;
}

// emulate a keystroke
function sendKeybinding(win, keyCode) {
    win.webContents.sendInputEvent({ type: 'keyDown', keyCode });
    win.webContents.sendInputEvent({ type: 'char', keyCode });
    win.webContents.sendInputEvent({ type: 'keyUp', keyCode });
}

// delete update installer, doesn't delete manually downloaded installer
// unless the user is stupid or smart enough to rename it to the name here
let downloadPath = app.getPath('downloads')
if (fs.existsSync(downloadPath + "\\blockyfishclient-update-download.exe")) {
    fs.unlink(downloadPath + "\\blockyfishclient-update-download.exe", (err) => {
        if (err) {
            alert("An error ocurred updating the file" + err.message);
            console.log(err);
            return;
        }
        console.log("File succesfully deleted");
    });
}

// import settings for stuff
const store = new Store();
var docassets = store.get('docassets')
var ublock = store.get('ublock')
var twemoji = store.get('twemoji')
var qc1 = store.get('quick_chat.1')
var qc2 = store.get('quick_chat.2')
var qc3 = store.get('quick_chat.3')
var qc4 = store.get('quick_chat.4')
if (qc1 == undefined) {
    store.set("quick_chat.1", "gg")
    qc1 = "gg"
}
if (qc2 == undefined) {
    store.set("quick_chat.2", "lol")
    qc2 = "lol"
}
if (qc3 == undefined) {
    store.set("quick_chat.3", "thank you")
    qc3 = "thank you"
}
if (qc4 == undefined) {
    store.set("quick_chat.4", "ow!")
    qc4 = "ow!"
}

//main window
app.whenReady().then(async () => {
const createWindow = () => {
    const win = new BrowserWindow({
        // load window settings
        width: store.get('window.width'),
        height: store.get('window.height'),
        x: store.get('window.x'),
        y: store.get('window.y'),

        // background
        backgroundColor: '#1f2937',

        // dont show before webpage has loaded
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },

        // the overlay you see on top-right
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#1f2937',
            symbolColor: '#ffffff',
        },

        // icon lol
        icon: path.join(__dirname, 'img/icon.png'),
    })

    // set extension paths
    const extensions = new ElectronChromeExtensions()
    extensions.addTab(win.webContents, win)
    if (docassets == true) {
        docassetsPath = app.getAppPath() + `\\extensions\\docassets\\1.0.42_0`
    }
    else {
        docassetsPath = app.getAppPath() + `\\extensions\\docassets_disabled\\1.0.42_0`
    }
    if (ublock == true) {
        ublockPath = app.getAppPath() + `\\extensions\\ublock\\1.43.0_0`
    }
    else {
        if (docassets == true) {
            ublockPath = app.getAppPath() + `\\extensions\\docassets\\1.0.42_0`
        }
        else {
            ublockPath = app.getAppPath() + `\\extensions\\docassets_disabled\\1.0.42_0`
        }    
    }

    // load the extensions in
    win.webContents.session.loadExtension(docassetsPath).then(() => {
        win.webContents.session.loadExtension(ublockPath).then(() => {
        
            // close confirmation dialog
            win.on('close', function(e) {
                const choice = require('electron').dialog.showMessageBoxSync(this,
                {
                    type: 'question',
                    buttons: ['Yes', 'No'],
                    title: 'Exit Deeeep.io',
                    message: 'Are you sure you want to quit?',
                    icon: path.join(__dirname, 'img/icon.png'),
                });

                // if user click "no"
                if (choice === 1) {
                  e.preventDefault();
                }

                // if user click "yes" 😢
                else {
                    // dont save settings if window is maximized because we dont want the app to start back in full screen
                    if (win.isMaximized() == false) {
                        store.set("window.width", win.getSize()[0])
                        store.set("window.height", win.getSize()[1])
                        store.set("window.x",  win.getPosition()[0])
                        store.set("window.y", win.getPosition()[1])
                    }
                    store.set("quick_chat.1", qc1)
                    store.set("quick_chat.2", qc2)
                    store.set("quick_chat.3", qc3)
                    store.set("quick_chat.4", qc4)
                }
            });

            // ctrl r for reload, debugging purposes, should not be needed
            // globalShortcut.register('CommandOrControl+R', () => {
            //     win.reload()
            // })

            // load the website
            win.loadURL('https://beta.deeeep.io')

            // bye-bye stinky electron menu bar (no one likes you anyways)
            win.removeMenu();

            //wait for the base webpage to finish loading before customizing it
            win.webContents.on('did-finish-load', function() {

                win.webContents.openDevTools()

                // keep everything running otherwise youll see a stack of 500 chat messages when you come back
                win.webContents.setBackgroundThrottling(false)
                //twemoji
                if (twemoji) {
                    win.webContents.executeJavaScript(`
                    //css
                    const twe_style = document.createElement('style')
                    document.querySelector('head').appendChild(twe_style)
                    twe_style.innerHTML = '@font-face { font-family: emoji; font-weight: normal; src: url(//xem.github.io/unicode13/Twemoji.ttf) } html{font-family: Quicksand,emoji} @font-face { font-family: emoji; font-weight: bold; src: url(//xem.github.io/unicode13/Twemoji.ttf) } html{font-family: Quicksand,emoji}'
                    `)
                }

                //custom cursor
                win.webContents.executeJavaScript(`
                    //css
                    const cursor_style = document.createElement('style')
                    document.querySelector('head').appendChild(cursor_style)
                    cursor_style.innerHTML = 'a,body,button,img,input,textarea,li,div,tr,td,label,span{cursor:none!important}.mouse-cursor{position:fixed;left:0;top:0;pointer-events:none;border-radius:50%;-webkit-transform:translateZ(0);transform:translateZ(0);visibility:hidden;display:block}.cursor-inner{margin-left:-3px;margin-top:-3px;width:6px;height:6px;z-index:10000001;background-color:#ced0d4;-webkit-transition:width .3s ease-in-out,height .3s ease-in-out,margin .3s ease-in-out,opacity .3s ease-in-out;transition:width .3s ease-in-out,height .3s ease-in-out,margin .3s ease-in-out,opacity .3s ease-in-out;filter:drop-shadow(0 0 2px white)}.cursor-inner.cursor-hover{margin-left:-4px;margin-top:-4px;width:8px;height:8px;background-color:#ced0d4}.cursor-outer{margin-left:-15px;margin-top:-15px;width:30px;height:30px;border:2px solid #ced0d4;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:10000000;opacity:.7;-webkit-transition:width .3s ease-in-out,height .3s ease-in-out,margin .3s ease-in-out,opacity .3s ease-in-out;transition:width .3s ease-in-out,height .3s ease-in-out,margin .3s ease-in-out,opacity .3s ease-in-out;filter:drop-shadow(0 0 3px black)}.cursor-outer.cursor-hover{margin-left:-25px;margin-top:-25px;width:50px;height:50px;opacity:.3}.cursor-hide{display:none!important}'
                    //dot
                    const cursor_inner = document.createElement('div')
                    document.body.appendChild(cursor_inner)
                    cursor_inner.outerHTML = '<div id="cursor-inner" class="mouse-cursor cursor-inner" style="visibility: visible; transform: translate(0px, 0px);"></div>'
                    const mouse_inner = document.getElementById('cursor-inner')
                    //circle
                    const cursor_outer = document.createElement('div')
                    document.body.appendChild(cursor_outer)
                    cursor_outer.outerHTML = '<div id="cursor-outer" class="mouse-cursor cursor-outer" style="visibility: visible; transform: translate(0px, 0px);"></div>'
                    const mouse_outer = document.getElementById('cursor-outer')
                    //effects
                    document.addEventListener('mousemove', (event) => {
                        mouse_inner.style.transform = 'translate(' + event.clientX + 'px, ' + event.clientY + 'px)'
                        mouse_outer.style.transform = 'translate(' + event.clientX + 'px, ' + event.clientY + 'px)'
                        // console.log(event.clientX + ', ' + event.clientY)
                        if (document.querySelector('button:hover') != null || document.querySelector('a:hover') != null || document.querySelector('input:hover') != null || document.querySelector('textarea:hover') != null || document.querySelector('img:hover') != null) {
                            mouse_inner.classList.add('cursor-hover')
                            mouse_outer.classList.add('cursor-hover')
                        }
                        else {
                            mouse_inner.classList.remove('cursor-hover')
                            mouse_outer.classList.remove('cursor-hover')
                        }
                    });
                    document.addEventListener('mouseleave', () => {
                        mouse_inner.classList.add('cursor-hide')
                        mouse_outer.classList.add('cursor-hide')
                    })
                    document.addEventListener('mouseenter', () => {
                        mouse_inner.classList.remove('cursor-hide')
                        mouse_outer.classList.remove('cursor-hide')
                    })
                `)
                //<div style="width: 100%;height: 100%;position: absolute;z-index: 9999;pointer-events: none;display: flex;"><img draggable="false" src="https://raw.githubusercontent.com/blockyfish-client/Assets/main/evo_circle.png" style="max-width: 80vw;max-height: 80vh;align-self: center;margin: auto;"></div>
                // win.webContents.executeJavaScript(`
                // const evo_wheel = document.createElement('div')
                // document.querySelector('div.game').insertBefore(evo_wheel, document.querySelector('div.game').children[0])
                // evo_wheel.outerHTML = '<div style="width: 100%;height: 100%;position: absolute;z-index: 9999;pointer-events: none;display: flex;"><img id="evo-wheel" draggable="false" src="https://raw.githubusercontent.com/blockyfish-client/Assets/main/evo_circle.png" style="max-width: 80vw;max-height: 80vh;align-self: center;margin: auto;"></div>'
                // `)


                //state checks and UI adjustments
                win.webContents.executeJavaScript(`
                    // document.querySelector('head > link[href*="/assets/index"][rel="stylesheet"]').href = "https://thepiguy3141.github.io/doc-assets/images/misc/index.8b74f9b3.css"
                    notif_count_old = 0
                    console.log("state: FFA0")
                    setInterval(function() {
                        //notif badge
                        if (document.querySelector('span.forum-notifications-badge') != null) {
                            notif_count = document.querySelector('span.forum-notifications-badge').innerText
                        }
                        else {
                            notif_count = 0
                        }
                        if (notif_count != notif_count_old) {
                            console.log("notifs: " + notif_count)
                            notif_count_old = notif_count
                        }
                    
                        //rich presence status logging
                        if (document.querySelector('div.home-page').style.display == 'none') {
                            rpc_state = document.querySelector('.selected').innerText + "2"
                        }
                        else {
                            rpc_state = document.querySelector('.selected').innerText + "0"
                        }
                        console.log("state: " + rpc_state)
                    
                        //HOMEPAGE UI MOD
                        //making everything undraggable
                        const images = document.querySelectorAll("img")
                        for (const image of images) {
                            image.draggable = false
                        }
                        const links = document.querySelectorAll("a")
                        for (const link of links) {
                            link.draggable = false
                        }
                        if (document.querySelector('#app > div.ui > div > div.first > div > div > div > div.play-game > div.relative > div > div > input').maxLength != 22) {
                            document.querySelector('#app > div.ui > div > div.first > div > div > div > div.play-game > div.relative > div > div > input').maxLength = 22
                        }
                        //changing layouts according to fullscreen
                        if (document.fullscreenElement) {
                            if (document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div').style.paddingRight != '') {
                                document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div').style.paddingRight = ''
                            }
                        }
                        else {
                            if (document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div').style.paddingRight != '150px') {
                                document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div').style.paddingRight = '150px'
                            }
                        }
                        if (document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.position != 'fixed') {
                            document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.position = 'fixed'
                            document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.bottom = '10px'
                            document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.left = '10px'
                            document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.width = '30vw'
                            document.querySelector('div.el-button-group.nice-btn-group.block.mt-2').style.maxWidth = '300px'
                        }
                        if (document.querySelector('div.sidebar.left.p-2 > a').style.opacity != '0') {
                            document.querySelector('div.sidebar.left.p-2 > a').style.opacity = '0'
                            document.querySelector('div.sidebar.left.p-2 > a').style.pointerEvents = 'none'
                        }
                    
                        //GAME UI MOD
                        if (document.querySelector('div.game') != null) {
                            if (document.fullscreenElement) {
                                if (document.querySelector('div.flex.flex-col').style.marginTop != '') {
                                    document.querySelector('div.flex.flex-col').style.marginTop = ''
                                }
                                if (document.querySelector('div.buttons.button-bar > div > button').className.match('el-button--mini') == null) {
                                    if (document.querySelector('div.buttons.button-bar > div').style.position != '') {
                                        document.querySelector('div.buttons.button-bar > div').style.position = ''
                                        document.querySelector('div.buttons.button-bar > div').style.right = ''
                                        document.querySelector('div.buttons.button-bar > div').style.top = ''
                                    }
                                }
                                else {
                                    if (document.querySelector('div.buttons.button-bar > div').style.position != '') {
                                        document.querySelector('div.buttons.button-bar > div').style.position = ''
                                        document.querySelector('div.buttons.button-bar > div').style.right = ''
                                        document.querySelector('div.buttons.button-bar > div').style.top = ''
                                        document.querySelector('div.side-0').style.marginTop = ''
                                        document.querySelector('div.side-0').style.marginLeft = ''
                                        document.querySelector('div.side-1').style.marginTop = ''
                                    }
                                }
                                if (document.querySelector('div.info.mb-1.mr-1').style.position != '') {
                                    document.querySelector('div.info.mb-1.mr-1').style.position = ''
                                    document.querySelector('div.info.mb-1.mr-1').style.left = ''
                                    document.querySelector('div.info.mb-1.mr-1').style.top = ''
                                    document.querySelector('div.top-left').style.marginTop = ''
                                    document.querySelector('div.latency.latency-1').style.marginLeft = ''
                                    document.querySelector('div.latency.latency-1').style.position = ''
                                }
                            }
                            else {
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
                        }
                        //must be last
                        if (document.querySelector('div.sidebar.right > div:nth-child(3) > button > span > span') != null) {
                            if (document.querySelector('div.sidebar.right > div:nth-child(3) > button > span > span').style.whiteSpace != 'pre-wrap') {
                                document.querySelector('div.sidebar.right > div:nth-child(3) > button > span > span').style.whiteSpace = 'pre-wrap'
                            }
                        }
                    }, 1000)
                    `)

                    //build evo button
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

                    //change evo icon
                    win.webContents.executeJavaScript('evoIcon.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-diagram-3-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1z"/></svg>`')
                    
                    //build evo modal
                    win.webContents.executeJavaScript(`
                    const style = document.createElement('style')
                    document.querySelector('head').appendChild(style)
                    style.innerHTML = '.button{display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;text-align:center;box-sizing:border-box;outline:0;transition:.1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;-webkit-appearance:none;min-height:2.5rem;border-radius:.25rem;padding:.75rem 1.25rem;font-size:.875rem}.box-x-close{position:absolute;top:.3rem;right:.5rem}.evo-red{background-color:#ef4444;border-color:#dc2626}.evo-red:hover{background-color:#dc2626;border-color:#b91c1c}.evo-black{background-color:#6b7280;border-color:#4b5563}.evo-black:hover{background-color:#4b5563;border-color:#374151}body .evo-button{border-bottom-width:4px;border-radius:1rem}.evo-box.active{outline:white solid 2px;filter:brightness(100%)}.evo-modal{background-color:#1f2937;border:2px solid #374151;border-radius:.75rem;width:100vh}.evo-core{top:5px;right:5px;border:1px solid #fff;border-radius:25px;font-size:14px}#evo-main{flex-wrap:wrap;width:88%;margin:auto;gap:15px}.evo-hidden{opacity: 0;pointer-events: none;}#evo-modal{transition: 0.2s opacity;}'
                    const div = document.createElement('div')
                    document.getElementById('app').appendChild(div)
                    div.outerHTML = '<div style="z-index: 100;" class="w-screen h-screen absolute" id="evo-modal"> <div style="background-color: rgba(0,0,0,.5);" class="w-full h-full absolute"></div><div class="w-full h-full absolute flex justify-center items-center"> <div class="flex flex-col evo-modal relative"> <div style="font-size: 1.3rem" class="text-center py-2">Evo Tree</div><button class="evo-close box-x-close"><svg width="1.125em" height="1.125em" viewBox="0 0 24 24" class="svg-icon" color="gray" style="--sx:1; --sy:1; --r:0deg;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"></path></svg></button> <div style="flex: 1;" class="text-center"> <div class="p-4 flex" id="evo-main"></div></div><div class="text-center py-4"> <div class="button evo-button evo-black evo-close">Close</div></div></div></div></div>'
                    const evoMain = document.getElementById("evo-main")
                    const evoBox = document.createElement("div")
                    evoMain.appendChild(evoBox)
                    evoBox.outerHTML = '<img draggable="false" src="https://raw.githubusercontent.com/blockyfish-client/Desktop-Client/master/img/evolution_tree_themed.png">'
                    const evoCloses = document.getElementsByClassName("evo-close")
                    const evoModal = document.getElementById("evo-modal")
                    evoModal.classList.toggle("evo-hidden")
                    for (const evoClose of evoCloses) {
                      evoClose.addEventListener("click", () => {
                        evoModal.classList.toggle("evo-hidden")
                      })
                    }
                    `)

                    // build asset swapper modal
                    win.webContents.executeJavaScript(`
                    const aswp_style = document.createElement('style')
                    document.querySelector('head').appendChild(aswp_style)
                    aswp_style.innerHTML = '.button{display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;text-align:center;box-sizing:border-box;outline:0;transition:.1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;-webkit-appearance:none;min-height:2.5rem;border-radius:.25rem;padding:.75rem 1.25rem;font-size:.875rem}.box-x-close{position:absolute;top:.3rem;right:.5rem}body .aswp-button{border-bottom-width:4px;border-radius:1rem}.aswp-gre{background-color:#ef4444;border-color:#dc2626}.aswp-gre:hover{background-color:#dc2626;border-color:#b91c1c}.aswp-black{background-color:#6b7280;border-color:#4b5563}.aswp-black:hover{background-color:#4b5563;border-color:#374151}.aswp-box.active{outline:white solid 1px;filter:brightness(100%)}.aswp-modal{background-color:#1f2937;border:2px solid #374151;border-radius:.75rem;width:300px;height:200px}.aswp-core{top:5px;right:5px;border:1px solid #fff;border-radius:25px;font-size:14px}#aswp-main{flex-wrap:wrap;width:88%;height:100%;margin:auto;gap:15px}.aswp-hidden{opacity:0;pointer-events:none}#aswp-modal{transition:opacity .2s}'
                    const aswp_div = document.createElement('div')
                    document.getElementById('app').appendChild(aswp_div)
                    aswp_div.outerHTML = '<div style="z-index: 100;" class="w-screen h-screen absolute" id="aswp-modal"> <div style="background-color: rgba(0,0,0,.5);" class="w-full h-full absolute"></div><div class="w-full h-full absolute flex justify-center items-center"> <div class="flex flex-col aswp-modal relative"> <div style="font-size: 1.3rem" class="text-center py-2">Asset Swapper</div><button class="aswp-close box-x-close"><svg width="1.125em" height="1.125em" viewBox="0 0 24 24" class="svg-icon" color="gray" style="--sx:1; --sy:1; --r:0deg;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"></path></svg></button> <div style="flex: 1;" class="text-center"> <div class="p-4 flex" id="aswp-main"></div></div><div class="text-center py-4"> <div class="button aswp-button aswp-black aswp-close">Ok</div></div></div></div></div>'
                    const aswpMain = document.getElementById("aswp-main")
                    const aswpBox = document.createElement("div")
                    aswpMain.appendChild(aswpBox)
                    aswpBox.outerHTML = '<input id="aswp-input" style="padding: 5px;border-radius: 5px;height: 35px;background-color: #0003;margin: auto;text-align: center;" placeholder="Input skin ID">'
                    const aswpCloses = document.getElementsByClassName("aswp-close")
                    const aswpModal = document.getElementById("aswp-modal")
                    aswpModal.classList.toggle("aswp-hidden")
                    function toggleAswp() {
                        aswpModal.classList.toggle("aswp-hidden")
                    }
                    document.getElementById('aswp-input').addEventListener("input", () => {
                        game.currentScene.myAnimal.setSkin(document.getElementById('aswp-input').value)
                    })
                    for (const aswpClose of aswpCloses) {
                        aswpClose.addEventListener("click", () => {
                            toggleAswp()
                        })
                    }
                    `)

                    // css for quick chat
                    win.webContents.executeJavaScript(`
                    const qc_style = document.createElement('style')
                    document.querySelector('head').appendChild(qc_style)
                    qc_style.innerHTML = '#quick-chat-container{width:600px;min-height:360px;display:flex;flex-direction:column;position:absolute}.quick-chat.row{display:flex;flex-direction:row;height:100px}.quick-chat.one{justify-content:center}.quick-chat.two{justify-content:space-between}.quick-chat>div{width:180px;height:100px;background-color:#0006;border-radius:10px;display:flex;padding:5px;opacity:.8}.quick-chat>div:hover{opacity:1;box-shadow:0 0 .5rem rgb(255 255 255 / 50%)}.quick-chat>div>p{text-align:center;width:100%;margin:auto;color:#fff;overflow-wrap:break-word}'
                    `)

                    //build titlebar to drag window around
                    win.webContents.executeJavaScript(`
                    const drag = document.createElement('div')
                    document.querySelector('#app > div.ui > div').appendChild(drag)
                    drag.outerHTML = '<div style="-webkit-app-region: drag;width: 100vw;height: 20px;position: absolute;top: 0;left: 0;cursor: move;"></div>'
                    `)

                    //website and github button on top right menu
                    win.webContents.executeJavaScript(`
                    const discord = document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div > div:nth-child(5) > button')
                    const github_parent = document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div > div:nth-child(5)').cloneNode(true)
                    const website_parent = document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div > div:nth-child(5)').cloneNode(true)
                    discord.classList.remove("black")
                    discord.classList.add("indigo")
                    const social_class = document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div')
                    social_class.insertBefore(github_parent, social_class.children[5])
                    social_class.insertBefore(website_parent, social_class.children[6])
                    github_parent.classList.add('github-div')
                    website_parent.classList.add('website-div')
                    const github = document.querySelector('div.github-div > button')
                    const website = document.querySelector('div.website-div > button')
                    const github_logo = document.querySelector('div.github-div > button > span > svg')
                    const website_logo = document.querySelector('div.website-div > button > span > svg')
                    github_logo.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>'
                    website_logo.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/></svg>'
                    github.addEventListener("click", () => {
                        window.open('https://github.com/blockyfish-client/Desktop-Client')
                    })
                    website.classList.remove("black")
                    website.classList.add("pink")
                    website.addEventListener("click", () => {
                        window.open('https://blockyfish.netlify.app')
                    })
                    `)

                    //build updater button
                    win.webContents.executeJavaScript(`
                    //updater button
                    const update_parent = document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div > div:nth-child(5)').cloneNode(true);
                    social_class.appendChild(update_parent);
                    update_parent.classList.add('update-div')
                    const update = document.querySelector('div.update-div > button')
                    const update_logo = document.querySelector('div.update-div > button > span > svg')
                    update.classList.remove("indigo")
                    update.classList.add("green", "update", "updater-close")
                    update_logo.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>'
                    const update_notif_div = document.createElement('div')
                    update.appendChild(update_notif_div)
                    update_notif_div.outerHTML = '<div id="update-notif" style="width: 10px;height: 10px;position: absolute;background: #f00;right: -1px;bottom: -4px;border-radius: 10px; display:none;"></div>'
                    `)

                    //fetch settings
                    win.webContents.executeJavaScript(`docassets_on = ` + docassets)
                    win.webContents.executeJavaScript(`ublock_on = ` + ublock)
                    win.webContents.executeJavaScript(`twemoji_on = ` + twemoji)
                    
                    //build custom settings item
                    win.webContents.executeJavaScript(`
                    //detect modal changes
                    var observer = new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            if (mutation.addedNodes.length > 0) {
                                mutation.addedNodes.forEach(function (addednode) {
                                        console.log("Modal Added:" + addednode);
                                });
                            }else if (mutation.removedNodes.length > 0) {
                                mutation.removedNodes.forEach(function (removednode) {
                                    console.log("Modal Removed:" + removednode)
                                });
                            }
                        });
                    });
                        
                    observer.observe(document.querySelector('#app > div.modals-container'), {
                        childList: true, 
                    });

                    //define function for building custom items
                    function buildCustomSettingsItems(qc1, qc2, qc3, qc4) {
                        if (document.getElementById('pane-0') != null) {
                            //restart tooltip
                            var modal_parent = document.querySelector('#app > div.modals-container > div > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div')
                            var restart_tooltip = document.querySelector('#pane-2 > form > p.help-note').cloneNode(true)
                            modal_parent.insertBefore(restart_tooltip, modal_parent.children[2])
                            restart_tooltip.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="10" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"></path><path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"></path></svg> Changes will take effect the next time you launch blockyfish client'
                            restart_tooltip.style.alignSelf = 'center'
                            restart_tooltip.style.color = '#f77'
                            restart_tooltip.style.display = 'none'
    
                            //docassets
                            var docassets_div = document.querySelector('#pane-0 > form > div:nth-child(3)').cloneNode(true)
                            document.querySelector('#pane-0 > form').appendChild(docassets_div)
                            const docassets_text = document.querySelector('#pane-0 > form > div:nth-child(4) > div.el-form-item__label')
                            docassets_text.innerText = 'Doc-assets'
                            const docassets_desc = document.querySelector('#pane-0 > form > div:nth-child(4) > div.el-form-item__content > span')
                            docassets_desc.innerText = 'Cute asset pack made by Doctorpus'
                            if (docassets_on == false) {
                                document.querySelector('#pane-0 > form > div:nth-child(4) > div.el-form-item__content > label > span.el-checkbox__input').classList.remove('is-checked')
                            }
                            else {
                                document.querySelector('#pane-0 > form > div:nth-child(4) > div.el-form-item__content > label > span.el-checkbox__input').classList.add('is-checked')
                            }
                            document.querySelector('#pane-0 > form > div:nth-child(4) > div.el-form-item__content > label > span.el-checkbox__input > input').addEventListener("click", () => {
                                restart_tooltip.style.display = 'block'
                                if (docassets_on == true) {
                                    document.querySelector('#pane-0 > form > div:nth-child(4) > div.el-form-item__content > label > span.el-checkbox__input').classList.remove('is-checked')
                                    console.log('store_settings: docassets0')
                                    docassets_on = false
                                }
                                else {
                                    document.querySelector('#pane-0 > form > div:nth-child(4) > div.el-form-item__content > label > span.el-checkbox__input').classList.add('is-checked')
                                    console.log('store_settings: docassets1')
                                    docassets_on = true
                                }
                            })
    
                            //twemoji
                            var twemoji_div = document.querySelector('#pane-0 > form > div:nth-child(3)').cloneNode(true)
                            document.querySelector('#pane-0 > form').appendChild(twemoji_div)
                            const twemoji_text = document.querySelector('#pane-0 > form > div:nth-child(5) > div.el-form-item__label')
                            twemoji_text.innerText = 'Twemoji'
                            const twemoji_desc = document.querySelector('#pane-0 > form > div:nth-child(5) > div.el-form-item__content > span')
                            twemoji_desc.innerHTML = "Emojis used in Discord and Twitter<br>Doesn't work in-game"
                            if (twemoji_on == false) {
                                document.querySelector('#pane-0 > form > div:nth-child(5) > div.el-form-item__content > label > span.el-checkbox__input').classList.remove('is-checked')
                            }
                            else {document.querySelector('#pane-0 > form > div:nth-child(5) > div.el-form-item__content > label > span.el-checkbox__input').classList.add('is-checked')
    
                            }
                            document.querySelector('#pane-0 > form > div:nth-child(5) > div.el-form-item__content > label > span.el-checkbox__input > input').addEventListener("click", () => {
                                restart_tooltip.style.display = 'block'
                                if (twemoji_on == true) {
                                    document.querySelector('#pane-0 > form > div:nth-child(5) > div.el-form-item__content > label > span.el-checkbox__input').classList.remove('is-checked')
                                    console.log('store_settings: twemoji0')
                                    twemoji_on = false
                                }
                                else {
                                    document.querySelector('#pane-0 > form > div:nth-child(5) > div.el-form-item__content > label > span.el-checkbox__input').classList.add('is-checked')
                                    console.log('store_settings: twemoji1')
                                    twemoji_on = true
                                }
                            })
                            
                            //ublock
                            var ublock_div = document.querySelector('#pane-0 > form > div:nth-child(3)').cloneNode(true)
                            document.querySelector('#pane-2 > form').appendChild(ublock_div)
                            const ublock_text = document.querySelector('#pane-2 > form > div:nth-child(3) > div.el-form-item__label')
                            ublock_text.innerText = 'Adblock'
                            const ublock_desc = document.querySelector('#pane-2 > form > div:nth-child(3) > div.el-form-item__content > span')
                            ublock_desc.innerText = 'Shows ads and support fede'
                            if (ublock_on == false) {
                                document.querySelector('#pane-2 > form > div:nth-child(3) > div.el-form-item__content > label > span.el-checkbox__input').classList.remove('is-checked')
                            }
                            else {
                                document.querySelector('#pane-2 > form > div:nth-child(3) > div.el-form-item__content > label > span.el-checkbox__input').classList.add('is-checked')
                            }
                            document.querySelector('#pane-2 > form > div:nth-child(3) > div.el-form-item__content > label > span.el-checkbox__input > input').addEventListener("click", () => {
                                restart_tooltip.style.display = 'block'
                                if (ublock_on == true) {
                                    document.querySelector('#pane-2 > form > div:nth-child(3) > div.el-form-item__content > label > span.el-checkbox__input').classList.remove('is-checked')
                                    console.log('store_settings: ublock0')
                                    ublock_on = false
                                }
                                else {
                                    document.querySelector('#pane-2 > form > div:nth-child(3) > div.el-form-item__content > label > span.el-checkbox__input').classList.add('is-checked')
                                    console.log('store_settings: ublock1')
                                    ublock_on = true
                                }
                            })
    
                            //version info
                            var settings_version = document.querySelector('#pane-2 > form > p.help-note').cloneNode(true)
                            modal_parent.appendChild(settings_version)
                            settings_version.innerHTML = 'Deeeep.io ' + document.querySelector("#app > div.ui > div > div.first > div > div > div > div.play-game > div.relative > span").innerText + '<br>Blockyfish client ` + version_code + `'
                            settings_version.style.position = 'absolute'
                            settings_version.style.bottom = '10px'
                            settings_version.style.left = '10px'
    
                            //settings panel sizing
                            var settings_modal = document.querySelector('#app > div.modals-container > div > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div')
                            settings_modal.style.width = '80vw'
                            settings_modal.style.maxWidth = '500px'
    
                            // quick chat messages
                            var qc_settings_main = document.createElement('div')
                            document.querySelector('#pane-1 > form').appendChild(qc_settings_main)
                            qc_settings_main.outerHTML = '<div class="el-form-item"><label class="el-form-item__label">Quick chat #1</label><input maxlength="60" class="el-input__wrapper" autocomplete="off" tabindex="0" placeholder="Enter a message" id="qc-msg-1" value="' + qc1 + '"></div><div class="el-form-item"><label class="el-form-item__label">Quick chat #2</label><input maxlength="60" class="el-input__wrapper" autocomplete="off" tabindex="0" placeholder="Enter a message" id="qc-msg-2"value="' + qc2 + '"></div><div class="el-form-item"><label class="el-form-item__label">Quick chat #3</label><input maxlength="60" class="el-input__wrapper" autocomplete="off" tabindex="0" placeholder="Enter a message" id="qc-msg-3"value="' + qc3 + '"></div><div class="el-form-item"><label class="el-form-item__label">Quick chat #4</label><input maxlength="60" class="el-input__wrapper" autocomplete="off" tabindex="0" placeholder="Enter a message" id="qc-msg-4" value="' + qc4 + '"></div>'
                            document.getElementById('qc-msg-1').addEventListener("change", () => {
                                console.log("qc_ms_1: " + document.getElementById('qc-msg-1').value)
                            })
                            document.getElementById('qc-msg-2').addEventListener("change", () => {
                                restart_tooltip.style.display = 'block'
                                console.log("qc_ms_2: " + document.getElementById('qc-msg-2').value)
                            })
                            document.getElementById('qc-msg-3').addEventListener("change", () => {
                                restart_tooltip.style.display = 'block'
                                console.log("qc_ms_3: " + document.getElementById('qc-msg-3').value)
                            })
                            document.getElementById('qc-msg-4').addEventListener("change", () => {
                                restart_tooltip.style.display = 'block'
                                console.log("qc_ms_4: " + document.getElementById('qc-msg-4').value)
                            })
                        }
                    }
                    `)

                    //build updater modal
                    win.webContents.executeJavaScript(`
                    //updater modal
                    //styles
                    const updater_style = document.createElement('style')
                    document.querySelector('head').appendChild(updater_style)
                    updater_style.innerHTML = '.button{display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;text-align:center;box-sizing:border-box;outline:0;transition:.1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;-webkit-appearance:none;min-height:2.5rem;border-radius:.25rem;padding:.75rem 1.25rem;font-size:.875rem}.box-x-close{position:absolute;top:.3rem;right:.5rem}.updater-green{background-color:#10b981;border-color:#059669}.updater-green:hover{background-color:#059669;border-color:#047857}.updater-blue{background-color:#3b82f6;border-color:#2563eb}.updater-blue:hover{background-color:#2563eb;border-color:#1d4ed8}.updater-black:hover,.updater-disabled{background-color:#4b5563;border-color:#374151}.updater-disabled{color:#9ca3af;pointer-events:none}.updater-black{background-color:#6b7280;border-color:#4b5563}body .updater-button{border-bottom-width:4px;border-radius:1rem}.updater-box.active{outline:white solid 2px;filter:brightness(100%)}.updater-modal{background-color:#1f2937;border:2px solid #374151;border-radius:.75rem;width:300px}@media screen and (min-width:768px){.updater-modal{background-color:#1f2937;border:2px solid #374151;border-radius:.75rem;width:400px}}.updater-core{top:5px;right:5px;border:1px solid #fff;border-radius:25px;font-size:14px}#updater-main{justify-content:center;flex-wrap:wrap;width:88%;margin:auto;gap:15px;flex-direction:column;align-items:center}.updater-hidden{opacity:0;pointer-events:none}#updater-modal{transition:opacity .2s}#update-available{margin:10px;width:88%;background:#fff2;border-radius:10px;display:flex;flex-direction:row;align-items:center;padding:10px;justify-content:space-between}'
                    //main div
                    const updater_div = document.createElement('div')
                    document.getElementById('app').appendChild(updater_div)
                    updater_div.outerHTML = '<div style="z-index: 100;" class="w-screen h-screen absolute" id="updater-modal"> <div style="background-color: rgba(0,0,0,.5);" class="w-full h-full absolute"></div><div class="w-full h-full absolute flex justify-center items-center"> <div class="flex flex-col updater-modal relative"> <div style="font-size: 1.3rem" class="text-center py-2">Updater</div><button class="updater-close box-x-close"><svg width="1.125em" height="1.125em" viewBox="0 0 24 24" class="svg-icon" color="gray" style="--sx:1; --sy:1; --r:0deg;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"></path></svg></button> <div style="flex: 1;" class="text-center"> <div class="p-4 flex" id="updater-main"></div></div><div class="text-center py-4"><div id="updater-load" class="button updater-button updater-green" style="margin-right: 10px;">Check for Updates</div><div class="button updater-button updater-black updater-close">Close</div></div></div></div></div>'
                    const updaterMain = document.getElementById("updater-main")
                    const updaterBox = document.createElement("div")
                    updaterMain.appendChild(updaterBox)
                    updaterBox.outerHTML = '<div style="display:none" id="update-available"><p id="update-available-text">Update available</p><div id="updater-download" class="button updater-button updater-blue">Install</div></div><p id="updater-text">No updates available</p><svg id="updater-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#374151" class="bi bi-arrow-clockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"></path><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"></path></svg>'
                    const updateButton = document.getElementById("updater-load")
                    const updateImg = document.getElementById("updater-icon")
                    const updateText = document.getElementById("updater-text")
                    const updateDownloadButton = document.getElementById("updater-download")
                    const updateAvailableDiv = document.getElementById("update-available")
                    const updateAvailableText = document.getElementById("update-available-text")
                    const updaterCloses = document.getElementsByClassName("updater-close")
                    const updaterModal = document.getElementById("updater-modal")
                    updaterModal.classList.toggle("updater-hidden")
                    function resetModal() {
                        updateText.style.display = 'block'
                        updateImg.style.display = 'block'
                        updateAvailableDiv.style.display = 'none'
                        updateDownloadButton.classList.remove('updater-disabled')
                    }
                    for (const updaterClose of updaterCloses) {
                      updaterClose.addEventListener("click", () => {
                        updaterModal.classList.toggle("updater-hidden")
                        updateText.innerText = 'No updates available'
                      })
                    }
                    `)

                    //i love spinny things so there's a spinny feature in the updater :D
                    // also update checking and downloading
                    // and auto update check
                    win.webContents.executeJavaScript(`
                    async function spinUpdateIcon() {
                        setTimeout(function() {
                            updateImg.style.transition = '3s transform ease-in-out'
                            updateImg.style.transform = 'rotateZ(1440deg)'
                            setTimeout(function() {
                                updateImg.style.transition = 'none'
                                updateImg.style.transform = 'rotateZ(0deg)'
                            }, 3000)
                        }, 100)
                    }
                    async function getUpdates() {
                        updateText.innerText = 'Checking for updates...'
                        let url_json = await (await (fetch('https://api.github.com/repos/blockyfish-client/desktop-client/releases/latest'))).json();
                        var download_url = url_json.assets[0].browser_download_url
                        var download_ver = url_json.tag_name
                        var ver_num = download_ver.replace("v", "").replace(".", "").replace(".", "")
                        setTimeout(function() {
                            if (ver_num > ` + version_num + `) {
                                updateText.style.display = 'none'
                                updateImg.style.display = 'none'
                                updateAvailableDiv.style.display = 'flex'
                                updateAvailableText.outerHTML = '<p id="download-percent" style="text-align: left;">Update available<br><span style="color: #aaa">` + version_code + ` -&gt; ' + download_ver + '</span></p>'
                                downloadPercentText = document.getElementById('download-percent')
                                document.getElementById('update-notif').style.display = 'block'
                                updateDownloadButton.addEventListener("click", () => {
                                    if (updateDownloadButton.disabled != true) {
                                        // window.open(download_url)
                                        console.log("request_download: " + download_url)
                                        updateDownloadButton.classList.add('updater-disabled')
                                        updateButton.classList.add('updater-disabled')
                                    }
                                })
                            }
                            else {
                                updateText.innerText = 'No updates available'
                            }
                        }, 2500)
                    }
                    updateButton.addEventListener("click", () => {
                        resetModal()
                        spinUpdateIcon()
                        getUpdates()
                    })
                    setInterval(function() {
                        spinUpdateIcon()
                        getUpdates()
                    }, 60000)
                    getUpdates()
                    `)

                    // autoload posts in forums
                    win.webContents.executeJavaScript(`
                    function isInViewport(e) {
                        const rect = e.getBoundingClientRect();
                        return (
                            rect.top >= 0 &&
                            rect.left >= 0 &&
                            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                        );
                    }
                    document.querySelector('#app > div.ui > div > div.el-row.header.justify-between.flex-nowrap > div:nth-child(2) > div > div:nth-child(3) > button').addEventListener("click", () => {
                        document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div').addEventListener("scroll", function() {
                            if (isInViewport(document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.footer > button'))) {
                                document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.footer > button').click()
                            }
                        })
                    })
                    `)

                    //pink badge for me!!
                    async function insertClientOwnerBadge() {
                        setTimeout(function() {
                            win.webContents.executeJavaScript(`
                            if (document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div.el-row.header > div.el-col.el-col-24.auto-col.fill > div > div:nth-child(2) > img') == null) {
                                badgeParentDiv = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div.el-row.header > div.el-col.el-col-24.auto-col.fill > div')
                                clientOwnerBadge = document.createElement('div')
                                badgeParentDiv.insertBefore(clientOwnerBadge, badgeParentDiv.children[1])
                                clientOwnerBadge.outerHTML = '<div class="el-image verified-icon el-tooltip__trigger el-tooltip__trigger" style="height: 1rem;margin-right: 0.25rem;width: 1rem;"><img src="/img/verified.png" class="el-image__inner" style="filter: hue-rotate(90deg);"></div>'
                            }
                            `)
                        }, 100)
                    }

                    //make progress bar and track download progress to keep people sane
                    function setUpdateDownloadBar(percent) {
                        if (percent < 100) {
                            win.webContents.executeJavaScript(`
                            downloadPercentText.innerHTML = '<p id="download-percent" style="text-align: left;">Downloading - ` + percent + `%</p>'
                            `)
                            win.webContents.executeJavaScript(`
                            updateAvailableDiv.style.backgroundImage = 'linear-gradient(90deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.34) ` + percent + `%, rgba(255,255,255,0) ` + percent + `%, rgba(255,255,255,0) 100%)'
                            `)
                        }
                        else {
                            win.webContents.executeJavaScript(`
                            downloadPercentText.innerHTML = '<p id="download-percent" style="text-align: left;">Installing...</p>'
                            updateAvailableDiv.style.backgroundImage = ''
                            `)
                        
                        }
                    }

                    //autorun update after downloaded
                    function runUpdateInstaller(location) {
                        console.log(location)
                        child(location, function(err, data) {
                            if(err){
                               console.error(err);
                               return;
                            }
                        
                            console.log(data.toString());
                        });
                    }

                // pause game when switching to another window
                // annoying feature so it got commented out
                // and yeeted into unused-features-land
                // win.on('blur', () => {
                //     win.webContents.executeJavaScript(`
                //     if (document.querySelector('#app > div.ui > div').classList.contains('playing') == true) {
                //         if (document.querySelector('#app > div.ui > div').style.display == 'none') {
                //             window.dispatchEvent(new KeyboardEvent("keydown", {keyCode: 27}))
                //         }
                //     }
                //     `)
                // });
                

                // set funny variables for discord rpc
                var old_mode = 'FFA'
                var old_menu = '0'
                var old_url = 'https://beta.deeeep.io'

                // intercept every console log 😈🔥
                win.webContents.on("console-message", (ev, level, message, line, file) => {
                    var msg = `${message}`
                    console.log(msg);

                    //find notification updates
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

                    //find rpc update events
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

                    // download the file
                    // yes, this is actually what starts the download
                    // not that stupid bs 140 lines above
                    if (matches(msg, "request_download:")) {
                        var url = msg.replace("request_download: ", "")
                        electronDl.download(BrowserWindow.getFocusedWindow(), url, {directory:downloadPath, filename:"blockyfishclient-update-download.exe", onProgress: function(progress) {setUpdateDownloadBar(Math.floor(progress.percent * 100))}, onCompleted: function(file) {runUpdateInstaller(file.path)}})
                    }

                    // store extension related settings so they can be loaded later
                    // also saves your window size and location so you dont have to adjust it everytime
                    if (matches(msg, "store_settings:")) {
                        var msg = msg.replace("store_settings: ", "")
                        var setting_key = msg.slice(0,-1)
                        var setting_value = msg.slice(-1)
                        if (setting_value == 0) {
                            var setting_value_bool = false
                        }
                        else if (setting_value == 1) {
                            var setting_value_bool = true
                        }
                        store.set(setting_key, setting_value_bool)
                    }

                    // store quick chat messages
                    if (matches(msg, "qc_ms_1: ")) {
                        var msg = msg.replace("qc_ms_1: ", "")
                        qc1 = msg
                    }
                    if (matches(msg, "qc_ms_2: ")) {
                        var msg = msg.replace("qc_ms_2: ", "")
                        qc2 = msg
                    }
                    if (matches(msg, "qc_ms_3: ")) {
                        var msg = msg.replace("qc_ms_3: ", "")
                        qc3 = msg
                    }
                    if (matches(msg, "qc_ms_4: ")) {
                        var msg = msg.replace("qc_ms_4: ", "")
                        qc4 = msg
                    }

                    // send quick-chat message
                    if (matches(msg, "send_chat_msg:")) {
                        var msg = msg.replace("send_chat_msg: ", "")
                        sendKeybinding(win, 'enter')
                        for (var i = 0; i < msg.length; i++) {
                            sendKeybinding(win, msg[i])
                        }
                        sendKeybinding(win, 'enter')
                    }

                    //load custom settings
                    if (matches(msg, "Modal Added:[object HTMLDivElement]")) {
                        win.webContents.executeJavaScript(`buildCustomSettingsItems('` + qc1 + `', '` + qc2 + `', '` + qc3 + `', '` + qc4 + `')`)
                    }

                    // if game has loaded, inject the hacks xd
                    if (matches(msg, "Common.playLoadProgress (old, new),100,0")) {
                        win.webContents.executeJavaScript(`
                        setInterval(function () {
                        for (let i = 0; i < game.currentScene.terrainManager.terrains.length; i++) {
                                game.currentScene.terrainManager.terrains[i].alpha = 0.5;
                            }
                            game.currentScene.ceilingsContainer.alpha = 0.3
                            game.viewport.clampZoom({
                                minWidth: 0,
                                maxWidth: 1e7,
                            })
                            game.currentScene.terrainManager.shadow.setShadowSize(1000000)

                            // TWEMOJI
                            // for names
                            if (game.currentScene.myAnimal != null) {
                                var ownerName = game.currentScene.myAnimal.entityName
                                if (ownerName == '') {
                                    var ownerName = 'Unnamed'
                                }
                                game.currentScene.myAnimal.nameObject.textStyles.default.fontFamily = "Quicksand, 'emoji'"
                                game.currentScene.myAnimal.updateName('')
                                game.currentScene.myAnimal.updateName(ownerName)
                            }
                            for (let i = 0; i < game.currentScene.entityManager.animalsList.length; i++) {
                                var name = game.currentScene.entityManager.animalsList[i].entityName
                                if (name == '') {
                                    var name = 'Unnamed'
                                }
                                game.currentScene.entityManager.animalsList[i].nameObject.textStyles.default.fontFamily = "Quicksand, 'emoji'"
                                game.currentScene.entityManager.animalsList[i].updateName('')
                                game.currentScene.entityManager.animalsList[i].updateName(name)
                            }

                            // for chat messages
                            for (let i = 0; i < game.currentScene.chatMessages.length; i++) {
                                var chatMsg = game.currentScene.chatMessages[i].text._text

                                game.currentScene.chatMessages[i].text.textStyles.default.fontFamily = "Quicksand, 'emoji'"
                                game.currentScene.chatMessages[i].setText('')
                                game.currentScene.chatMessages[i].setText(chatMsg)
                            }
                        }, 200);

                        //no flashbang/ink
                        game.currentScene.toggleFlash = function() {}
                        game.currentScene.viewingGhosts = true

                        //evo wheel
                        var evo_wheel = document.createElement('div')
                        document.querySelector('div.game').insertBefore(evo_wheel, document.querySelector('div.game').children[0])
                        evo_wheel.outerHTML = '<div style="width: 100%;height: 100%;position: absolute;pointer-events: none;display: flex;"><img id="evo-wheel" draggable="false" src="https://raw.githubusercontent.com/blockyfish-client/Assets/main/evo_circle.png" style="z-index: -9999;max-width: 80vw;max-height: 80vh;align-self: center;margin: auto;transition: 0.1s all;transform: scale(0);opacity: 0;"></div>'        
                        evo_wheel = document.getElementById('evo-wheel')

                        evo_wheel.style.transform = 'scale(1) rotate(0deg)'
                        evo_wheel.style.transform = 'scale(0) rotate(-90deg)'
                        evo_wheel.style.transition = '.3s all'

                        async function preloadEvoWheel() {
                            evo_wheel.style.transform = 'scale(1) rotate(0deg)'
                            evo_wheel.style.opacity = 1
                            setTimeout(() => {
                                evo_wheel.style.transform = 'scale(0) rotate(-90deg)'
                                evo_wheel.style.opacity = 0
                            }, 1000)
                            setTimeout(() => {
                                evo_wheel.style.zIndex = 9999
                            }, 1500)
                        }

                        preloadEvoWheel()

                        //Y shortcut key
                        document.body.addEventListener('keydown', function(e) {
                            if (e.isComposing || e.keyCode === 229) {
                                return;
                            }
                            if (e.key.toLowerCase() == "y" && document.querySelector('#app > div.modals-container > div') == null && document.querySelector('#app > div.ui > div').style.display == 'none' && document.activeElement.localName != 'input') {
                                rot = evo_wheel_rot
                                evo_wheel.style.transform = 'scale(1) rotate(' + rot + 'deg)'
                                evo_wheel.style.opacity = 1
                            }
                        });
                        document.body.addEventListener('keyup', function(e) {
                            if (e.key.toLowerCase() == "y") {
                                rot = evo_wheel_rot - 90
                                evo_wheel.style.transform = 'scale(0) rotate(' + rot + 'deg)'
                                evo_wheel.style.opacity = 0
                            }
                        });
                        `)

                        // asset swapper
                        win.webContents.executeJavaScript(`
                        var aswp_button = document.querySelector('#app > div.overlay > div.top-right > div.buttons.button-bar > div > button:nth-child(1)').cloneNode(true)
                        var aswp_parent_div = document.querySelector('#app > div.overlay > div.top-right > div.buttons.button-bar > div')
                        aswp_parent_div.insertBefore(aswp_button, aswp_parent_div.children[0])
                        var aswp_svg = document.querySelector('#app > div.overlay > div.top-right > div.buttons.button-bar > div > button:nth-child(1) > span > svg')
                        aswp_svg.outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers-fill" viewBox="0 0 16 16"><path d="M7.765 1.559a.5.5 0 0 1 .47 0l7.5 4a.5.5 0 0 1 0 .882l-7.5 4a.5.5 0 0 1-.47 0l-7.5-4a.5.5 0 0 1 0-.882l7.5-4z"/><path d="m2.125 8.567-1.86.992a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882l-1.86-.992-5.17 2.756a1.5 1.5 0 0 1-1.41 0l-5.17-2.756z"/></svg>'
                        var aswp_key = document.querySelector('#app > div.overlay > div.top-right > div.buttons.button-bar > div > button:nth-child(1) > span > div')
                        aswp_key.innerText = 'K'
                        document.querySelector('#app > div.overlay > div.top-right > div.buttons.button-bar > div > button:nth-child(1)').addEventListener("mousedown", () => {
                            if (document.querySelector('#app > div.modals-container > div') == null && document.querySelector('#app > div.ui > div').style.display == 'none') {
                                toggleAswp()
                            }
                        })
                        `)

                        //quick chat UI
                        win.webContents.executeJavaScript(`
                        var qc_div = document.createElement('div')
                        document.querySelector('div.game').insertBefore(qc_div, document.querySelector('div.game').children[0])
                        qc_div.outerHTML = '<div id=quick-chat-container style=display:none><div class="quick-chat row one"><div><p>` + qc1 + `</div></div><div class="quick-chat row two"><div><p>` + qc4 + `</div><div><p>` + qc2 + `</div></div><div class="quick-chat row one"><div><p>` + qc3 + `</div></div></div>'
                        var quickChatDiv = document.getElementById('quick-chat-container')
                        document.body.addEventListener("mousemove", (e) => {
                            window.mouseX = e.clientX
                            window.mouseY = e.clientY 
                        })
                        window.posSet = false
                        document.body.addEventListener("keydown", (e) => {
                            if (e.key.toLowerCase() == "c" && document.querySelector('#app > div.modals-container > div') == null && document.querySelector('#app > div.ui > div').style.display == 'none' && document.activeElement.localName != 'input') {
                                if (!posSet) {
                                    quickChatDiv.style.display = "block"
                                    let x = mouseX - 300
                                    let y = mouseY - 150
                                    quickChatDiv.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
                                    window.posSet = true
                                }
                            }
                        })
                        document.body.addEventListener("keyup", (e) => {
                            if (e.key.toLowerCase() == "c") {
                                if (document.querySelector('#quick-chat-container > div > div:hover') != null) {
                                    console.log("send_chat_msg: " + document.querySelector('#quick-chat-container > div > div:hover').innerText)
                                }
                                quickChatDiv.style.display = "none"
                                window.posSet = false
                            }
                        })
                        `)

                        // control click listener
                        win.webContents.executeJavaScript(`
                        var ctrl_overlay = document.createElement('div')
                        document.querySelector('div.game').insertBefore(ctrl_overlay, document.querySelector('div.game').children[0])
                        ctrl_overlay.outerHTML = '<div id="ctrl-overlay" style="width: 100%;height: 100%;position: absolute;display: block;z-index:10000;pointer-events:none;"></div>'
                        `)
                        win.webContents.executeJavaScript(`
                        window.addEventListener("keydown",
                            function(e) {
                                if (e.ctrlKey) {
                                    document.getElementById('ctrl-overlay').style.pointerEvents = 'all'
                                }
                            },
                        false);
                        window.addEventListener("click",
                            function(e) {
                                if (e.ctrlKey) {
                                    game.inputManager.handleLongPress(50000)
                                }
                            },
                        false);
                        window.addEventListener("keyup",
                        function(e) {
                            if (!e.ctrlKey) {
                                document.getElementById('ctrl-overlay').style.pointerEvents = 'none'
                            }
                        },
                        false);
                        `)
                    }
                });

                //custom keybinds
                win.webContents.executeJavaScript(`
                var evo_wheel_rot = 0
                setInterval(function() {
                    evo_wheel_rot += 1
                }, 100)
                document.body.addEventListener('keydown', function(e) {
                    if (e.key == "Escape") {
                        e.preventDefault()
                        if (document.querySelector('#app > div.ui > div').style.display != 'none') {
                            document.querySelector('div.el-col.el-col-8.is-guttered > button').click()
                        }
                    }
                    if (e.key == "F11") {
                        if (document.fullscreenElement) {
                            document.exitFullscreen();
                        } else {
                            document.documentElement.requestFullscreen();
                        }
                    }
                    if (e.key.toLowerCase() == "k") {
                        if (document.querySelector('#app > div.modals-container > div') == null && document.querySelector('#app > div.ui > div').style.display == 'none' && document.activeElement.localName != 'input') {
                            e.preventDefault()
                            toggleAswp()
                        }
                    }
                });
                `)

                // show the window after all the scripts finish
                // this is so that the app shows only when the UI in complete
                // if this was shown before everything finished loading, 
                // it would make me look noob and unprofessional
                win.show();

                // no u electron xd
                // open all links in the default browser
                // instead of yucky electron windows
                win.webContents.setWindowOpenHandler(({ url }) => {
                        shell.openExternal(url);
                        return { action: 'deny' };
                });

                // discord rpc stuff lol
                var rpc = new Client({
                    transport: "ipc",
                });

                // log into the client to get icon and app name
                rpc.login({clientId: "918680181609213972"}).catch(console.error)
                var startTime = new Date()

                // fallback in-case v5 comes and i am gone
                // at least it will show something
                rpc.on("ready", () => {
                    rpc.setActivity({
                        details: "Idle",
                        largeImageKey: "icon",
                        largeImageText: "Deeeep.io",
                        startTimestamp: startTime,
                    })
                });

                // update discord rpc
                function setGameMode(mode, menu) {
                    //greb url and eats it (jk)
                    var currentUrl = win.webContents.getURL()
                    // console.log(currentUrl)

                    // viewing <user>'s profile
                    if (matches(currentUrl, "/u/")) {
                        var detailText = 'Viewing ' + currentUrl.replace("https://beta.deeeep.io/u/", "").replace(/\?host=....../i, "") + "'s profile"
                        var labelText = ''
                        if (currentUrl.replace("https://beta.deeeep.io/u/", "").replace(/\?host=....../i, "") == 'ItsGrandPi') {
                            insertClientOwnerBadge()
                        }
                    }

                    // these ones are self-explainatory
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

                    // if url is just "https://beta.deeeep.io", it means you are playing
                    else {
                        var detailText = "Playing " + mode
                        var labelText = 'Join game'
                    }

                    // if the gamemode buttons exist, use them to update the status
                    // otherwise it will use the fallback set previously and show "idle"
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

                    // sike! this is the real fallback
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
        })
    })
}

// now you actually see it, the win.show() thing was all a lie
createWindow()
})

// stupid mac os thing idk
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// kill everything related to the app when you press the close button
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})