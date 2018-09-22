import * as Tea from "../Tea";
import { Component } from "./Component";

export class Light extends Component {
	color: Tea.Color;
	intensity: number;
	range: number;
	spotAngle: number;
	type: Tea.LightType;

	constructor(app: Tea.App) {
		super(app);
		this.color = Tea.Color.white.clone();
		this.intensity = 1.0;
		this.range = 1.0;
		this.spotAngle = 50;
		this.type = Tea.LightType.Directional;
	}

	destroy(): void {
		this.color = undefined;
		this.intensity = undefined;
		this.range = undefined;
		this.spotAngle = undefined;
		this.type = undefined;
		super.destroy();
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
