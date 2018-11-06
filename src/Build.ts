import * as Tea from "./tea/Tea";

export class Main {
	app: Tea.App;
	constructor() {
		var app = new Tea.App("canvas", {
			antialias: false,
			alpha: false,
			//premultipliedAlpha: false
		});
		this.app = app;
		//app.width = this.app.canvas.parentElement.clientWidth;
		//app.height = this.app.canvas.parentElement.clientHeight;
		if (window["Tea"].width) {
			app.width = window["Tea"].width;
		}
		if (window["Tea"].height) {
			app.height = window["Tea"].height;
		}
		Tea.File.readText("scene.json", (err, data) => {
			if (err) {
				console.log(err);
				return;
			}
			var json = JSON.parse(data);
			var scene = app.createSceneFromJSON(json);
			app.setScene(scene);
			app.start();
		});
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
