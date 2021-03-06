import * as Tea from "../Tea";

export class Keyframe {
	static readonly className: string = "Keyframe";
	time: number;
	value: number;
	inTangent: number;
	outTangent: number;
	//inWeight: number;
	//outWeight: number;
	//weightedMode: Tea.WeightedMode;

	constructor(time: number, value: number);
	constructor(time: number, value: number, inTangent: number, outTangent: number);
	//constructor(time: number, value: number, inTangent: number, outTangent: number, inWeight: number, outWeight: number);
	constructor(time: number, value: number, inTangent?: number, outTangent?: number, inWeight?: number, outWeight?: number) {
		this.time = time;
		this.value = value;
		this.inTangent = inTangent != null ? inTangent : 0.0;
		this.outTangent = outTangent != null ? outTangent : 0.0;
		//this.inWeight = inWeight != null ? inWeight : 0.0;
		//this.outWeight = outWeight != null ? outWeight : 0.0;
		//this.weightedMode = Tea.WeightedMode.None;
	}

	static fromJSON(app: Tea.App, json: any): Keyframe {
		if (Tea.JSONUtil.isValidSceneJSON(json, Keyframe.className) === false) {
			return null;
		}
		var keyframe = new Keyframe(
			json.time,
			json.value,
			json.inTangent,
			json.outTangent,
			//json.inWeight,
			//json.outWeight
		);
		//keyFrame.weightedMode = Tea.WeightedMode[json.weightedMode as string];
		return keyframe;
	}

	toJSON(): Object {
		var json: any = {};
		json[Tea.JSONUtil.TypeName] = Keyframe.className;
		Object.assign(json, {
			time: this.time,
			value: this.value,
			inTangent: this.inTangent,
			outTangent: this.outTangent,
			//inWeight: this.inWeight,
			//outWeight: this.outWeight,
			//weightedMode: Tea.WeightedMode.toString(this.weightedMode)
		});
		return json;
	}

	/*
	getInWeight(): number {
		switch (this.weightedMode) {
			case Tea.WeightedMode.None:
			case Tea.WeightedMode.Out:
				return 1.0 / 3.0;
		}
		return this.inWeight;
	}

	getOutWeight(): number {
		switch (this.weightedMode) {
			case Tea.WeightedMode.None:
			case Tea.WeightedMode.In:
				return 1.0 / 3.0;
		}
		return this.outWeight;
	}
	//*/
}
