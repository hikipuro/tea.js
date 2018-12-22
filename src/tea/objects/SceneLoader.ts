import * as Tea from "../Tea";

export class SceneLoader {
	static load(app: Tea.App, json: any, callback: (scene: Tea.Scene) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Tea.Scene.className) === false) {
			callback(null);
			return;
		}
		var scene = new Tea.Scene(app);
		scene.physics = Tea.Physics.fromJSON(app, json.physics);
		scene.renderSettings = Tea.RenderSettings.fromJSON(app, json.renderSettings);
		scene.enablePostProcessing = json.enablePostProcessing;
		if (json.children == null || json.children.length <= 0) {
			callback(scene);
			return;
		}
		var loaded = 0;
		var length = json.children.length;
		for (var i = 0; i < length; i++) {
			var item = json.children[i];
			this.loadObject3D(app, item, (object3d: Tea.Object3D) => {
				if (object3d != null) {
					scene.addChild(object3d);
				}
				loaded++;
				if (loaded >= length) {
					callback(scene);
				}
			});
		}
	}

	static loadObject3D(app: Tea.App, json: any, callback: (object3d: Tea.Object3D) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Tea.Object3D.className) === false) {
			callback(null);
			return;
		}
		var object3d = new Tea.Object3D(app);
		object3d.name = json.name;
		object3d.isActive = json.isActive;
		object3d.localPosition = Tea.Vector3.fromArray(json.localPosition);
		object3d.localRotation = Tea.Quaternion.fromArray(json.localRotation);
		object3d.localScale = Tea.Vector3.fromArray(json.localScale);

		var loaded = 0;
		var total = 0;
		var length = 0;
		if (json.components) {
			length = json.components.length;
			total += length;
		}
		if (json.children) {
			total += json.children.length;
		}
		if (total <= 0) {
			callback(object3d);
			return;
		}

		var onLoad = (): void => {
			loaded++;
			if (loaded >= total) {
				callback(object3d);
				onload = undefined;
			}
		}

		for (var i = 0; i < length; i++) {
			var item = json.components[i];
			var componentClass = Tea[item[Tea.JSONUtil.TypeName]];
			if (componentClass == null) {
				onLoad();
				continue;
			}
			if (item[Tea.JSONUtil.TypeName] === Tea.Script.className) {
				this.loadScript(app, item, (component: Tea.Component) => {
					if (component != null) {
						component.object3d = object3d;
						object3d.addComponentInstance(component);
					}
					onLoad();
				});
				continue;
			}
			if (componentClass.fromJSON == null) {
				console.error("componentClass.fromJSON not found:", item[Tea.JSONUtil.TypeName]);
				onLoad();
				continue;
			}
			componentClass.fromJSON(app, item, (component: Tea.Component) => {
				if (component != null) {
					component.object3d = object3d;
					object3d.addComponentInstance(component);
				}
				onLoad();
			});
		}
		length = 0;
		if (json.children) {
			length = json.children.length;
		}
		for (var i = 0; i < length; i++) {
			var item = json.children[i];
			this.loadObject3D(app, item, (child: Tea.Object3D) => {
				if (child != null) {
					object3d.addChild(child);
				}
				onLoad();
			});
		}
	}

	protected static loadScript(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Tea.Script.className) === false) {
			callback(null);
			return;
		}
		var path = json.path;
		if (path == null || path === "") {
			callback(null);
			return;
		}
		if (app.status.isEditor) {
			path = process.cwd() + "/assets/" + path;
		}
		Tea.ScriptLoader.load(
			app, path,
			(script: Tea.Script) => {
				if (script == null) {
					callback(script);
					return;
				}
				script.enabled = json.enabled;
				var members = json.members as Array<any>;
				if (members && members.length != null) {
					members.forEach((member: any) => {
						var key = member.key;
						var value = member.value;
						if (typeof value === "object") {
							// TODO: read object
							script[key] = member.value;
							return;
						}
						script[key] = member.value;
					});
				}
				callback(script);
			}
		);
	}
}
