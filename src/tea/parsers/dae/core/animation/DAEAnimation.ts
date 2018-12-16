import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAESource } from "../data/DAESource";
import { DAESampler } from "./DAESampler";
import { DAEChannel } from "./DAEChannel";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: library_animations, animation
export class DAEAnimation {
	static readonly TagName: string = "animation";
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
			return null;
		}
		var value = new DAEAnimation();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
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
			this.parse, parent, DAEAnimation.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAEAnimation.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.animations);
		DAEUtil.addElementArray(el, this.sources);
		DAEUtil.addElementArray(el, this.samplers);
		DAEUtil.addElementArray(el, this.channels);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
