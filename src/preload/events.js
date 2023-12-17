let scriptExecuted = false;
document.querySelector("button.play").addEventListener("click", () => {
	console.log("Play button clicked");
	if (!document.querySelector(".playing")) scriptExecuted = false;
	if (scriptExecuted) return;
	const openObserver = new MutationObserver(() => {
		if (document.contains(document.querySelector(".playing"))) {
			openObserver.disconnect();
			scriptExecuted = true;
			window.blockyfish.emit(window.blockyfish.events.game_load);
		}
	});
	openObserver.observe(document.getElementById("app"), {
		attributes: false,
		childList: true,
		characterData: false,
		subtree: true
	});
});
