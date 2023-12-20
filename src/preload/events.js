let scriptExecuted = false;
document.querySelector("button.play").addEventListener("click", () => {
	console.log("Play button clicked");
	if (!document.querySelector(".playing")) scriptExecuted = false;
	const openObserver = new MutationObserver(() => {
		if (document.contains(document.querySelector(".playing"))) {
			openObserver.disconnect();
			scriptExecuted = true;
			if (scriptExecuted) {
				window.blockyfish.emit("game-load");
			} else {
				window.blockyfish.emit("first-game-load");
			}
		}
	});
	openObserver.observe(document.getElementById("app"), {
		attributes: false,
		childList: true,
		characterData: false,
		subtree: true
	});
});
