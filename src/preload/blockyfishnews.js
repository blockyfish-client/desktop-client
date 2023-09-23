document.querySelectorAll("div.ui div.sidebar.left > a").forEach((el) => {
	el.remove();
});

(async () => {
	const left_widget_container = document.querySelector("div.sidebar.left");
	left_widget_container.style.maxWidth = "30vw";
	left_widget_container.style.width = "21rem";
	const news_feed_box = document.querySelector("div.sidebar.right > div:nth-child(3)").cloneNode(true);
	left_widget_container.appendChild(news_feed_box);
	const tutorial_box = document.querySelector("div.sidebar.right > div:nth-child(3)").cloneNode(true);
	left_widget_container.appendChild(tutorial_box);

	document.querySelector("div.sidebar.left > div.ad-block")?.remove();
	document.querySelector("div.sidebar.left > div.home-widget:nth-child(1) > div.title").innerText = "Blockyfish News";
	document.querySelector("div.sidebar.left > div.home-widget:nth-child(1) > div:nth-child(2)").outerHTML = '<div id="blockyfish-news"></div>';

	document.querySelector("div.sidebar.left > div.home-widget:nth-child(2) > div.title").innerText = "How to play";
	document.querySelector("div.sidebar.left > div.home-widget:nth-child(2) > div:nth-child(2)").outerHTML = '<div id="tutorial"></div>';

	const blockyfish_news = document.getElementById("blockyfish-news");
	blockyfish_news.style.maxHeight = "30vh";
	blockyfish_news.style.overflow = "scroll";
	blockyfish_news.style.overflowX = "hidden";
	blockyfish_news.style.padding = "10px";
	blockyfish_news.style.fontSize = "small";

	const tutorial = document.getElementById("tutorial");
	tutorial.style.maxHeight = "30vh";
	tutorial.style.overflow = "scroll";
	tutorial.style.overflowX = "hidden";
	tutorial.style.padding = "10px";
	tutorial.style.fontSize = "small";

	(async () => {
		let news = await (await fetch("https://blockyfish.netlify.app/blockyfishfeed/news")).text();
		blockyfish_news.innerHTML = news;
	})();
	(async () => {
		let tut = await (await fetch("https://blockyfish.netlify.app/blockyfishfeed/tutorial")).text();
		tutorial.innerHTML = tut;
	})();
})();
