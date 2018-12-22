import * as Tea from "../Tea";

export class GradientAlphaKey {
	static readonly className: string = "GradientAlphaKey";
	alpha: number;
	time: number;

	constructor(alpha: number, time: number) {
		this.alpha = alpha;
		this.time = time;
	}

	static fromJSON(app: Tea.App, json: any): GradientAlphaKey {
		if (Tea.JSONUtil.isValidSceneJSON(json, GradientAlphaKey.className) === false) {
			return null;
		}
		return new GradientAlphaKey(
			json.alpha, json.time
		);
	}

	clone(): GradientAlphaKey {
		return new GradientAlphaKey(this.alpha, this.time);
	}

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(GradientAlphaKey.className);
		json.alpha = this.alpha;
		json.time = this.time;
		return json;
	}
}
