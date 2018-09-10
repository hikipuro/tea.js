import * as Tea from "../Tea";

export class RenderSettings {
	ambientLight: Tea.Color;

	constructor() {
		this.ambientLight = new Tea.Color(0.2, 0.2, 0.2, 1.0);
	}
}
