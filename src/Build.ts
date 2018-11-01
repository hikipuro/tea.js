import * as Tea from "./tea/Tea";

export class Main {
	app: Tea.App;
	constructor() {
		this.app = new Tea.App("canvas", {
			antialias: false,
			alpha: false,
			//premultipliedAlpha: false
		});
		this.app.width = this.app.canvas.parentElement.clientWidth;
		this.app.height = this.app.canvas.parentElement.clientHeight;
	}
}

var main: Main = null;
var loaded = () => {
	document.removeEventListener(
		"DOMContentLoaded", loaded
	);
	main = new Main();
};
document.addEventListener(
	"DOMContentLoaded", loaded
);
