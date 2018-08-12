import * as Tea from "../Tea";

export class Object3D {
	app: Tea.App;
	name: string;
	enabled: boolean;
	scene: Tea.Scene;
	position: Tea.Vector3;
	rotation: Tea.Vector3;
	scale: Tea.Vector3;
	scripts: Array<Tea.Script>;
	parent: Object3D;
	children: Array<Object3D>;
	protected _renderer: Tea.Renderer;

	constructor(app: Tea.App) {
		this.name = "";
		this.enabled = true;
		this.app = app;
		this.position = Tea.Vector3.zero;
		this.rotation = Tea.Vector3.zero;
		this.scale = Tea.Vector3.one;
		this.scripts = [];
		this.children = [];
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

	get localToWorldMatrix(): Tea.Matrix4 {
		let m = Tea.Matrix4.identity;
		if (this.parent != null) {
			m = m.mul(this.parent.localToWorldMatrix);
		}
		m = m.mul(Tea.Matrix4.translate(this.position));
		m = m.mul(Tea.Matrix4.rotateZXY(this.rotation));
		m = m.mul(Tea.Matrix4.scale(this.scale));
		return m;
	}

	toString(): string {
		return JSON.stringify(this);
	}

	appendChild(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		object3d.parent = this;
		this.children.push(object3d);
	}

	getChild(index: number): Object3D {
		return this.children[index];
	}

	detachChildren(): void {
		const children = this.children;
		const length = children.length;
		for (let i = 0; i < length; i++) {
			children[i].parent = null;
		}
		this.children = [];
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