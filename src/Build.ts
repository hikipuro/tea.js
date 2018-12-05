import * as Tea from "./tea/Tea";

class Settings {
	width: number = 400;
	height: number = 400;
	canvasId: string = "canvas";
	sceneFile: string = "scene.json";

	constructor(json: any) {
		if (json == null || json.settings == null) {
			return;
		}
		Object.assign(this, json.settings);
	}
}

export class Main {
	app: Tea.App;
	constructor() {
		var tea = window["Tea"];
		var settings = new Settings(tea);
		var app = new Tea.App(settings.canvasId, {
			antialias: false,
			alpha: false,
			//premultipliedAlpha: false
		});
		this.app = app;
		app.width = settings.width;
		app.height = settings.height;
		Tea.File.readText(settings.sceneFile, (err, data) => {
			if (err) {
				console.log(err);
				return;
			}
			var json = JSON.parse(data);
			Tea.SceneLoader.load(app, json, (scene: Tea.Scene) => {
				if (scene == null) {
					console.log("error: load scene file", settings.sceneFile);
					return;
				}
				app.scene = scene;
				app.start();
			});
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
