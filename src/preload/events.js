window.bfe = {};

// GAME UI LISTENERS
// game-load
// first-game-load
// death
window.bfe.firstLoad = true;
document.querySelector("button.play").addEventListener("click", () => {
	window.blockyfish.emit("play-button-click");
	if (document.querySelector(".playing")) return;
	console.log("Play button clicked");
	const playObserver = new MutationObserver(() => {
		if (document.querySelector(".playing")) {
			playObserver.disconnect();
			if (window.bfe.firstLoad) {
				window.blockyfish.emit("first-game-load");
			} else {
				window.blockyfish.emit("game-load");
			}
			window.bfe.firstLoad = false;

			// death event
			const deathScreenObserver = new MutationObserver(() => {
				if (document.querySelector(".death-screen-container")) {
					deathScreenObserver.disconnect();
					window.blockyfish.emit("death");
				}
			});
			deathScreenObserver.observe(document.getElementById("app"), {
				attributes: false,
				childList: true,
				characterData: false,
				subtree: true
			});
		}
	});
	playObserver.observe(document.getElementById("app"), {
		attributes: false,
		childList: true,
		characterData: false,
		subtree: true
	});
});

// MODAL LISTENERS
// settings-open/close
(() => {
	var settingsOpen = false;
	const modalObserver = new MutationObserver(() => {
		// settings
		if (document.querySelector(".modal-content #pane-0 ~ #pane-1 ~ #pane-2")) {
			if (!settingsOpen) {
				settingsOpen = true;
				window.blockyfish.emit("settings-open");
			}
		} else {
			settingsOpen = false;
		}
	});
	modalObserver.observe(document.getElementById("app"), {
		attributes: false,
		childList: true,
		characterData: false,
		subtree: true
	});
})();
