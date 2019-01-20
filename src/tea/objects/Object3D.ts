import * as Tea from "../Tea";
import { Object3DStatus } from "./Object3DStatus";

export class Object3D {
	static readonly className: string = "Object3D";
	static readonly MaxDepth: number = 1000;
	name: string;
	isDestroyed: boolean;
	enabled: boolean;
	scene: Tea.Scene;
	localPosition: Tea.Vector3;
	localRotation: Tea.Quaternion;
	localScale: Tea.Vector3;
	tag: string;
	layer: number;
	protected _app: Tea.App;
	protected _status: Object3DStatus;
	protected _parent: Object3D;
	protected _id: string;
	protected _children: Array<Object3D>;
	protected _components: Array<Tea.Component>;
	protected _position: Tea.Vector3;
	protected _rotation: Tea.Quaternion;
	protected _scale: Tea.Vector3;
	protected _toDestroy: boolean;

	constructor(app: Tea.App, id: string = null) {
		if (id == null) {
			id = Tea.uuid();
		}
		this._app = app;
		this.name = "";
		this.isDestroyed = false;
		this.enabled = true;
		this.scene = null;
		this.localPosition = new Tea.Vector3();
		this.localRotation = new Tea.Quaternion(0.0, 0.0, 0.0, 1.0);
		this.localScale = new Tea.Vector3(1.0, 1.0, 1.0);
		this.tag = "";
		this.layer = 0;
		this._status = new Object3DStatus();
		this._parent = null;
		this._id = id;
		this._children = [];
		this._components = [];
		this._position = new Tea.Vector3();
		this._rotation = new Tea.Quaternion();
		this._scale = new Tea.Vector3();
		this._toDestroy = false;
		//this._status.update(this, null);
	}

	static createPrimitive(app: Tea.App, type: Tea.PrimitiveType): Object3D {
		var name = Tea.PrimitiveType.toString(type);
		//var mesh = Tea.Mesh.createPrimitive(type);
		var mesh = Tea.Mesh.getSharedPrimitive(type);
		var object3d = new Tea.Object3D(app);
		object3d.name = name;
		var shader = Tea.Shader.find(app, "default");
		var meshFilter = object3d.addComponent(Tea.MeshFilter);
		meshFilter.mesh = mesh;
		var renderer = object3d.addComponent(Tea.MeshRenderer);
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.shader = shader;
		return object3d;
	}

	get isMoved(): boolean {
		return this._status.isMoved;
	}

	get enabledInHierarchy(): boolean {
		if (!this.enabled) {
			return false;
		}
		var parent = this._parent;
		if (parent == null) {
			return true;
		}
		return parent.enabledInHierarchy;
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
			var index = parent._children.indexOf(this);
			parent._children.splice(index, 1);
			if (scene != null) {
				this.scene = null;
				scene.removeComponents(this);
				var children = this._children;
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
			var index = parent._children.indexOf(this);
			parent._children.splice(index, 1);
		}
		this._parent = value;
		value.adjustChildPosition(this, true);
		value._children.push(this);
		if (scene != null && scene.childIndex(this) >= 0) {
			scene.removeChild(this);
		}
		scene = value.scene;
		if (scene != null) {
			this.scene = scene;
			scene.addComponents(this);
			var children = this._children;
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

	get id(): string {
		return this._id;
	}

	get position(): Tea.Vector3 {
		return this._position;
	}

	set position(value: Tea.Vector3) {
		if (value == null) {
			//this.localPosition.set(0.0, 0.0, 0.0);
			return;
		}
		var parent = this._parent;
		if (parent == null) {
			var localPosition = this.localPosition;
			localPosition[0] = value[0];
			localPosition[1] = value[1];
			localPosition[2] = value[2];
			return;
		}
		var p = this.localPosition;
		var pp = parent._position;
		p[0] = value[0] - pp[0];
		p[1] = value[1] - pp[1];
		p[2] = value[2] - pp[2];
		var r = parent.rotation.inversed;
		var s = parent.scale;
		p.applyQuaternion(r);
		p[0] *= s[0] !== 0.0 ? 1.0 / s[0] : 0.0;
		p[1] *= s[1] !== 0.0 ? 1.0 / s[1] : 0.0;
		p[2] *= s[2] !== 0.0 ? 1.0 / s[2] : 0.0;
	}

	get rotation(): Tea.Quaternion {
		return this._rotation;
	}

	set rotation(value: Tea.Quaternion) {
		if (value == null) {
			//this.localRotation.set(0.0, 0.0, 0.0, 1.0);
			return;
		}
		var parent = this._parent;
		if (parent == null) {
			var localRotation = this.localRotation;
			localRotation[0] = value[0];
			localRotation[1] = value[1];
			localRotation[2] = value[2];
			localRotation[3] = value[3];
			return;
		}
		var r = this.localRotation;
		var pr = parent._rotation;
		r[0] = pr[0];
		r[1] = pr[1];
		r[2] = pr[2];
		r[3] = pr[3];
		var x = r[0], y = r[1], z = r[2], w = r[3];
		var m = x * x + y * y + z * z + w * w;
		if (m === 0.0) {
			r[0] = 0.0;
			r[1] = 0.0;
			r[2] = 0.0;
			r[3] = 0.0;
		} else {
			m = 1.0 / m;
			r[0] = -x * m;
			r[1] = -y * m;
			r[2] = -z * m;
			r[3] = w * m;
		}
		r.mulSelf(value);
	}

	get scale(): Tea.Vector3 {
		return this._scale;
	}

	set scale(value: Tea.Vector3) {
		if (value == null) {
			//this.localScale.set(0.0, 0.0, 0.0);
			return;
		}
		var parent = this._parent;
		if (parent == null) {
			var localScale = this.localScale;
			localScale[0] = value[0];
			localScale[1] = value[1];
			localScale[2] = value[2];
			return;
		}
		var s = this.localScale;
		var ps = parent._scale;
		s[0] = ps[0] !== 0.0 ? 1.0 / ps[0] : 0.0;
		s[1] = ps[1] !== 0.0 ? 1.0 / ps[1] : 0.0;
		s[2] = ps[2] !== 0.0 ? 1.0 / ps[2] : 0.0;
		s[0] *= value[0];
		s[1] *= value[1];
		s[2] *= value[2];
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
	//set eulerAngles(value: Tea.Vector3) {
	//	this.rotation.setEuler(value);
	//}

	get childCount(): number {
		if (this._children == null) {
			return 0;
		}
		return this._children.length;
	}

	get children(): Array<Object3D> {
		return this._children;
	}

	get forward(): Tea.Vector3 {
		var vec3 = new Tea.Vector3(0.0, 0.0, 1.0);
		vec3.applyQuaternion(this._rotation);
		return vec3;
	}

	get up(): Tea.Vector3 {
		var vec3 = new Tea.Vector3(0.0, 1.0, 0.0);
		vec3.applyQuaternion(this._rotation);
		return vec3;
	}

	get right(): Tea.Vector3 {
		var vec3 = new Tea.Vector3(1.0, 0.0, 0.0);
		vec3.applyQuaternion(this._rotation);
		return vec3;
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		return this._status.localToWorldMatrix;
	}

	get worldToLocalMatrix(): Tea.Matrix4x4 {
		return this._status.worldToLocalMatrix;
	}

	get root(): Tea.Object3D {
		var parent = this._parent;
		if (parent == null) {
			return this;
		}
		for (var i = 0; i < Object3D.MaxDepth; i++) {
			if (parent.parent == null) {
				return parent;
			}
			parent = parent.parent;
		}
		return this;
	}

	get path(): string {
		if (this.scene == null) {
			return "";
		}
		var path = "";
		var parent = this.parent;
		for (var i = 0; i < Object3D.MaxDepth; i++) {
			if (parent == null) {
				break;
			}
			path = parent.name + "/" + path;
			parent = parent.parent;
		}
		path += this.name;
		return path;
	}

	get componentCount(): number {
		return this._components.length;
	}

	destroy(): void {
		this.isDestroyed = true;
		this._toDestroy = true;
	}

	protected _destroy(): void {
		if (this.scene != null) {
			this.scene.removeComponents(this);
			this.scene.removeChild(this);
		}
		this.parent = null;
		var length = this._children.length;
		for (var i = length - 1; i >= 0; i--) {
			var child = this._children[i];
			child._destroy();
			delete this._children[i];
		}
		var keys = Object.keys(this._components);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			this._components[key].destroy();
			delete this._components[key];
		}
		this._children = [];
		this._app = undefined;
		this.name = undefined;
		this.enabled = undefined;
		this.scene = undefined;
		this.localPosition = undefined;
		this.localRotation = undefined;
		this.localScale = undefined;
		this._status.destroy();
		this._status = undefined;
		this._components = [];
		this._position = undefined;
		this._rotation = undefined;
		this._scale = undefined;
		this._toDestroy = undefined;
		this._id = undefined;
	}

	toString(): string {
		return JSON.stringify(this);
	}

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(Object3D.className);
		json.id = this._id;
		json.name = this.name;
		json.enabled = this.enabled;
		json.localPosition = this.localPosition;
		json.localRotation = this.localRotation;
		json.localScale = this.localScale;
		json.components = Tea.JSONUtil.arrayToJSON(this._components);
		json.children = Tea.JSONUtil.arrayToJSON(this._children);
		return json;
	}

	/*
	static fromJSON(app: Tea.App, json: any): Object3D {
		if (json == null || json[Tea.JSONUtil.TypeName] !== "Object3D") {
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
			var componentClass = Tea[item[Tea.JSONUtil.TypeName]];
			if (componentClass == null) {
				continue;
			}
			if (json[Tea.JSONUtil.TypeName] === "Script") {
				componentClass.fromJSON(app, item, (script: Tea.Script) => {
					if (script == null) {
						return;
					}
					script.object3d = object3d;
					object3d._components.push(script);
				});
				continue;
			}
			if (componentClass.fromJSON == null) {
				console.error("componentClass.fromJSON not found:", item[Tea.JSONUtil.TypeName]);
				continue;
			}
			var component = componentClass.fromJSON(app, item);
			if (component == null) {
				continue;
			}
			component.object3d = object3d;
			object3d._components.push(component);
		}
		length = json.children.length;
		for (var i = 0; i < length; i++) {
			var item = json.children[i];
			var child = Object3D.fromJSON(app, item);
			if (child == null) {
				continue;
			}
			object3d.addChild(child);
		}
		return object3d;
	}
	//*/

	addChild(object3d: Object3D, worldPositionStays: boolean = true): void {
		if (object3d == null) {
			return;
		}
		var parent = object3d._parent;
		if (parent === this) {
			return;
		}
		if (parent != null) {
			parent.adjustChildPosition(this, false, worldPositionStays);
			var index = parent._children.indexOf(this);
			parent._children.splice(index, 1);
		}
		object3d._parent = this;
		this.adjustChildPosition(object3d, true, worldPositionStays);
		this._children.push(object3d);
		var scene = this.scene;
		if (scene != null) {
			if (scene.childIndex(object3d) >= 0) {
				scene.removeChild(object3d);
			}
			object3d.scene = scene;
			scene.addComponents(object3d);
			var children = object3d._children;
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

	removeChild(object3d: Object3D): void {
		if (object3d == null) {
			return;
		}
		var children = this._children;
		var index = children.indexOf(object3d);
		if (index < 0) {
			return;
		}
		children.splice(index, 1);
		object3d.parent = null;
	}

	getComponentIndex(component: Tea.Component): number {
		return this._components.indexOf(component);
	}

	swapComponents(index0: number, index1: number): void {
		var item0 = this._components[index0];
		var item1 = this._components[index1];
		if (item0 == null || item1 == null) {
			return;
		}
		var temp = item0;
		this._components[index0] = item1;
		this._components[index1] = temp;
	}

	addComponent<T extends Tea.Component>(component: new (app: Tea.App) => T): T {
		if (component == null) {
			return;
		}
		var c = this.getComponent(component);
		if (c) {
			return c;
		}
		c = new component(this._app);
		c.object3d = this;
		this._components.push(c);
		if (this.scene != null) {
			this.scene.addComponent(c);
		}
		return c;
	}

	addComponentInstance(component: Tea.Component): void {
		if (component == null) {
			return;
		}
		if ((component instanceof Tea.Component) === false) {
			return;
		}
		component.object3d = this;
		this._components.push(component);
		if (this.scene != null) {
			this.scene.addComponent(component);
		}
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
		var components = this._components;
		var length = components.length;
		for (var i = 0; i < length; i++) {
			var c = components[i];
			if (c instanceof component) {
				return c;
			}
		}
		return null;
	}

	getComponents<T extends Tea.Component>(component: {new (app: Tea.App): T}): Array<T> {
		return this._components.filter((c: Tea.Component): boolean => {
			return c instanceof component;
		}) as Array<T>;
	}

	getComponentInParent<T extends Tea.Component>(
		component: {new (app: Tea.App): T},
		includeInactive: boolean = false): T
	{
		if (includeInactive === false && this.enabled === false) {
			return null;
		}
		var parent = this._parent;
		if (parent == null) {
			return this.getComponent(component);
		}
		if (includeInactive === false && parent.enabled === false) {
			return this.getComponent(component);
		}
		return parent.getComponentInParent(
			component, includeInactive
		);
	}

	getComponentsInParent<T extends Tea.Component>(
		component: {new (app: Tea.App): T},
		includeInactive: boolean = false): Array<T>
	{
		if (includeInactive === false && this.enabled === false) {
			return [];
		}
		var parent = this._parent;
		if (parent == null) {
			return this.getComponents(component);
		}
		if (includeInactive === false && parent.enabled === false) {
			return this.getComponents(component);
		}
		var components = parent.getComponentsInParent(
			component, includeInactive
		);
		components.push(...this.getComponents(component));
		return components;
	}

	getComponentInChildren<T extends Tea.Component>(
		component: {new (app: Tea.App): T},
		includeInactive: boolean = false): T
	{
		if (includeInactive === false && this.enabled === false) {
			return null;
		}
		var children = this._children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			if (includeInactive === false && child.enabled === false) {
				continue;
			}
			var c = child.getComponentInChildren(
				component, includeInactive
			);
			if (c != null) {
				return c;
			}
		}
		return this.getComponent(component);
	}

	getComponentsInChildren<T extends Tea.Component>(
		component: {new (app: Tea.App): T},
		includeInactive: boolean = false): Array<T>
	{
		if (includeInactive === false && this.enabled === false) {
			return [];
		}
		var array = this.getComponents(component);
		var children = this._children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			if (includeInactive === false && child.enabled === false) {
				continue;
			}
			var components = child.getComponentsInChildren(
				component, includeInactive
			);
			array.push(...components);
		}
		return array;
	}

	sendMessage(methodName: string, args: Array<any> = null): void {
		if (methodName == null || methodName === "") {
			return;
		}
		if (this.enabled === false) {
			return;
		}
		var components = this._components;
		var length = components.length;
		for (var i = 0; i < length; i++) {
			var component = components[i];
			if (component.enabled === false) {
				continue;
			}
			var method = component[methodName];
			if (method instanceof Function) {
				method.apply(component, args);
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
		var children = this._children;
		if (children == null) {
			this.sendMessage(methodName, args);
			return;
		}
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			child.broadcastMessage(methodName, args);
		}
		this.sendMessage(methodName, args);
	}

	detachChildren(): void {
		var children = this._children;
		if (children == null || children.length <= 0) {
			return;
		}
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			child.parent = null;
		}
		this._children = [];
	}

	find(name: string): Object3D {
		var children = this._children;
		if (children == null || children.length <= 0) {
			return null;
		}
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			if (child.name === name) {
				return child;
			}
		}
		return null;
	}

	getChild(index: number): Object3D {
		return this._children[index];
	}

	getSiblingIndex(): number {
		var parent = this._parent;
		if (parent == null) {
			if (this.scene == null) {
				return -1;
			}
			return this.scene.children.indexOf(this);
		}
		return parent._children.indexOf(this);
	}

	isChildOf(parent: Object3D): boolean {
		if (parent == null) {
			return false;
		}
		if (parent === this) {
			return true;
		}
		var children = parent._children;
		if (children == null || children.length <= 0) {
			return false;
		}
		if (children.indexOf(this) >= 0) {
			return true;
		}
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			if (this.isChildOf(child)) {
				return true;
			}
		}
		return false;
	}

	lookAt(worldPosition: Tea.Vector3, worldUp?: Tea.Vector3): void;
	lookAt(target: Object3D, worldUp?: Tea.Vector3): void;
	lookAt(target: Object3D | Tea.Vector3, worldUp: Tea.Vector3 = Tea.Vector3.up): void {
		if (target == null) {
			return;
		}
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

	rotate(eulerAngles: Tea.Vector3): void;
	rotate(xAngle: number, yAngle: number, zAngle: number): void;
	rotate(a: number | Tea.Vector3, b?: number, c?: number): void {
		if (a == null) {
			return;
		}
		if (a instanceof Tea.Vector3) {
			this.localRotation.rotateEuler(a);
			return;
		}
		this.localRotation.rotateEuler(a, b, c);
	}

	rotateAround(point: Tea.Vector3, axis: Tea.Vector3, angle: number): void {
		if (point == null || axis == null) {
			return;
		}
		var q = Tea.Quaternion.euler(axis.normalized.mul(angle));
		var p = this.position.sub(point);
		this.localRotation = q.mul(this.rotation);
		this.localPosition = point.add(q.mul(p));
	}

	setAsFirstSibling(): void {
		var index = this.getSiblingIndex();
		if (index < 0) {
			return;
		}
		var scene = this.scene;
		var parent = this._parent;
		var children: Array<Object3D> = null;
		if (parent == null) {
			if (scene == null) {
				return;
			}
			children = scene.children;
		} else {
			children = parent._children;
		}
		if (children == null || children.length <= 1) {
			return;
		}
		children.splice(index, 1);
		children.unshift(this);
	}

	setAsLastSibling(): void {
		var index = this.getSiblingIndex();
		if (index < 0) {
			return;
		}
		var scene = this.scene;
		var parent = this._parent;
		var children: Array<Object3D> = null;
		if (parent == null) {
			if (scene == null) {
				return;
			}
			children = scene.children;
		} else {
			children = parent._children;
		}
		if (children == null || children.length <= 1) {
			return;
		}
		children.splice(index, 1);
		children.push(this);
	}

	setSiblingIndex(index: number): void {
		var i = this.getSiblingIndex();
		if (i < 0) {
			return;
		}
		var scene = this.scene;
		var parent = this._parent;
		var children: Array<Object3D> = null;
		if (parent == null) {
			if (scene == null) {
				return;
			}
			children = scene.children;
		} else {
			children = parent._children;
		}
		if (children == null || children.length <= 1) {
			return;
		}
		if (i === index) {
			return;
		}
		children.splice(i, 1);
		children.splice(index, 0, this);
	}

	transformDirection(direction: Tea.Vector3): Tea.Vector3;
	transformDirection(x: number, y: number, z: number): Tea.Vector3;
	transformDirection(a: number | Tea.Vector3, b?: number, c?: number): Tea.Vector3 {
		return null;
	}

	transformPoint(position: Tea.Vector3): Tea.Vector3;
	transformPoint(x: number, y: number, z: number): Tea.Vector3;
	transformPoint(a: number | Tea.Vector3, b?: number, c?: number): Tea.Vector3 {
		if (a == null) {
			return new Tea.Vector3();
		}
		var position: Tea.Vector3 = null;
		if (a instanceof Tea.Vector3) {
			position = a.clone();
		} else {
			position = new Tea.Vector3(a, b, c);
		}
		var parent = this._parent;
		if (parent == null) {
			return position;
		}
		position.scaleSelf(parent.scale);
		position.applyQuaternion(parent.rotation);
		return position.addSelf(parent.position);
	}

	transformVector(vector: Tea.Vector3): Tea.Vector3;
	transformVector(x: number, y: number, z: number): Tea.Vector3;
	transformVector(a: number | Tea.Vector3, b?: number, c?: number): Tea.Vector3 {
		return null;
	}

	translate(translation: Tea.Vector3): void;
	translate(x: number, y: number, z: number): void;
	translate(a: number | Tea.Vector3, b?: number, c?: number): void {
		if (a == null) {
			return;
		}
		if (a instanceof Tea.Vector3) {
			this.localPosition.addSelf(a);
			return;
		}
		var position = this.localPosition;
		position[0] += a;
		position[1] += b;
		position[2] += c;
	}

	update(isEditing: boolean = false): void {
		if (this.enabledInHierarchy === false) {
			if (this._toDestroy) {
				this._destroy();
			}
			return;
		}

		if (isEditing) {
			this.updateComponentsEditor();
		} else {
			this.updateComponents();
		}

		if (this._parent != null) {
			this._status.update(this, this._parent._status);
		} else {
			this._status.update(this, null);
		}
		if (this._status.isMoved) {
			var p = this._position;
			var r = this._rotation;
			var s = this._scale;
			var sp = this._status.position;
			var sr = this._status.rotation;
			var ss = this._status.scale;
			p[0] = sp[0];
			p[1] = sp[1];
			p[2] = sp[2];
			r[0] = sr[0];
			r[1] = sr[1];
			r[2] = sr[2];
			r[3] = sr[3];
			s[0] = ss[0];
			s[1] = ss[1];
			s[2] = ss[2];
		}

		if (this._toDestroy) {
			this._destroy();
			return;
		}
	}

	protected updateComponents(): void {
		var components = this._components;
		var length = components.length;
		for (var i = 0; i < length; i++) {
			var component = components[i];
			if (component.enabled === false) {
				continue;
			}
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
			try {
				component.update();
			} catch (err) {
				console.error(err);
			}
		}
	}

	protected updateComponentsEditor(): void {
		var components = this._components;
		var length = components.length;
		for (var i = 0; i < length; i++) {
			var component = components[i];
			if (component.enabled === false) {
				continue;
			}
			if (component instanceof Tea.Camera) {
				continue;
			}
			if (component instanceof Tea.Script) {
				continue;
			}
			if (component instanceof Tea.Rigidbody) {
				continue;
			}
			try {
				component.update();
			} catch (err) {
				console.error(err);
			}
		}
	}

	protected adjustChildPosition(child: Tea.Object3D, isAppend: boolean, worldPositionStays: boolean = true): void {
		if (worldPositionStays === false) {
			return;
		}
		if (isAppend) {
			var scale = this.scale.clone();
			scale[0] = scale[0] !== 0.0 ? 1.0 / scale[0] : 0.0;
			scale[1] = scale[1] !== 0.0 ? 1.0 / scale[1] : 0.0;
			scale[2] = scale[2] !== 0.0 ? 1.0 / scale[2] : 0.0;
			var rotation = this.rotation.inversed;
			var position = child.localPosition;
			position.subSelf(this.position);
			position.applyQuaternion(rotation);
			position.scaleSelf(scale);
			rotation.mulSelf(child.localRotation);
			child.localRotation = rotation;
			child.localScale.scaleSelf(scale);
			return;
		}
		// remove
		var position = child.localPosition;
		position.scaleSelf(this.scale);
		position.applyQuaternion(this.rotation);
		position.addSelf(this.position);
		child.localRotation = this.rotation.mul(child.localRotation);
		child.localScale.scaleSelf(this.scale);
	}
}
