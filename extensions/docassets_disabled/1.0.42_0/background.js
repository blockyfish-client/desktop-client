var options = {};

var DEFAULTS = {
    redirectAssets: true, 
} 

function setDefaults() {
    chrome.storage.sync.get(DEFAULTS, function (obj) {
        chrome.storage.sync.set(obj, syncSettings); 
    }); 
} 

chrome.runtime.onInstalled.addListener(function (info) {
    setDefaults(); 
}); 

function syncSettings() {
    chrome.storage.sync.get(DEFAULTS, function (obj) {
      Object.assign(options, obj); 
      console.log(options);

      let color = options.redirectAssets ? '#00a04a' : '#bb0000'; 
      let text = options.redirectAssets ? 'ON' : 'OFF'; 

      chrome.browserAction.setBadgeBackgroundColor({
          color: color, 
      }); 
      chrome.browserAction.setBadgeText({
          text: text, 
      }); 

    });

    console.log("sync settings running");
}

syncSettings(); 

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "sync-settings") {
      syncSettings(); 
    } 
}); 

function toggleRedirect() {
    options.redirectAssets = !options.redirectAssets; 

    chrome.storage.sync.set(options, syncSettings); 
}

chrome.browserAction.onClicked.addListener(toggleRedirect); 

//script

script = 'https://the-doctorpus.github.io/doc-assets/scripts/bundle.js';

const alreadyChecked = new Set();

function tempMarkChecked(toAdd) {
    alreadyChecked.add(toAdd);

    console.log(`${toAdd} temp-added to checked list`); 

    setTimeout(function(toRemove) {
        alreadyChecked.delete(toRemove);

        console.log(`${toRemove} removed from checked list`); 
    }, 5000, toAdd);
}
  
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        let url = options.redirectAssets ? script : details.url; 

        return {redirectUrl: url};
    },
    {
        urls: [
            "https://deeeep.io/bundle.js?*"
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);

function genericHandler(redirectTemplate, regex, name, filenameKeys=['filename']) {
    function handler(details) {
        let redirectUrl = details.url; 
        
        if (options.redirectAssets) {
            const m = regex.exec(details.url); // checks if might be valid X

            console.log(`original ${name} URL is ${details.url}`); 

            if (m) {
                const filenameArray = filenameKeys.map(key => m.groups[key] || '');
                const filename = filenameArray.join('');

                console.log(filename); 

                let newRedirectUrl = redirectTemplate + filename; // redirect it

                if (!alreadyChecked.has(newRedirectUrl)) {
                    let checkRequest = new XMLHttpRequest(); // creates HTTP request

                    checkRequest.open('GET', newRedirectUrl, false); // sets up request
                    checkRequest.send(); // sends the request

                    if (checkRequest.status >= 200 && checkRequest.status < 300) { // redirect exists
                        redirectUrl = newRedirectUrl; 

                        console.log(`Redirecting to ${newRedirectUrl}`); 
                    } else {
                        tempMarkChecked(newRedirectUrl);

                        console.log(`${newRedirectUrl} does not exist. Using default.`); 
                    }
                } else {
                    console.log(`Already checked ${newRedirectUrl}`); 
                }
            } 
        }

        return  {
            redirectUrl: redirectUrl, 
        }; 
    } 

    return handler; 
}

const MISC_REDIRECT_TEMPLATE = 'https://blockyfish-client.github.io/Hacked-Doc-Assets/images/misc/'; // redirect URLs are all from this
const MISC_SCHEME = '*://*.deeeep.io/assets/*'; // these urls will be redirected like ui sprites
const MISC_REGEX = /.+\/assets\/(?<filename>.+\.js)(?:\?.*)?$/ // might it be a valid ui sprite? 

const miscHandler = genericHandler(MISC_REDIRECT_TEMPLATE, MISC_REGEX, 'misc'); 

chrome.webRequest.onBeforeRequest.addListener(
    miscHandler, 
    {
        urls: [
            MISC_SCHEME
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
); 