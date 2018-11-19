import * as Tea from "../Tea";

export class ScriptLoader {
	static load(app: Tea.App, path: string, callback: (script: Tea.Script) => void): void {
		const maxMatchLength = 2048;
		if (app.isEditing) {
			var index = path.indexOf("assets");
			if (index !== 0) {
				path = "assets/" + path;
			}
		}
		Tea.File.readText(path, (err: any, data: string) => {
			if (err) {
				console.error(err);
				callback(null);
				return;
			}
			var match = data.substr(0, maxMatchLength).match(/class\s+([^{\s]+)/);
			if (match == null || match.length < 2) {
				console.warn("class not found [" + path + "]");
				callback(null);
				return;
			}
			var className = match[1];
			var factory = new Function(
				"Tea",
				"app",
				data + "\nreturn " + className + ";"
			);
			var classRef = factory(Tea, app);
			Object.setPrototypeOf(classRef.prototype, new Tea.Script(app));
			var instance = new classRef() as Tea.Script;
			if (instance == null) {
				console.warn("cannot instantiate [" + path + "]");
				callback(null);
				return;
			}
			if (app.isEditing) {
				var index = path.indexOf("assets");
				if (index === 0) {
					path = path.substr(7);
				}
			}
			instance.path = path;
			callback(instance);
		});
	}
}
