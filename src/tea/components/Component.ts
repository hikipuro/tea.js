import * as Tea from "../Tea";

export class Component {
	static editorView: any;
	static readonly className: string = "Component";
	app: Tea.App;
	object3d: Tea.Object3D;
	enabled: boolean;

	constructor(app: Tea.App) {
		this.app = app;
		this.enabled = true;
		this.object3d = null;
	}

	static fromComponentJSON(app: Tea.App, json: any): Tea.Component {
		if (json == null) {
			return null;
		}
		var componentClass = Tea[json[Tea.JSONUtil.TypeName]];
		if (componentClass == null) {
			return null;
		}
		if (componentClass.fromJSON == null) {
			return null;
		}
		return componentClass.fromJSON(app, json);
	}

	static createInstance(app: Tea.App, name: string): Tea.Component {
		return new Tea[name](app);
	}

	get className(): string {
		return this.constructor.name;
	}

	destroy(): void {
		this.app = undefined;
		this.object3d = undefined;
		this.enabled = undefined;
	}

	update(): void {
	}

	//lateUpdate(): void {
	//}

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(Component.className);
		json.enabled = this.enabled;
		return json;
	}
}
