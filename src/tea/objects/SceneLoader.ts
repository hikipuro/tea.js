import * as Tea from "../Tea";

export class SceneLoader {
	static load(app: Tea.App, json: any, callback: (scene: Tea.Scene) => void): void {
		if (json == null || json._type !== "Scene") {
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
		if (json == null || json._type !== "Object3D") {
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
			var componentClass = Tea[item._type];
			if (componentClass == null) {
				onLoad();
				continue;
			}
			if (componentClass.fromJSON == null) {
				console.error("componentClass.fromJSON not found:", item._type);
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
}
