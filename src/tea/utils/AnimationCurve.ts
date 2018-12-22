import * as Tea from "../Tea";

export class AnimationCurve {
	static readonly className: string = "AnimationCurve";
	keys: Array<Tea.Keyframe>;
	preWrapMode: Tea.WrapMode;
	postWrapMode: Tea.WrapMode;

	constructor() {
		this.keys = [];
		this.preWrapMode = Tea.WrapMode.ClampForever;
		this.postWrapMode = Tea.WrapMode.ClampForever;
	}

	static constant(timeStart: number, timeEnd: number, value: number): AnimationCurve {
		var curve = new AnimationCurve();
		curve.addKey(timeStart, value);
		curve.addKey(timeEnd, value);
		return curve;
	}

	static easeInOut(timeStart: number, valueStart: number, timeEnd: number, valueEnd: number): AnimationCurve {
		var curve = new AnimationCurve();
		curve.addKey(timeStart, valueStart);
		curve.addKey(timeEnd, valueEnd);
		return curve;
	}

	static linear(timeStart: number, valueStart: number, timeEnd: number, valueEnd: number): AnimationCurve {
		var curve = new AnimationCurve();
		var time = timeEnd - timeStart;
		var value = valueEnd - valueStart;
		var tan = value / time;
		var key0 = new Tea.Keyframe(timeStart, valueStart, 0, tan);
		var key1 = new Tea.Keyframe(timeEnd, valueEnd, tan, 0);
		curve.addKey(key0);
		curve.addKey(key1);
		return curve;
	}

	get length(): number {
		return this.keys.length;
	}

	get(index: number): Tea.Keyframe {
		return this.keys[index];
	}

	addKey(time: number, value: number): number;
	addKey(key: Tea.Keyframe): number;
	addKey(a: number | Tea.Keyframe, b?: number): number {
		if (a instanceof Tea.Keyframe) {
			this.keys.push(a);
			this.sortKeys();
			return this.keys.length - 1;
		}
		var keyframe = new Tea.Keyframe(a, b);
		this.keys.push(keyframe);
		this.sortKeys();
		return this.keys.length - 1;
	}

	moveKey(index: number, key: Tea.Keyframe): number {
		this.keys.splice(index, 1, key);
		return this.keys.indexOf(key);
	}

	removeKey(index: number): void {
		this.keys.splice(index, 1);
	}

	evaluate(time: number): number {
		var length = this.keys.length;
		if (length <= 0) {
			return 0;
		}
		if (length === 1) {
			return this.keys[0].value;
		}
		var first = this.first;
		if (time <= first.time) {
			// TODO: preWrapMode
			return first.value;
		}
		var last = this.last;
		if (time >= last.time) {
			// TODO: postWrapMode
			return last.value;
		}
		var key0: Tea.Keyframe;
		var key1: Tea.Keyframe;
		for (var i = 0; i < length; i++) {
			var key = this.keys[i];
			if (time <= key.time) {
				key0 = this.keys[i - 1];
				key1 = this.keys[i];
				break;
			}
		}
		//console.log(t);
		return this.interpolate(time, key0, key1);
	}

	smoothTangents(index: number, weight: number): void {

	}

	static fromJSON(app: Tea.App, json: any): AnimationCurve {
		if (Tea.JSONUtil.isValidSceneJSON(json, AnimationCurve.className) === false) {
			return null;
		}
		var keys = [];
		for (var i = 0; i < json.keys.length; i++) {
			var key = json.keys[i];
			keys.push(Tea.Keyframe.fromJSON(app, key));
		}
		var animationCurve = new AnimationCurve();
		animationCurve.keys = keys;
		animationCurve.preWrapMode = Tea.WrapMode[json.preWrapMode as string];
		animationCurve.postWrapMode = Tea.WrapMode[json.postWrapMode as string];
		return animationCurve;
	}

	toJSON(): Object {
		var keys = [];
		this.keys.forEach((keyFrame: Tea.Keyframe) => {
			keys.push(keyFrame.toJSON());
		});
		var json: any = {};
		json[Tea.JSONUtil.TypeName] = AnimationCurve.className;
		json.keys = keys;
		json.preWrapMode = Tea.WrapMode.toString(this.preWrapMode);
		json.postWrapMode = Tea.WrapMode.toString(this.postWrapMode);
		return json;
	}

	protected get first(): Tea.Keyframe {
		return this.keys[0];
	}

	protected get last(): Tea.Keyframe {
		return this.keys[this.keys.length - 1];
	}

	protected interpolate(time: number, start: Tea.Keyframe, end: Tea.Keyframe): number {
		var duration = end.time - start.time;
		var t = (time - start.time) / duration;
		var ts = 1.0 - t;
		var t0 = ts * ts * ts;
		var tts3 = 3.0 * ts * t;
		var t1 = tts3 * ts;
		var t2 = tts3 * t;
		var t3 = t * t * t;
		var p0 = start.value;
		var p1 = start.value;
		var p2 = end.value;
		var p3 = end.value;
		p1 += start.outTangent / 3.0;
		p2 -= end.inTangent / 3.0;
		return (
			p0 * t0 + 
			p1 * t1 + 
			p2 * t2 + 
			p3 * t3
		);
	}

	protected sortKeys(): void {
		this.keys.sort((a: Tea.Keyframe, b: Tea.Keyframe) => {
			return a.time - b.time;
		});
	}
}
