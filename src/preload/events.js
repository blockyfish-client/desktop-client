function initializeEvents() {
	try {
		if (!window.bfe) {
			window.bfe = {};
		}

		// GAME UI LISTENERS
		// death
		window.bfe.deathScreenObserving = false;
		document.querySelector("button.play").addEventListener("click", () => {
			window.blockyfish.emit("play-button-click");
			// death event
			if (window.bfe.deathScreenObserving) return;
			const deathScreenObserver = new MutationObserver(() => {
				if (document.querySelector(".death-screen-container")) {
					deathScreenObserver.disconnect();
					window.bfe.deathScreenObserving = false;
					window.blockyfish.emit("death");
				}
			});
			deathScreenObserver.observe(document.getElementById("app"), {
				attributes: false,
				childList: true,
				characterData: false,
				subtree: true,
			});
			window.bfe.deathScreenObserving = true;
		});

		// MODAL LISTENERS
		// settings-open/close
		(() => {
			let settingsOpen = false;
			const modalObserver = new MutationObserver(() => {
				// settings
				if (
					document.querySelector(
						".modal-content #pane-0 ~ #pane-1 ~ #pane-2"
					)
				) {
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
				subtree: true,
			});
		})();

		// signin-open/close
		(() => {
			let signinOpen = false;
			const modalObserver = new MutationObserver(() => {
				// settings
				if (document.querySelector("a[href^='/signup']")) {
					if (!signinOpen) {
						signinOpen = true;
						window.blockyfish.emit("signin-open");
					}
				} else {
					signinOpen = false;
				}
			});
			modalObserver.observe(document.getElementById("app"), {
				attributes: false,
				childList: true,
				characterData: false,
				subtree: true,
			});
		})();
	} catch {
		setTimeout(() => initializeEvents(), 500);
	}
}
initializeEvents();
