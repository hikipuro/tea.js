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
}
