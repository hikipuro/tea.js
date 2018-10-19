import * as Tea from "../Tea";
import { Component } from "./Component";

export class Light extends Component {
	static editorView = Tea.Editor.Light;
	color: Tea.Color;
	intensity: number;
	range: number;
	spotAngle: number;
	type: Tea.LightType;
	protected _direction: Tea.Vector3;

	constructor(app: Tea.App) {
		super(app);
		this.color = Tea.Color.white.clone();
		this.intensity = 1.0;
		this.range = 1.0;
		this.spotAngle = 50;
		this.type = Tea.LightType.Directional;
		this._direction = new Tea.Vector3();
	}

	get direction(): Tea.Vector3 {
		return this._direction;
	}

	destroy(): void {
		this.color = undefined;
		this.intensity = undefined;
		this.range = undefined;
		this.spotAngle = undefined;
		this.type = undefined;
		super.destroy();
	}

	update(): void {
		var d = this._direction;
		d[0] = 0.0;
		d[1] = 0.0;
		d[2] = -1.0;
		d.applyQuaternion(this.object3d.rotation);
		d.normalize$();
	}

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "Light",
			color: this.color,
			intensity: this.intensity,
			range: this.range,
			spotAngle: this.spotAngle,
			type: this.type,
		});
		return json;
	}
}
