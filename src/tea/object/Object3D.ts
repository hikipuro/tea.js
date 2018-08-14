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
	protected _components: Array<Tea.Component>;

	constructor(app: Tea.App) {
		this.name = "";
		this.enabled = true;
		this.app = app;
		this.position = Tea.Vector3.zero;
		this.rotation = Tea.Vector3.zero;
		this.scale = Tea.Vector3.one;
		this.scripts = [];
		this.children = [];
		this._components = [];
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		let m = Tea.Matrix4x4.identity;
		if (this.parent != null) {
			m = m.mul(this.parent.localToWorldMatrix);
		}
		m = m.mul(Tea.Matrix4x4.translate(this.position));
		m = m.mul(Tea.Matrix4x4.rotateZXY(this.rotation));
		m = m.mul(Tea.Matrix4x4.scale(this.scale));
		m.convertToLH();
		return m;
	}

	toString(): string {
		return JSON.stringify(this);
	}

	addComponent<T extends Tea.Component>(component: new (app: Tea.App) => T): T {
		if (component == null) {
			return;
		}
		const c = new component(this.app);
		c.object3d = this;
		this._components.push(c);
		return c;
	}

	getComponent<T extends Tea.Component>(component: {new (app: Tea.App): T}): T {
		const components = this._components;
		const length = components.length;
		for (var i = 0; i < length; i++) {
			const c = components[i];
			if (c instanceof component) {
				return c as T;
			}
		}
		return null;
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
		for (var i = 0; i < length; i++) {
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
		for (var i = 0; i < length; i++) {
			callback(scripts[i]);
		}
	}
}