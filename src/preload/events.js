window.bfe = {};
// game-load
// first-game-load
window.bfe.firstLoad = true;
document.querySelector("button.play").addEventListener("click", () => {
	window.blockyfish.emit("play-button-click");
	if (document.querySelector(".playing")) return;
	console.log("Play button clicked");
	const openObserver = new MutationObserver(() => {
		if (document.querySelector(".playing")) {
			openObserver.disconnect();
			if (window.bfe.firstLoad) {
				window.blockyfish.emit("first-game-load");
			} else {
				window.blockyfish.emit("game-load");
			}
			window.bfe.firstLoad = false;
		}
	});
	openObserver.observe(document.getElementById("app"), {
		attributes: false,
		childList: true,
		characterData: false,
		subtree: true
	});
});
