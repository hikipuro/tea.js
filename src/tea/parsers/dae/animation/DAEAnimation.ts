import { DAEUtil } from "../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAESource } from "../data/DAESource";
import { DAESampler } from "./DAESampler";
import { DAEChannel } from "./DAEChannel";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_animations, animation
export class DAEAnimation {
	id?: string;
	name?: string;
	asset?: DAEAsset;
	animations?: Array<DAEAnimation>;
	sources?: Array<DAESource>;
	samplers?: Array<DAESampler>;
	channels?: Array<DAEChannel>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.animations = null;
		this.sources = null;
		this.samplers = null;
		this.channels = null;
		this.extras = null;
	}

	static parse(el: Element): DAEAnimation {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAEAnimation();
		value.id = DAEUtil.stringAttrib(el, "id");
		value.name = DAEUtil.stringAttrib(el, "name");
		value.asset = DAEAsset.parse(
			el.querySelector("asset")
		);
		value.animations = DAEAnimation.parseArray(el);
		value.sources = DAESource.parseArray(el);
		value.samplers = DAESampler.parseArray(el);
		value.channels = DAEChannel.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	static parseArray(parent: Element): Array<DAEAnimation> {
		return DAEUtil.parseArray<DAEAnimation>(
			this.parse, parent, "animation"
		);
	}
}
