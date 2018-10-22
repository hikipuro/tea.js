import * as Tea from "../Tea";

class Movement {
	position: Tea.Vector3;
	rotation: Tea.Quaternion;
	scale: Tea.Vector3;
	localToWorldMatrix: Tea.Matrix4x4;
	worldToLocalMatrix: Tea.Matrix4x4;
	isMovedPrevFrame: boolean;

	constructor() {
		this.position = new Tea.Vector3(0.001, 0.002, 0.003);
		this.rotation = new Tea.Quaternion(0.001, 0.002, 0.003);
		this.scale = new Tea.Vector3(0.001, 0.002, 0.003);
		this.localToWorldMatrix = new Tea.Matrix4x4();
		this.worldToLocalMatrix = new Tea.Matrix4x4();
	}

	destroy(): void {
		this.position = undefined;
		this.rotation = undefined;
		this.scale = undefined;
		this.localToWorldMatrix = undefined;
		this.worldToLocalMatrix = undefined;
	}

	update(object3d: Object3D): void {
		var isMoved = this.isMoved(object3d);
		this.isMovedPrevFrame = isMoved;
		if (isMoved) {
			this.trs();
		}
	}

	isMoved(object3d: Object3D): boolean {
		var p = object3d.position;
		var r = object3d.rotation;
		var s = object3d.scale;
		var b = false;
		if (!this.position.equals(p)) {
			b = true;
			this.position.copy(p);
		}
		if (!this.rotation.equals(r)) {
			b = true;
			this.rotation.copy(r);
		}
		if (!this.scale.equals(s)) {
			b = true;
			this.scale.copy(s);
		}
		return b;
	}

	trs(): void {
		this.localToWorldMatrix.setTRS(
			this.position,
			this.rotation,
			this.scale
		);
		this.localToWorldMatrix.toggleHand();
		this.worldToLocalMatrix = this.localToWorldMatrix.inverse;
	}
}

export class Object3D {
	protected static _nextId: number = 0;
	app: Tea.App;
	id: number;
	name: string;
	isActive: boolean;
	scene: Tea.Scene;
	localPosition: Tea.Vector3;
	localRotation: Tea.Quaternion;
	localScale: Tea.Vector3;
	children: Array<Object3D>;
	tag: string;
	layer: number;
	protected _m: Movement;
	protected _parent: Object3D;
	protected _components: Array<Tea.Component>;
	protected _toDestroy: boolean;

	constructor(app: Tea.App) {
		this.app = app;
		this.id = Object3D._nextId++;
		this.name = "";
		this.isActive = true;
		this.scene = null;
		this.localPosition = Tea.Vector3.zero.clone();
		this.localRotation = Tea.Quaternion.identity.clone();
		this.localScale = Tea.Vector3.one.clone();
		this.children = [];
		this.tag = "";
		this.layer = 0;
		this._m = new Movement();
		this._parent = null;
		this._components = [];
		this._toDestroy = false;
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
		object3d.name = name;
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.defaultVS,
			Tea.ShaderSources.defaultFS
		);
		var meshFilter = object3d.addComponent(Tea.MeshFilter);
		meshFilter.mesh = mesh;
		var renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.material.shader = shader;
		return object3d;
	}

	get isMoved(): boolean {
		return this._m.isMovedPrevFrame;
	}

	get isActiveInHierarchy(): boolean {
		if (this._parent != null) {
			return this._parent.isActiveInHierarchy
				&& this.isActive;
		}
		return this.isActive;
	}

	get parent(): Object3D {
		return this._parent;
	}
	set parent(value: Object3D) {
		var scene = this.scene;
		var parent = this._parent;
		if (parent === value || value === this) {
			return;
		}
		if (parent == null && value == null) {
			return;
		}
		if (value != null && value._parent == this) {
			return;
		}
		if (parent != null && value == null) {
			this._parent = null;
			parent.adjustChildPosition(this, false);
			var index = parent.children.indexOf(this);
			parent.children.splice(index, 1);
			if (scene != null) {
				this.scene = null;
				scene.removeComponents(this);
				var children = this.children;
				var length = children.length;
				for (var i = 0; i < length; i++) {
					var child = children[i];
					if (child == null) {
						continue;
					}
					child.scene = null;
					scene.removeComponents(child);
				}
			}
			return;
		}
		if (parent != null) {
			parent.adjustChildPosition(this, false);
			var index = parent.children.indexOf(this);
			parent.children.splice(index, 1);
		}
		this._parent = value;
		value.adjustChildPosition(this, true);
		value.children.push(this);
		if (scene != null && scene.childIndex(this) >= 0) {
			scene.removeChild(this);
		}
		scene = value.scene;
		if (scene != null) {
			this.scene = scene;
			scene.addComponents(this);
			var children = this.children;
			var length = children.length;
			for (var i = 0; i < length; i++) {
				var child = children[i];
				if (child == null) {
					continue;
				}
				child.scene = scene;
				scene.addComponents(child);
			}
		}
	}

	get position(): Tea.Vector3 {
		if (this._parent != null) {
			var p = this._parent.position;
			var r = this._parent.rotation;
			var s = this._parent.scale;
			var lp = this.localPosition.clone();
			lp.scale$(s);
			lp.applyQuaternion(r);
			return lp.add$(p);
		}
		return this.localPosition;
	}

	set position(value: Tea.Vector3) {
		if (this._parent != null) {
			var p = this._parent.position;
			var r = this._parent.rotation;
			var s = this._parent.scale.clone();
			p = value.sub(p);
			p.applyQuaternion(r.inversed);
			this.reverseScale$(s);
			p.scale$(s);
			this.localPosition = p;
			return;
		}
		this.localPosition.copy(value);
	}

	get rotation(): Tea.Quaternion {
		if (this._parent != null) {
			var r = this._parent.rotation;
			return r.mul(this.localRotation);
		}
		return this.localRotation;
	}

	set rotation(value: Tea.Quaternion) {
		if (this._parent != null) {
			var r = this._parent.rotation;
			this.localRotation = r.inversed.mul(value);
			return;
		}
		this.localRotation.copy(value);
	}

	get scale(): Tea.Vector3 {
		if (this._parent != null) {
			var s = this._parent.scale;
			return s.scale(this.localScale);
		}
		return this.localScale;
	}

	set scale(value: Tea.Vector3) {
		if (this._parent != null) {
			var s = this._parent.scale.clone();
			this.reverseScale$(s);
			this.localScale = value.scale(s);
			return;
		}
		this.localScale.copy(value);
	}

	get localEulerAngles(): Tea.Vector3 {
		return this.localRotation.eulerAngles;
	}

	set localEulerAngles(value: Tea.Vector3) {
		this.localRotation.setEuler(value);
	}

	get eulerAngles(): Tea.Vector3 {
		return this.rotation.eulerAngles;
	}

	set eulerAngles(value: Tea.Vector3) {
		this.rotation.setEuler(value);
	}

	get childCount(): number {
		return this.children.length;
	}

	get forward(): Tea.Vector3 {
		var f = Tea.Vector3.forward.clone();
		f.applyQuaternion(this.rotation);
		return f;
	}

	get up(): Tea.Vector3 {
		var u = Tea.Vector3.up.clone();
		u.applyQuaternion(this.rotation);
		return u;
	}

	get right(): Tea.Vector3 {
		var r = Tea.Vector3.right.clone();
		r.applyQuaternion(this.rotation);
		return r;
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		return this._m.localToWorldMatrix;
		/*
		var m = Tea.Matrix4x4.trs(
			this.position,
			this.rotation,
			this.scale
		);
		m.toggleHand();
		return m;
		//*/
	}

	get worldToLocalMatrix(): Tea.Matrix4x4 {
		return this._m.worldToLocalMatrix;
	}

	get root(): Tea.Object3D {
		if (parent == null) {
			return this;
		}
		return this._parent.root;
	}

	destroy(): void {
		this._toDestroy = true;
	}

	protected _destroy(): void {
		if (this.scene != null) {
			this.scene.removeComponents(this);
			this.scene.removeChild(this);
		}
		this.parent = null;
		var length = this.children.length;
		for (var i = length - 1; i >= 0; i--) {
			var child = this.children[i];
			child._destroy();
			delete this.children[i];
		}
		var keys = Object.keys(this._components);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			this._components[key].destroy();
			delete this._components[key];
		}
		this.children = [];
		this.app = undefined;
		this.name = undefined;
		this.isActive = undefined;
		this.scene = undefined;
		this.localPosition = undefined;
		this.localRotation = undefined;
		this.localScale = undefined;
		this._m.destroy();
		this._m = undefined;
		this._components = [];
		this._toDestroy = undefined;
		this.id = undefined;
	}

	toString(): string {
		return JSON.stringify(this);
	}

	toJSON(): Object {
		var json = {
			_type: "Object3D",
			name: this.name,
			isActive: this.isActive,
			localPosition: this.localPosition,
			localRotation: this.localRotation,
			localScale: this.localScale,
			components: [],
			children: []
		};
		var length = this._components.length;
		for (var i = 0; i < length; i++) {
			var component = this._components[i];
			if (component == null) {
				continue;
			}
			json.components.push(component.toJSON());
		}
		length = this.children.length;
		for (var i = 0; i < length; i++) {
			var child = this.children[i];
			if (child == null) {
				continue;
			}
			json.children.push(child.toJSON());
		}
		return json;
	}

	static fromJSON(app: Tea.App, json: any): Object3D {
		if (json == null || json._type !== "Object3D") {
			return null;
		}
		var object3d = new Object3D(app);
		object3d.name = json.name;
		object3d.isActive = json.isActive;
		object3d.localPosition = Tea.Vector3.fromArray(json.localPosition);
		object3d.localRotation = Tea.Quaternion.fromArray(json.localRotation);
		object3d.localScale = Tea.Vector3.fromArray(json.localScale);
		var length = json.components.length;
		for (var i = 0; i < length; i++) {
			var item = json.components[i];
			var component = Tea.Component.fromComponentJSON(app, item);
			if (component == null) {
				continue;
			}
			component.object3d = object3d;
			object3d._components.push(component);
			
		}
		return object3d;
	}

	addChild(object3d: Object3D): void {
		if (object3d == null) {
			return;
		}
		object3d.parent = this;
	}

	removeChild(object3d: Object3D): void {
		if (object3d == null) {
			return;
		}
		if (this.children.indexOf(object3d) < 0) {
			return;
		}
		object3d.parent = null;
	}

	addComponent<T extends Tea.Component>(component: new (app: Tea.App) => T): T {
		if (component == null) {
			return;
		}
		var c = new component(this.app);
		c.object3d = this;
		this._components.push(c);
		if (this.scene != null) {
			this.scene.addComponent(c);
		}
		return c;
	}

	removeComponent(component: Tea.Component): void {
		if (component == null) {
			return;
		}
		var c = this._components.find((c) => {
			return c === component;
		});
		if (c == null) {
			return;
		}
		var index = this._components.indexOf(c);
		this._components.splice(index, 1);
		if (this.scene != null) {
			this.scene.removeComponent(c);
		}
	}

	getComponent<T extends Tea.Component>(component: {new (app: Tea.App): T}): T {
		return this._components.find((c) => {
			return c instanceof component;
		}) as T;
	}

	getComponents<T extends Tea.Component>(component: {new (app: Tea.App): T}): Array<T> {
		return this._components.filter((c) => {
			return c instanceof component;
		}) as Array<T>;
	}

	getComponentsInParent<T extends Tea.Component>(
		component: {new (app: Tea.App): T},
		includeInactive: boolean = false): Array<T>
	{
		var array = [];
		if (this._parent != null) {
			if (includeInactive === true || this._parent.isActive === true) {
				var c = this._parent.getComponentsInParent(
					component, includeInactive
				);
				array.push(c);
			}
		}
		array.push(this.getComponents(component));
		return array;
	}

	getComponentsInChildren<T extends Tea.Component>(
		component: {new (app: Tea.App): T},
		includeInactive: boolean = false): Array<T>
	{
		if (this.isActive === false) {
			return [];
		}
		var array = [];
		var length = this.children.length;
		for (var i = 0; i < length; i++) {
			var child = this.children[i];
			if (includeInactive === true || child.isActive === true) {
				var c = child.getComponentsInChildren(
					component, includeInactive
				);
				array.push.apply(array, c);
			}
		}
		array.push.apply(array, this.getComponents(component));
		return array;
	}

	sendMessage(methodName: string, args: Array<any> = null): void {
		if (methodName == null || methodName === "") {
			return;
		}
		if (this.isActive === false) {
			return;
		}
		var scripts = this._components.filter((c) => {
			return c instanceof Tea.Script;
		}) as Array<Tea.Script>;
		var length = scripts.length;
		for (var i = 0; i < length; i++) {
			var script = scripts[i];
			var method = script[methodName];
			if (method instanceof Function) {
				method.apply(script, args);
			}
		}
	}

	sendMessageUpwards(methodName: string, args: Array<any> = null): void {
		if (methodName == null || methodName === "") {
			return;
		}
		if (this._parent != null) {
			this._parent.sendMessageUpwards(methodName, args);
		}
		this.sendMessage(methodName, args);
	}

	broadcastMessage(methodName: string, args: Array<any> = null): void {
		if (methodName == null || methodName === "") {
			return;
		}
		if (this.childCount > 0) {
			this.children.forEach((child) => {
				child.broadcastMessage(methodName, args);
			});
		}
		this.sendMessage(methodName, args);
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
		if (parent.children.indexOf(this) >= 0) {
			return true;
		}
		return parent.children.some((child) => {
			if (this.isChildOf(child)) {
				return true;
			}
		});
	}

	getSiblingIndex(): number {
		if (this._parent == null) {
			if (this.scene == null) {
				return -1;
			}
			return this.scene.children.indexOf(this);
		}
		return this._parent.children.indexOf(this);
	}

	detachChildren(): void {
		this.children.forEach((child) => {
			child.parent = null;
		});
		this.children = [];
	}

	find(name: string): Object3D {
		return this.children.find((child) => {
			return child.name === name;
		});
	}

	translate(translation: Tea.Vector3): void;
	translate(x: number, y: number, z: number): void;
	translate(a: number | Tea.Vector3, b?: number, c?: number): void {
		if (a instanceof Tea.Vector3) {
			this.localPosition.add$(a);
			return;
		}
		this.localPosition.add$(new Tea.Vector3(a, b, c));
	}

	rotate(eulerAngles: Tea.Vector3): void;
	rotate(xAngle: number, yAngle: number, zAngle: number): void;
	rotate(a: number | Tea.Vector3, b?: number, c?: number): void {
		if (a instanceof Tea.Vector3) {
			this.localRotation.rotateEuler(a);
			return;
		}
		this.localRotation.rotateEuler(a, b, c);
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

	update(): void {
		if (this.isActiveInHierarchy === false) {
			if (this._toDestroy) {
				this._destroy();
			}
			return;
		}
		this._m.update(this);
		var components = this._components;
		var length = components.length;
		for (var i = 0; i < length; i++) {
			var component = components[i];
			if (component instanceof Tea.Camera) {
				continue;
			}
			if (component instanceof Tea.Script) {
				if (component.isStarted === false) {
					try {
						component.start();
					} catch (err) {
						console.error(err);
					}
					component.isStarted = true;
				}
			}
			if (component.enabled) {
				try {
					component.update();
				} catch (err) {
					console.error(err);
				}
			}
		}
		if (this._toDestroy) {
			this._destroy();
		}
	}

	protected reverseScale$(scale: Tea.Vector3): Tea.Vector3 {
		scale[0] = scale[0] !== 0.0 ? 1.0 / scale[0] : 0.0;
		scale[1] = scale[1] !== 0.0 ? 1.0 / scale[1] : 0.0;
		scale[2] = scale[2] !== 0.0 ? 1.0 / scale[2] : 0.0;
		return scale;
	}

	protected adjustChildPosition(child: Tea.Object3D, isAppend: boolean): void {
		if (isAppend) {
			child.localPosition.sub$(this.position);
			var rotation = this.rotation.clone();
			child.localRotation = rotation.inversed.mul(child.localRotation);
			var scale = this.scale.clone();
			this.reverseScale$(scale);
			child.localPosition.scale$(scale);
			child.localScale.scale$(scale);
			return;
		}
		child.localPosition.scale$(this.scale);
		child.localPosition.applyQuaternion(this.rotation);
		child.localPosition.add$(this.position);
		child.localRotation = this.rotation.mul(child.localRotation);
		child.localScale.scale$(this.scale);
	}
}
