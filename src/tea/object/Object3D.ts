import * as Tea from "../Tea";

export class Object3D {
	name: string;
	app: Tea.App;
	scene: Tea.Scene;
	position: Tea.Vector3;
	rotation: Tea.Vector3;
	scale: Tea.Vector3;
	scripts: Array<Tea.Script>;
	protected _renderer: Tea.Renderer;

	constructor(app: Tea.App) {
		this.name = "";
		this.app = app;
		this.position = Tea.Vector3.zero;
		this.rotation = Tea.Vector3.zero;
		this.scale = Tea.Vector3.one;
		this.scripts = [];
	}

	get renderer(): Tea.Renderer {
		return this._renderer;
	}
	set renderer(value: Tea.Renderer) {
		if (this._renderer != null) {
			this._renderer.object3d = null;
		}
		value.object3d = this;
		this._renderer = value;
	}

	toString(): string {
		return JSON.stringify(this);
	}

	addScript(script: Tea.Script): void {
		if (script == null) {
			return;
		}
		script.app = this.app;
		script.object3d = this;
		this.scripts.push(script);
	}

	start(): void {
		this.forEachScript((script) => {
			script.start();
		});
	}

	update(): void {
		//console.log("update Object3D:", this.name);
		this.forEachScript((script) => {
			script.update();
		});
		if (this.renderer != null) {
			this.renderer.render();
		}
	}

	protected forEachScript(callback: (script: Tea.Script) => void): void {
		if (this.scripts == null) {
			return;
		}
		const scripts = this.scripts;
		const length = scripts.length;
		for (let i = 0; i < length; i++) {
			callback(scripts[i]);
		}
	}
}