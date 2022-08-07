# 🐠 Deeeep.io Desktop Client for v4  

Blockyfish client is an alternative to the Deeeep.io Desktop Client. It is built with ElectronJS and features Discord Rich Presence and Doctorpus Assets. 

## 📦 Downloads  

Latest version: https://blockyfish.netlify.app  
Older version: [releases page](https://github.com/blockyfish-client/Desktop-Client/releases)  

## 🪄 Features  
- Detailed rich presence for Discord  
- Togglable adblocker  
- Doctorpus assets  
- Built-in evolution tree  
- Auto update checker for client updates  
- Taskbar notification badges for forum notifications  
- Exit confirmation dialog  
- Borderless window  
- Esc key can pause and unpause the game  

## 📒 Planned features  
- Auto-fill name  
- Desktop notifications for forum replies  
- Account switcher  
- Custom themes  
- Auto-loading in forums  

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

## 📬Feedback and contribution
Tell us on our [discord server](https://discord.gg/8Amw32CrGR). 

Message `.pi#3141` if you want to contribute

## 📝 Changelogs  

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
![loading_animation](https://raw.githubusercontent.com/blockyfish-client/Desktop-Client/master/img/loading.gif)  

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
