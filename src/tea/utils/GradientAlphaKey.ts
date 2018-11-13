import * as Tea from "../Tea";

export class GradientAlphaKey {
	alpha: number;
	time: number;

	constructor(alpha: number, time: number) {
		this.alpha = alpha;
		this.time = time;
	}

	static fromJSON(app: Tea.App, json: any): GradientAlphaKey {
		if (json == null || json._type !== "GradientAlphaKey") {
			return null;
		}
		return new GradientAlphaKey(
			json.alpha, json.time
		);
	}

	toJSON(): Object {
		var json = {
			_type: "GradientAlphaKey",
			alpha: this.alpha,
			time: this.time
		};
		return json;
	}
}
