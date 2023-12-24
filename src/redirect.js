const https = require("https");

const checkedUrls = [];
const redirectUrls = [];

function genericRedirectHandler(regex, target, custom_type) {
	return (details, callback) => {
		var url = details.url;
		var newUrl = url.replace(regex, target);
		if (custom_type == "skin") {
			var skinParams = /skins\/(?:(?<skin_name>[A-Za-z]+)|(?:(?<skin_id>[0-9]+)(?<version>-[0-9]+)(?<post_version>(?<extra_asset_name>-[A-Za-z0-9-_]+)?)))(?<suffix>\.[a-zA-Z0-9]+)/.exec(details.url).groups;
			var strippedSkin = (skinParams.skin_id || skinParams.skin_name) + skinParams.suffix;
			newUrl = target + "/" + strippedSkin;
		}
		// console.log(newUrl);
		if (!checkedUrls.includes(url)) {
			https.get(newUrl, (res) => {
				if (res.statusCode == 200) {
					url = newUrl;
					redirectUrls.push(url);
					// console.log(`Redirecting to ${newUrl}`);
					callback({ redirectURL: url });
				} else {
					// console.log(`Failed to redirect to ${newUrl}`);
					callback({});
				}
			});
			checkedUrls.push(url);
		} else {
			if (redirectUrls.includes(url)) {
				callback({ redirectURL: url });
			} else {
				callback({});
			}
		}
	};
}

module.exports = { genericRedirectHandler };
