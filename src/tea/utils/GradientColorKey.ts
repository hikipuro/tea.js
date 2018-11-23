import * as Tea from "../Tea";

export class GradientColorKey {
	color: Tea.Color;
	time: number;

	constructor(color: Tea.Color, time: number) {
		this.color = color.clone();
		this.time = time;
	}

	static fromJSON(app: Tea.App, json: any): GradientColorKey {
		if (json == null || json._type !== "GradientColorKey") {
			return null;
		}
		return new GradientColorKey(
			Tea.Color.fromArray(json.color), json.time
		);
	}

	clone(): GradientColorKey {
		return new GradientColorKey(this.color, this.time);
	}
	
	toJSON(): Object {
		var json = {
			_type: "GradientColorKey",
			color: this.color,
			time: this.time
		};
		return json;
	}
}
