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

const ANIMATION_REDIRECT_TEMPLATE = 'https://the-doctorpus.github.io/doc-assets/images/default/animations/'; // redirect URLs are all from this
const ANIMATION_SCHEME = '*://*.deeeep.io/assets/animations/*'; // these urls will be redirected like animations
const ANIMATION_REGEX = /.+\/animations\/(?<filename>[^?]+)(?:\?.*)?$/ // might it be a valid animation? 

const animationHandler = genericHandler(ANIMATION_REDIRECT_TEMPLATE, ANIMATION_REGEX, 'animation'); 

chrome.webRequest.onBeforeRequest.addListener(
    animationHandler, 
    {
        urls: [
            ANIMATION_SCHEME
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
); 

const CHAR_REDIRECT_TEMPLATE = 'https://the-doctorpus.github.io/doc-assets/images/characters/'; // redirect URLs are all from this
const CHAR_SCHEME = '*://*.deeeep.io/*assets/characters/*'; // these urls will be redirected like characters
const CHAR_REGEX = /.+\/characters\/(?<filename>[^?]+)(?:\?.*)?$/ // might it be a valid character? 

const charHandler = genericHandler(CHAR_REDIRECT_TEMPLATE, CHAR_REGEX, 'character'); 

chrome.webRequest.onBeforeRequest.addListener(
    charHandler, 
    {
        urls: [
            CHAR_SCHEME
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
); 

const SPRITESHEET_REDIRECT_TEMPLATE = 'https://the-doctorpus.github.io/doc-assets/images/default/spritesheets/'; // redirect URLs are all from this
const SPRITESHEET_SCHEME = '*://*.deeeep.io/assets/spritesheets/*'; // these urls will be redirected like spritesheets
const SPRITESHEET_REGEX = /.+\/spritesheets\/(?<filename>[^?]+)(?:\?.*)?$/ // might it be a valid spritesheet? 

const spritesheetHandler = genericHandler(SPRITESHEET_REDIRECT_TEMPLATE, SPRITESHEET_REGEX, 'spritesheet'); 

chrome.webRequest.onBeforeRequest.addListener(
    spritesheetHandler, 
    {
        urls: [
            SPRITESHEET_SCHEME
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
); 

const MAP_SPRITESHEET_REDIRECT_TEMPLATE = 'https://the-doctorpus.github.io/doc-assets/images/default/mapmaker-asset-packs/'; // redirect URLs are all from this
const MAP_SPRITESHEET_SCHEME = '*://*.deeeep.io/assets/packs/*'; // these urls will be redirected like map spritesheets
const MAP_SPRITESHEET_REGEX = /.+\/packs\/(?<filename>[^?]+)(?:\?.*)?$/ // might it be a valid map spritesheet? 

const mapSpritesheetHandler = genericHandler(MAP_SPRITESHEET_REDIRECT_TEMPLATE, MAP_SPRITESHEET_REGEX, 'map spritesheet'); 

chrome.webRequest.onBeforeRequest.addListener(
    mapSpritesheetHandler, 
    {
        urls: [
            MAP_SPRITESHEET_SCHEME
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
); 

const IMG_REDIRECT_TEMPLATE = 'https://the-doctorpus.github.io/doc-assets/images/img/'; // redirect URLs are all from this
const IMG_SCHEME = '*://*.deeeep.io/img/*'; // these urls will be redirected like ui sprites
const IMG_REGEX = /.+\/img\/(?<filename>[^?]+)(?:\?.*)?$/ // might it be a valid ui sprite? 

const imgSpriteHandler = genericHandler(IMG_REDIRECT_TEMPLATE, IMG_REGEX, 'img spritesheet'); 

chrome.webRequest.onBeforeRequest.addListener(
    imgSpriteHandler, 
    {
        urls: [
            IMG_SCHEME
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
); 

const PET_REDIRECT_TEMPLATE = 'https://the-doctorpus.github.io/doc-assets/images/custom/pets/';
const PET_SCHEME = '*://*.deeeep.io/custom/pets/*'
const PET_REGEX = /.+\/pets\/(?<filename>[^?]+)(?:\?.*)?$/

const petHandler = genericHandler(PET_REDIRECT_TEMPLATE, PET_REGEX, 'pet'); 

chrome.webRequest.onBeforeRequest.addListener(
    petHandler, 
    {
        urls: [
            PET_SCHEME
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
); 

const SKIN_REDIRECT_TEMPLATE = 'https://the-doctorpus.github.io/doc-assets/images/skans/'; // redirect URLs are all from this
const CDN_SKIN_REDIRECT_TEMPLATE = 'https://the-doctorpus.github.io/doc-assets/images/skans/custom/'; // redirect URLs are all from this
const SKIN_SCHEME = '*://*.deeeep.io/assets/skins/*'; // these urls will be redirected like skins
const CDN_SKIN_SCHEME = '*://cdn.deeeep.io/custom/skins/*';
const SKIN_REGEX = /.+\/skins\/(?<filename>[^?]+)(?:\?.*)?$/; // might it be a valid skin? 
const CDN_REGEX = /skins\/(?:(?<skin_name>[A-Za-z]+)|(?:(?<skin_id>[0-9]+)(?<version>-[0-9]+)(?<post_version>(?<extra_asset_name>-[A-Za-z0-9-_]+)?)))(?<suffix>\.[a-zA-Z0-9]+)/;
// skins submitted through Creators Center have a special scheme and must be stripped of their version number

const nonCDNSkinHandler = genericHandler(SKIN_REDIRECT_TEMPLATE, SKIN_REGEX, 'non-CDN skin');
const CDNSkinHandler = genericHandler(CDN_SKIN_REDIRECT_TEMPLATE, CDN_REGEX, 'CDN skin', ['skin_name', 'skin_id', 'post_version', 'suffix']);

chrome.webRequest.onBeforeRequest.addListener(
    nonCDNSkinHandler,
    {
        urls: [
            SKIN_SCHEME,
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
); 

chrome.webRequest.onBeforeRequest.addListener(
    CDNSkinHandler,
    {
        urls: [
            CDN_SKIN_SCHEME,
        ],
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking"]
);

const MISC_REDIRECT_TEMPLATE = 'https://the-doctorpus.github.io/doc-assets/images/misc/'; // redirect URLs are all from this
const MISC_SCHEME = '*://*.deeeep.io/assets/*'; // these urls will be redirected like ui sprites
const MISC_REGEX = /.+\/assets\/(?<filename>[^/?]+)(?:\?.*)?$/ // might it be a valid ui sprite? 

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