import * as Tea from "../Tea";
import { Component } from "./Component";

export class Light extends Component {
	color: Tea.Color;
	intensity: number;
	type: Tea.LightType;

	constructor(app: Tea.App) {
		super(app);
		this.color = Tea.Color.white;
		this.intensity = 0;
		this.type = Tea.LightType.Directional;
	}
}
