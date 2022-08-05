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
            //css
            const cursor_style = document.createElement('style')
            document.querySelector('head').appendChild(cursor_style)
            cursor_style.innerHTML = 'a,body,button,img,input,textarea,li,div,tr,td{cursor:none!important}.mouse-cursor{position:fixed;left:0;top:0;pointer-events:none;border-radius:50%;-webkit-transform:translateZ(0);transform:translateZ(0);visibility:hidden;display:block}.cursor-inner{margin-left:-3px;margin-top:-3px;width:6px;height:6px;z-index:10000001;background-color:#ced0d4;-webkit-transition:width .3s ease-in-out,height .3s ease-in-out,margin .3s ease-in-out,opacity .3s ease-in-out;transition:width .3s ease-in-out,height .3s ease-in-out,margin .3s ease-in-out,opacity .3s ease-in-out;filter:drop-shadow(0 0 2px white)}.cursor-inner.cursor-hover{margin-left:-4px;margin-top:-4px;width:8px;height:8px;background-color:#ced0d4}.cursor-outer{margin-left:-15px;margin-top:-15px;width:30px;height:30px;border:2px solid #ced0d4;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:10000000;opacity:.7;-webkit-transition:width .3s ease-in-out,height .3s ease-in-out,margin .3s ease-in-out,opacity .3s ease-in-out;transition:width .3s ease-in-out,height .3s ease-in-out,margin .3s ease-in-out,opacity .3s ease-in-out;filter:drop-shadow(0 0 3px black)}.cursor-outer.cursor-hover{margin-left:-25px;margin-top:-25px;width:50px;height:50px;opacity:.3}.cursor-hide{display:none!important}'
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
                if (document.querySelector('div.sidebar.left.p-2') != null) {
                    document.querySelector('div.sidebar.left.p-2').remove()
                }

                //game ui modification
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
                if (document.querySelector('div.sidebar.right > div:nth-child(3) > button > span > span').style.whiteSpace != 'pre-wrap') {
                    document.querySelector('div.sidebar.right > div:nth-child(3) > button > span > span').style.whiteSpace = 'pre-wrap'
                }
            }, 1000)
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
            style.innerHTML = '.button{display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;text-align:center;box-sizing:border-box;outline:0;transition:.1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;-webkit-appearance:none;min-height:2.5rem;border-radius:.25rem;padding:.75rem 1.25rem;font-size:.875rem}.box-x-close{position:absolute;top:.3rem;right:.5rem}.evo-red{background-color:#ef4444;border-color:#dc2626}.evo-red:hover{background-color:#dc2626;border-color:#b91c1c}.evo-black{background-color:#6b7280;border-color:#4b5563}.evo-black:hover{background-color:#4b5563;border-color:#374151}body .evo-button{border-bottom-width:4px;border-radius:1rem}.evo-box.active{outline:white solid 2px;filter:brightness(100%)}.evo-modal{background-color:#1f2937;border:2px solid #374151;border-radius:.75rem;width:100vh}.evo-core{top:5px;right:5px;border:1px solid #fff;border-radius:25px;font-size:14px}#evo-main{flex-wrap:wrap;width:88%;margin:auto;gap:15px}.evo-hidden{opacity: 0;pointer-events: none;}#evo-modal{transition: 0.2s opacity;}'
            const div = document.createElement('div')
            document.getElementById('app').appendChild(div)
            div.outerHTML = '<div style="z-index: 100;" class="w-screen h-screen absolute" id="evo-modal"> <div style="background-color: rgba(0,0,0,.5);" class="w-full h-full absolute"></div><div class="w-full h-full absolute flex justify-center items-center"> <div class="flex flex-col evo-modal relative"> <div style="font-size: 1.3rem" class="text-center py-2">Evo Tree</div><button class="evo-close box-x-close"><svg width="1.125em" height="1.125em" viewBox="0 0 24 24" class="svg-icon" color="gray" data-v-35f7fcad="" data-v-3140a19a="" data-v-daae3c72="" style="--sx:1; --sy:1; --r:0deg;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" data-v-35f7fcad=""></path></svg></button> <div style="flex: 1;" class="text-center"> <div class="p-4 flex" id="evo-main"></div></div><div class="text-center py-4"> <div class="button evo-button evo-black evo-close">Close</div></div></div></div></div>'
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
            win.webContents.executeJavaScript(`
            const drag = document.createElement('div')
            document.querySelector('#app > div.ui > div').appendChild(drag)
            drag.outerHTML = '<div style="-webkit-app-region: drag;width: 100vw;height: 20px;position: absolute;top: 0;left: 0;cursor: move;"></div>'
            `)
            win.webContents.executeJavaScript(`
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
                else {
                    console.log(e.key)
                }
            });
            `)
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
            win.webContents.executeJavaScript(`
            //updater modal
            //styles
            const updater_style = document.createElement('style')
            document.querySelector('head').appendChild(updater_style)
            updater_style.innerHTML = '.button{display:inline-flex;justify-content:center;align-items:center;line-height:1;height:32px;white-space:nowrap;cursor:pointer;text-align:center;box-sizing:border-box;outline:0;transition:.1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;-webkit-appearance:none;min-height:2.5rem;border-radius:.25rem;padding:.75rem 1.25rem;font-size:.875rem}.box-x-close{position:absolute;top:.3rem;right:.5rem}.updater-green{background-color:#10b981;border-color:#059669}.updater-green:hover{background-color:#059669;border-color:#047857}.updater-blue{background-color:#3b82f6;border-color:#2563eb}.updater-blue:hover{background-color:#2563eb;border-color:#1d4ed8}.updater-black{background-color:#6b7280;border-color:#4b5563}.updater-black:hover{background-color:#4b5563;border-color:#374151}body .updater-button{border-bottom-width:4px;border-radius:1rem}.updater-box.active{outline:white solid 2px;filter:brightness(100%)}.updater-modal{background-color:#1f2937;border:2px solid #374151;border-radius:.75rem;width:300px}@media screen and (min-width:768px){.updater-modal{background-color:#1f2937;border:2px solid #374151;border-radius:.75rem;width:400px}}.updater-core{top:5px;right:5px;border:1px solid #fff;border-radius:25px;font-size:14px}#updater-main{justify-content:center;flex-wrap:wrap;width:88%;margin:auto;gap:15px;flex-direction:column;align-items:center}.updater-hidden{opacity:0;pointer-events:none}#updater-modal{transition: 0.2s opacity}#update-available{margin:10px;width:88%;background:#fff2;border-radius:10px;display:flex;flex-direction:row;align-items:center;padding:10px;justify-content:space-between}'
            //main div
            const updater_div = document.createElement('div')
            document.getElementById('app').appendChild(updater_div)
            updater_div.outerHTML = '<div style="z-index: 100;" class="w-screen h-screen absolute" id="updater-modal"> <div style="background-color: rgba(0,0,0,.5);" class="w-full h-full absolute"></div><div class="w-full h-full absolute flex justify-center items-center"> <div class="flex flex-col updater-modal relative"> <div style="font-size: 1.3rem" class="text-center py-2">Updater</div><button class="updater-close box-x-close"><svg width="1.125em" height="1.125em" viewBox="0 0 24 24" class="svg-icon" color="gray" data-v-35f7fcad="" data-v-3140a19a="" data-v-daae3c72="" style="--sx:1; --sy:1; --r:0deg;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" data-v-35f7fcad=""></path></svg></button> <div style="flex: 1;" class="text-center"> <div class="p-4 flex" id="updater-main"></div></div><div class="text-center py-4"><div id="updater-load" class="button updater-button updater-green" style="margin-right: 10px;">Check for Updates</div><div class="button updater-button updater-black updater-close">Close</div></div></div></div></div>'
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
            }
            for (const updaterClose of updaterCloses) {
              updaterClose.addEventListener("click", () => {
                updaterModal.classList.toggle("updater-hidden")
                updateText.innerText = 'No updates available'
              })
            }
            `)
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
                    if (ver_num > 113) {
                        updateText.style.display = 'none'
                        updateImg.style.display = 'none'
                        updateAvailableDiv.style.display = 'flex'
                        updateAvailableText.outerHTML = '<p style="text-align: left;">Update available<br><span style="color: #aaa">v1.1.3 -&gt; ' + download_ver + '</span></p>'
                        document.getElementById('update-notif').style.display = 'block'
                        updateDownloadButton.addEventListener("click", () => {
                            window.open(download_url)
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
        // win.on('blur', () => {
        //     win.webContents.executeJavaScript(`
        //     if (document.querySelector('#app > div.ui > div').classList.contains('playing') == true) {
        //         if (document.querySelector('#app > div.ui > div').style.display == 'none') {
        //             window.dispatchEvent(new KeyboardEvent("keydown", {keyCode: 27}))
        //         }
        //     }
        //     `)
        // });

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
        rpc.login({clientId: "918680181609213972"}).catch(console.error)
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