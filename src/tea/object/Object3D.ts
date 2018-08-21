import * as Tea from "../Tea";

export class Object3D {
	app: Tea.App;
	name: string;
	enabled: boolean;
	scene: Tea.Scene;
	transform: Tea.Transform;
	position: Tea.Vector3;
	rotation: Tea.Quaternion;
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
		this.rotation = Tea.Quaternion.identity;
		this.scale = Tea.Vector3.one;
		this.scripts = [];
		this.children = [];
		this._components = [];
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		if (this.parent != null) {
			var m = this.parent.localToWorldMatrix;
			m = m.mul(Tea.Matrix4x4.trs(
				this.position,
				this.rotation,
				this.scale
			));
			m.toggleHand();
			return m;
		}
		var m = Tea.Matrix4x4.trs(
			this.position,
			this.rotation,
			this.scale
		);
		m.toggleHand();
		return m;
	}

	toString(): string {
		return JSON.stringify(this);
	}

	addComponent<T extends Tea.Component>(component: new (app: Tea.App) => T): T {
		if (component == null) {
			return;
		}
		var c = new component(this.app);
		c.object3d = this;
		this._components.push(c);
		return c;
	}

	getComponent<T extends Tea.Component>(component: {new (app: Tea.App): T}): T {
		var components = this._components;
		var length = components.length;
		for (var i = 0; i < length; i++) {
			const c = components[i];
			if (c instanceof component) {
				return c as T;
			}
		}
		return null;
	}

	getComponents<T extends Tea.Component>(component: {new (app: Tea.App): T}): Array<T> {
		var array = [];
		var components = this._components;
		var length = components.length;
		for (var i = 0; i < length; i++) {
			const c = components[i];
			if (c instanceof component) {
				array.push(c);
			}
		}
		return array;
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

	isChildOf(parent: Object3D): boolean {
		if (parent == null) {
			return false;
		}
		if (parent === this) {
			return true;
		}
		var found = false;
		Tea.ArrayUtil.each(parent.children, (i, child) => {
			if (child === this) {
				found = true;
				return false;
			}
		});
		if (found) {
			return true;
		}
		Tea.ArrayUtil.each(parent.children, (i, child) => {
			if (this.isChildOf(child)) {
				found = true;
				return false;
			}
		});
		return found;
	}

	getSiblingIndex(): number {
		if (this.parent == null) {
			return 0;
		}
		var index = 0;
		Tea.ArrayUtil.each(this.parent.children, (i, child) => {
			if (child === this) {
				index = i;
				return false;
			}
		});
		return index;
	}

	detachChildren(): void {
		Tea.ArrayUtil.each(this.children, (i, child) => {
			child.parent = null;
		});
		this.children = [];
	}

	find(name: string): Object3D {
		var object3d = null;
		Tea.ArrayUtil.each(this.children, (i, child) => {
			if (child.name === name) {
				object3d = child;
				return false;
			}
		});
		return object3d;
	}

	translate(x: number, y: number, z: number): void {
		this.position.add(new Tea.Vector3(x, y, z));
	}

	rotate(eulerAngles: Tea.Vector3): void;
	rotate(xAngle: number, yAngle: number, zAngle: number): void;
	rotate(a: number | Tea.Vector3, b: number = 0, c: number = 0): void {
		if (a instanceof Tea.Vector3) {
			var q = Tea.Quaternion.euler(a);
			this.rotation.mul$(q);
			return;
		}
		var q = Tea.Quaternion.euler(a, b, c);
		this.rotation.mul$(q);
	}

	rotateAround(point: Tea.Vector3, axis: Tea.Vector3, angle: number): void {
		var q = Tea.Quaternion.euler(axis.normalized.mul(angle));
		var p = this.position.sub(point);
		this.rotation.mul$(q);
		this.position = point.add(q.mul(p));
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
		Tea.ArrayUtil.each(this.scripts, (i, script) => {
			script.start();
		});
	}

	update(): void {
		Tea.ArrayUtil.each(this.scripts, (i, script) => {
			script.update();
		});
	}
}
