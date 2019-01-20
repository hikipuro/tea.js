import * as Tea from "../Tea";
import { SequentialLoader } from "../utils/SequentialLoader";

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
		var length = json.children.length;
		var loader = new SequentialLoader(length, scene);
		loader.on("load", (i: number) => {
			var item = json.children[i];
			this.loadObject3D(app, item, (object3d: Tea.Object3D) => {
				if (object3d != null) {
					scene.addChild(object3d);
				}
				loader.next();
			});
		});
		loader.once("complete", callback);
		loader.start();
	}

	static loadObject3D(app: Tea.App, json: any, callback: (object3d: Tea.Object3D) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Tea.Object3D.className) === false) {
			callback(null);
			return;
		}
		var object3d = new Tea.Object3D(app, json.id);
		if (json.name != null) {
			object3d.name = json.name;
		}
		if (json.enabled != null) {
			object3d.enabled = json.enabled;
		}
		if (json.localPosition != null) {
			object3d.localPosition = Tea.Vector3.fromArray(json.localPosition);
		}
		if (json.localRotation != null) {
			object3d.localRotation = Tea.Quaternion.fromArray(json.localRotation);
		}
		if (json.localScale != null) {
			object3d.localScale = Tea.Vector3.fromArray(json.localScale);
		}
		object3d.update();
		this.loadComponents(app, json, object3d, () => {
			this.loadChildren(app, json, object3d, () => {
				callback(object3d);
			});
		});
	}

	protected static loadChildren(app: Tea.App, json: any, object3d: Tea.Object3D, callback: () => void): void {
		if (json == null
		||  json.children == null
		||  json.children.length <= 0) {
			callback();
			return;
		}
		var length = json.children.length;
		var loader = new SequentialLoader(length);
		loader.on("load", (i: number) => {
			var item = json.children[i];
			if (item == null) {
				loader.next();
				return;
			}
			this.loadObject3D(app, item, (child: Tea.Object3D) => {
				if (child != null) {
					object3d.addChild(child, false);
				}
				loader.next();
			});
		});
		loader.once("complete", callback);
		loader.start();
	}

	protected static loadComponents(app: Tea.App, json: any, object3d: Tea.Object3D, callback: () => void): void {
		if (json == null
		||  json.components == null
		||  json.components.length <= 0) {
			callback();
			return;
		}
		var typeName = Tea.JSONUtil.TypeName;
		var length = json.components.length;
		var loader = new SequentialLoader(length);
		loader.on("load", (i: number) => {
			var item = json.components[i];
			if (item == null) {
				loader.next();
				return;
			}
			var componentClass = Tea[item[typeName]];
			if (componentClass == null) {
				componentClass = Tea.UI[item[typeName]];
			}
			if (componentClass == null) {
				loader.next();
				return;
			}
			if (item[typeName] === Tea.Script.className) {
				this.loadScript(app, item, (component: Tea.Component) => {
					if (component != null) {
						component.object3d = object3d;
						object3d.addComponentInstance(component);
					}
					loader.next();
				});
				return;
			}
			if (componentClass.fromJSON == null) {
				console.error("componentClass.fromJSON not found:", item[typeName]);
				loader.next();
				return;
			}
			componentClass.fromJSON(app, item, (component: Tea.Component) => {
				if (component != null) {
					component.object3d = object3d;
					object3d.addComponentInstance(component);
				}
				loader.next();
			});
		});
		loader.once("complete", callback);
		loader.start();
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
