import * as Tea from "../Tea";
import { Component } from "./Component";

export class Light extends Component {
	static readonly className: string = "Light";
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
		this._direction = undefined;
		super.destroy();
	}

	update(): void {
		var d = this._direction;
		d[0] = 0.0;
		d[1] = 0.0;
		d[2] = -1.0;
		d.applyQuaternion(this.object3d.rotation);
		d.normalizeSelf();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Light.className;
		json.color = this.color;
		json.intensity = this.intensity;
		json.range = this.range;
		json.spotAngle = this.spotAngle;
		json.type = Tea.LightType.toString(this.type);
		return json;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Light.className) === false) {
			callback(null);
			return;
		}
		var light = new Light(app);
		light.enabled = json.enabled;
		light.color = Tea.Color.fromArray(json.color);
		light.intensity = json.intensity;
		light.range = json.range;
		light.spotAngle = json.spotAngle;
		light.type = Tea.LightType[json.type as string];
		callback(light);
	}
}
