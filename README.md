[![Blockyfish Client Banner](https://raw.githubusercontent.com/blockyfish-client/Assets/main/blockyfishclientbanner.png)](https://blockyfish.netlify.app)

----
<h3 align="center">Blockyfish client is an alternative to the Deeeep.io Desktop Client. It is built with ElectronJS and features Discord Rich Presence and Doctorpus Assets.</h3>  

----


## 📦 Downloads  

Latest version: https://blockyfish.netlify.app  
Older version: [releases page](https://github.com/blockyfish-client/Desktop-Client/releases)  

## 🪄 Features  
- [x] Detailed rich presence for Discord  
- [x] Togglable adblocker  
- [x] Doctorpus assets  
- [x] Built-in evolution tree  
- [x] Auto update checker for client updates  
- [x] Taskbar notification badges for forum notifications  
- [x] Exit confirmation dialog  
- [x] Borderless window  
- [x] Esc key can pause and unpause the game  
- [ ] Auto-fill name  
- [ ] Desktop notifications for forum replies  
- [ ] Account switcher  
- [ ] Custom themes  
- [ ] Auto-loading in forums  

## 🛠️ Building
### Prerequisites
- [NodeJS](https://nodejs.org/en/download/)
- [Git](https://gitforwindows.org/)  

### Building
Clone the repo
```
mkdir blockyfish-client
git clone https://github.com/blockyfish-client/Desktop-Client.git blockyfish-client
```
Install node modules
```
npm i
```
Run the app
```
npm run start
```
Build an installer
```
npm run make-win
npm run pack-win
```

## 📬 Feedback and contribution
Tell us on our [discord server](https://discord.gg/8Amw32CrGR). 

Message `.pi#3141` if you want to contribute

## 📝 Changelogs  

### v1.5.5 v3 UI
- Add option to go back to old v3 UI
- Aimbot no longer targets lampreys

### v1.5.4 Aimbot improvements
- Aimbot will no longer target teammates in TFFA and PD
- Aimbot will not target AIs and ghosts
- Added orange verified badge

### v1.5.3 Aim assist
- Aim assist. Press Z to toggle. 

### v1.5.2 Performance Optimization
- Less resource intensive
- Terrain is now no longer transparent, but food and animals will still be shown on top
- Animal name and stats are not visible while digging
- Added offline screen

### v1.5.1 New hacks
- Animal always on top, even over foreground props
- Aim assist. Shows a line where your trajectory will be. Works on the following:
  - Goblin shark
  - Japanese spider crab
  - Sea otter
  - Archerfish
- Added a `/help` command to show all available slash commands. 

### v1.5.0 Custom theme
- Togglable custom theme

### v1.4.1 Multibox bug fix
- Added `new window` button. 
- Fixed an issue where nothing works in secondary windows. 

### v1.4.0 Multiboxing/target lock support
- Use `/settarget <id>` to lock on to an animal
- Fixed chat message duplication when using quick chat

### v1.3.5 Slash commands and anti-hiding
- See all hiding animals, their name, and their stats. 
- Press "/" to quickly use a slash command. Totally did not copy a certain 3D block building game. 
- /mute and /unmute are back!! When you see someone saying things you don't like, use /mute <id> to mute them. If you muted someone by accident, just use /unmute <id>. 

### v1.3.4 Ban implementation
- Added functionality to ban selected users. Banned users can only use versions prior to this. 
- Control-Shift-Click boosting now lets you shoot fast projectiles with beaked whale and beluga

### v1.3.3 Hotfix for bug
- Fixed a bug where if you put an apostrophe ( ' ) in the quick chat message, the settings will not load again after that.

### v1.3.2 Special key combos
- Control-shift-click:
  - On land, most animals will jump as high as bullfrog when you click
  - Allows thresher shark to achieve insane speed!
- Alt-click lets you do a tiny hop, useful for getting off the ground when running away

### v1.3.1 Control-click boosting
- Control-click boosting! A new type of hack. Hold down control and click to use your charged boost instantly!! Useful for animals with long charge boost time like catfish, torpedo ray, and beaked whale. 

### v1.3.0 Hacks, quick chats, and circular evo tree
- Added hacks. 
  - Transparent terrain
  - Anti-ink and anti-flashbang
  - No darkness
  - Infinite zoom
- Hold "Y" while playing to show a circular diep.io-style evolution tree. 
- Hold "C" while playing to open a pie menu for quick chat messages. These can be configured by going to settings on the home menu. 
- Twemoji. Emojis found in Twitter and Discord. Can be turned off in settings. 

### v1.2.1 Rebranding

- Rebrand to Blockyfish! New icon!
- Saves window position and size on close

### v1.2.0 Doc-assets and uBlock
- Doctorpus Assets!!
- uBlock Origin for adblock
- Pink verified badge for me!
- Extension toggles are integrated into the settings page
- Version info shown in settings
- Changed the name length limit from the original 20 characters limit to real 22 characters limit
- Note text in settings saying that you need to restart the client to change extension settings  

### v1.1.4
- Update process now doesn't require you to open your browser
- Download progress bar
- Update file saves to your default download folder
- After updating, the downloaded file is removed  

### v1.1.3
- Custom cursor
- Made images undraggable for a better user experience  

### v1.1.2
- Full screen support is here!
  - Game layouts move around to avoid the title bar buttons overlay depending on whether you are in full screen mode or not. 
  - F11 key to toggle full screen. Don't hold it down if you have epilepsies. 
- Performance improvement. Done by reducing the fire rate of background scripts. 
- Removed the pause game on unfocus feature because it's annoying and doesn't really help.  

### v1.1.1
- Updater:
  - Automatic update checking
  - Does not automatically download when a new version is found
  - Shows an option to download a newer version instead
  - Shows current version and available version
  - Update notification (small red dot on the updater button)
- New installation gif. No more cringey iOS loading animation, spinny shark is better  
[![loading_animation](https://raw.githubusercontent.com/blockyfish-client/Desktop-Client/master/img/loading.gif)](#)  

### v1.1.0 Updater
- Updater. Doesn't have automatic update checking yet
- More homepage buttons:
  - Blockfish client website
  - Blockyfish client github repo
  - Updater  

### v1.0.0
Initial release
Features:
- Borderless window. There's a small part at the top of the window you can use to drag it around. 
- UI elements moved around to accommodate for the title bar overlay in the top right. 
- Detailed rich presence for discord. Can show what game mode you're playing and what you're doing (menu, store, inventory, forums, user profile)
- Better esc key binds. You can press esc to resume game after you've paused it instead of having to click the green button. 
- Adblock!! Everyone hates ads!!
- Fast startup time. Starts nearly instantly, compared to the 3 second start-up time for other clients. 
- Notification badges for forum notifications. When the client is open, it will show notification badges on the taskbar icon if you have any. Similar to badges on the discord taskbar icon. 
- Auto-pause. When you switch to another window, the game will automatically pause for you so that you don't wander off aimlessly and die. 
- Built-in evolution tree. Tired of forgetting how to evolve to a certain animal? Well now you can see the evolution tree right from the game!
- External links open in your browser instead of in a new app window, unlike other clients. 
- Exit confirmation. Just so that you don't get that "oh no I misclicked" moment and lose your 10M penguin run. 
- Smooth loading. The webpage completes loading before it shows you the window. Making the experience seem more polished and smooth. 
