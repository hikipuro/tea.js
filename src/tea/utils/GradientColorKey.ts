import * as Tea from "../Tea";

export class GradientColorKey {
	color: Tea.Color;
	time: number;

	constructor(color: Tea.Color, time: number) {
		this.color = color;
		this.time = time;
	}
}
