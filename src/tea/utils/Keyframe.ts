import * as Tea from "../Tea";

export class Keyframe {
	time: number;
	value: number;
	inTangent: number;
	outTangent: number;
	inWeight: number;
	outWeight: number;
	weightedMode: Tea.WeightedMode;

	constructor(time: number, value: number);
	constructor(time: number, value: number, inTangent: number, outTangent: number);
	constructor(time: number, value: number, inTangent: number, outTangent: number, inWeight: number, outWeight: number);
	constructor(time: number, value: number, inTangent?: number, outTangent?: number, inWeight?: number, outWeight?: number) {
		this.time = time;
		this.value = value;
		this.inTangent = inTangent != null ? inTangent : 0.0;
		this.outTangent = outTangent != null ? outTangent : 0.0;
		this.inWeight = inWeight != null ? inWeight : 0.0;
		this.outWeight = outWeight != null ? outWeight : 0.0;
		this.weightedMode = Tea.WeightedMode.None;
	}
}
