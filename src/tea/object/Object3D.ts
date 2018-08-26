import * as Tea from "../Tea";

export class Object3D {
	app: Tea.App;
	name: string;
	enabled: boolean;
	scene: Tea.Scene;
	transform: Tea.Transform;
	localPosition: Tea.Vector3;
	localRotation: Tea.Quaternion;
	localScale: Tea.Vector3;
	scripts: Array<Tea.Script>;
	parent: Object3D;
	children: Array<Object3D>;
	protected _components: Array<Tea.Component>;

	constructor(app: Tea.App) {
		this.app = app;
		this.name = "";
		this.enabled = true;
		this.localPosition = Tea.Vector3.zero;
		this.localRotation = Tea.Quaternion.identity;
		this.localScale = Tea.Vector3.one;
		this.scripts = [];
		this.children = [];
		this._components = [];
	}

	static createPrimitive(app: Tea.App, type: Tea.PrimitiveType): Object3D {
		var name: string = "";
		var mesh: Tea.Mesh = null;
		switch (type) {
			case Tea.PrimitiveType.Sphere:
				name = "Sphere";
				mesh = Tea.Primitives.createSphereMesh(10, 10);
				break;
			case Tea.PrimitiveType.Capsule:
				name = "Capsule";
				mesh = Tea.Primitives.createCapsuleMesh(10, 10);
				break;
			case Tea.PrimitiveType.Cylinder:
				name = "Cylinder";
				mesh = Tea.Primitives.createCylinderMesh(20);
				break;
			case Tea.PrimitiveType.Cube:
				name = "Cube";
				mesh = Tea.Primitives.createCubeMesh();
				break;
			case Tea.PrimitiveType.Plane:
				name = "Plane";
				mesh = Tea.Primitives.createPlaneMesh(10);
				break;
			case Tea.PrimitiveType.Quad:
				name = "Quad";
				mesh = Tea.Primitives.createQuadMesh();
				break;
			default:
				return null;
		}
		var object3d = new Tea.Object3D(app);
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.Shader.defaultVertexShaderSource,
			Tea.Shader.defaultFragmentShaderSource
		);
		var renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.material.shader = shader;
		renderer.mesh = mesh;
		object3d.name = name;
		return object3d;
	}

	get position(): Tea.Vector3 {
		if (this.parent != null) {
			var p = this.parent.position;
			return p.add(this.localPosition);
		}
		return this.localPosition;
	}

	get rotation(): Tea.Quaternion {
		if (this.parent != null) {
			var r = this.parent.rotation;
			return r.mul(this.localRotation);
		}
		return this.localRotation;
	}

	get scale(): Tea.Vector3 {
		if (this.parent != null) {
			var s = this.parent.scale;
			return s.scale(this.localScale);
		}
		return this.localScale;
	}

	get localEulerAngles(): Tea.Vector3 {
		return this.localRotation.eulerAngles;
	}

	get eulerAngles(): Tea.Vector3 {
		return this.rotation.eulerAngles;
	}

	get childCount(): number {
		return this.children.length;
	}

	get forward(): Tea.Vector3 {
		return this.rotation.mul(Tea.Vector3.forward);
	}

	get up(): Tea.Vector3 {
		return this.rotation.mul(Tea.Vector3.up);
	}

	get right(): Tea.Vector3 {
		return this.rotation.mul(Tea.Vector3.right);
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		/*
		if (this.parent != null) {
			var m1 = this.parent.localToWorldMatrix;
			m1.toggleHand();
			var m2 = Tea.Matrix4x4.trs(
				this.position,
				this.rotation,
				this.scale
			);
			m1.mul$(m2);
			m1.toggleHand();
			return m1;
		}
		*/
		var m = Tea.Matrix4x4.trs(
			this.position,
			this.rotation,
			this.scale
		);
		/*
		var m = Tea.Matrix4x4.translate(this.position);
		m = m.mul(this.rotation.toMatrix4x4());
		m = m.mul(Tea.Matrix4x4.scale(this.scale));
		//*/
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

	translate(translation: Tea.Vector3): void;
	translate(x: number, y: number, z: number): void;
	translate(a: number | Tea.Vector3, b?: number, c?: number): void {
		if (a instanceof Tea.Vector3) {
			this.position.add(a);
			return;
		}
		this.position.add(new Tea.Vector3(a, b, c));
	}

	rotate(eulerAngles: Tea.Vector3): void;
	rotate(xAngle: number, yAngle: number, zAngle: number): void;
	rotate(a: number | Tea.Vector3, b?: number, c?: number): void {
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
		this.localRotation = q.mul(this.rotation);
		this.localPosition = point.add(q.mul(p));
	}

	lookAt(worldPosition: Tea.Vector3, worldUp?: Tea.Vector3): void;
	lookAt(target: Object3D, worldUp?: Tea.Vector3): void;
	lookAt(target: Object3D | Tea.Vector3, worldUp: Tea.Vector3 = Tea.Vector3.up): void {
		if (target instanceof Tea.Vector3) {
			var d = target.sub(this.position);
			var q = Tea.Quaternion.lookRotation(d, worldUp);
			this.localRotation = q;
			return;
		}
		var d = target.position.sub(this.position);
		var q = Tea.Quaternion.lookRotation(d, worldUp);
		this.localRotation = q;
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
