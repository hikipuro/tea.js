import * as Tea from "../Tea";
import { Component } from "./Component";

export class Script extends Component {
	path: string;
	name: string;
	isStarted: boolean;

	constructor(app: Tea.App) {
		super(app);
		this.path = "";
		this.name = "Script";
		this.isStarted = false;
		this.awake();
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (json == null || json._type !== "Script") {
			callback(null);
			return;
		}
		if (json.path == null || json.path === "") {
			callback(null);
			return;
		}
		Tea.ScriptLoader.load(
			app, json.path,
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

	get keyboard(): Tea.Keyboard {
		return this.app.keyboard;
	}

	get mouse(): Tea.Mouse {
		return this.app.mouse;
	}

	get gamepad(): Tea.Gamepad {
		return this.app.gamepad;
	}

	get scene(): Tea.Scene {
		return this.object3d.scene;
	}

	get time(): Tea.Time {
		return this.app.time;
	}

	get parent(): Tea.Object3D {
		return this.object3d.parent;
	}

	get forward(): Tea.Vector3 {
		return this.object3d.forward;
	}

	get up(): Tea.Vector3 {
		return this.object3d.up;
	}

	get right(): Tea.Vector3 {
		return this.object3d.right;
	}

	get localPosition(): Tea.Vector3 {
		return this.object3d.localPosition;
	}
	set localPosition(value: Tea.Vector3) {
		this.object3d.localPosition = value;
	}

	get localRotation(): Tea.Quaternion {
		return this.object3d.localRotation;
	}
	set localRotation(value: Tea.Quaternion) {
		this.object3d.localRotation = value;
	}

	get localEulerAngles(): Tea.Vector3 {
		return this.object3d.localEulerAngles;
	}

	get localScale(): Tea.Vector3 {
		return this.object3d.localScale;
	}
	set localScale(value: Tea.Vector3) {
		this.object3d.localScale = value;
	}

	get position(): Tea.Vector3 {
		return this.object3d.position;
	}

	get rotation(): Tea.Quaternion {
		return this.object3d.rotation;
	}

	get scale(): Tea.Vector3 {
		return this.object3d.scale;
	}

	get renderer(): Tea.Renderer {
		return this.object3d.getComponent(Tea.Renderer);
	}

	translate(translation: Tea.Vector3): void;
	translate(x: number, y: number, z: number): void;
	translate(a: number | Tea.Vector3, b?: number, c?: number): void {
		if (a instanceof Tea.Vector3) {
			this.object3d.translate(a);
			return;
		}
		this.object3d.translate(a, b, c);
	}

	rotate(eulerAngles: Tea.Vector3): void;
	rotate(xAngle: number, yAngle: number, zAngle: number): void;
	rotate(a: number | Tea.Vector3, b?: number, c?: number): void {
		if (a instanceof Tea.Vector3) {
			this.object3d.rotate(a);
			return;
		}
		this.object3d.rotate(a, b, c);
	}

	rotateAround(point: Tea.Vector3, axis: Tea.Vector3, angle: number): void {
		this.object3d.rotateAround(point, axis, angle);
	}

	lookAt(worldPosition: Tea.Vector3, worldUp?: Tea.Vector3): void;
	lookAt(target: Tea.Object3D, worldUp?: Tea.Vector3): void;
	lookAt(target: Tea.Object3D | Tea.Vector3, worldUp: Tea.Vector3 = Tea.Vector3.up): void {
		if (target instanceof Tea.Vector3) {
			this.object3d.lookAt(target, worldUp);
			return;
		}
		this.object3d.lookAt(target, worldUp);
	}

	invoke(methodName: string, time: number): void {
		if (methodName == null || methodName === "") {
			return;
		}
		var method = this[methodName];
		if ((method instanceof Function) === false) {
			return;
		}
		setTimeout(method, time * 1000);
	}

	toJSON(): Object {
		var json = super.toJSON() as any;
		Object.assign(json, {
			_type: "Script",
			//class: this.constructor.name,
			path: this.path,
			members: []
		});
		var keys1 = Object.keys(new Script(null));
		var keys2 = Object.keys(this);
		var keys = keys2.filter((value) => {
			return !(keys1 as any).includes(value);
		});
		var length = keys.length;
		for (var i = 0; i < length; i++) {
			var key = keys[i];
			var value = this[key];
			if (value["toJSON"] != null) {
				value = value.toJSON();
			}
			json.members.push({
				key: key,
				value: value
			});
		}
		return json;
	}

	awake(): void {
	}

	start(): void {
	}

	update(): void {
	}

	lateUpdate(): void {
	}
}
