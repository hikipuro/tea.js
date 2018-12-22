import * as Tea from "../Tea";

export class GradientColorKey {
	static readonly className: string = "GradientColorKey";
	color: Tea.Color;
	time: number;

	constructor(color: Tea.Color, time: number) {
		this.color = color.clone();
		this.time = time;
	}

	static fromJSON(app: Tea.App, json: any): GradientColorKey {
		if (Tea.JSONUtil.isValidSceneJSON(json, GradientColorKey.className) === false) {
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
		var json: any = {};
		json[Tea.JSONUtil.TypeName] = GradientColorKey.className;
		json.color = this.color;
		json.time = this.time;
		return json;
	}
}
