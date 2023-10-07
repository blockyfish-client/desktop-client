window.blockyfish = new (require("../blockyfish.js").Blockyfish)();

const brand_css = document.createElement("style");
document.querySelector("body").appendChild(brand_css);
brand_css.outerHTML = '<link rel="stylesheet" href="https://blockyfish.netlify.app/themes/branding.css">';

const custom_css = document.createElement("style");
document.querySelector("body").appendChild(custom_css);
custom_css.outerHTML = '<link id="customcss" rel="stylesheet" href="https://blockyfish.netlify.app/themes/reefpenguin/theme.css">';

const adblock_css = document.createElement("style");
document.querySelector("body").appendChild(adblock_css);
adblock_css.outerHTML = `
<style>
    .ad-block {
        display: none !important;
        opacity: 0 !important;
    }
    .home-page.width-1 .sidebar.left,
    .home-page.width-2 .sidebar.left {
        bottom: 0 !important;
    }
</style>
`;

setInterval(() => {
	if (document.querySelector(".ad-block")) {
		document.querySelectorAll(".ad-block").forEach((el) => {
			el.remove();
		});
	}
});
