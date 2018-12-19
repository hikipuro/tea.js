import { DAEUtil } from "../../DAEUtil";
import { DAEElement } from "../../DAEElement";

// parent: extra, source(core), light, optics, imager, force_field, physics_material, 
// physics_scene, rigid_body, rigid_constraint, instance_rigid_body, 
// bind_material, motion, kinematics, kinematics_model
export class DAETechnique {
	static readonly TagName: string = "technique";
	profile: string;
	xmlns?: string;
	children: Array<any>;

	constructor() {
		this.profile = null;
		this.xmlns = null;
		this.children = [];
	}

	static parse(el: Element, tags: Array<any> = null): DAETechnique {
		if (el == null) {
			return null;
		}
		var value = new DAETechnique();
		value.profile = DAEUtil.getStringAttr(el, "profile");
		value.xmlns = DAEUtil.getStringAttr(el, "xmlns");
		if (value.children == null) {
			value.children = [];
		}
		DAETechnique.parseChildren(el, value, tags);
		return value;
	}

	static parseArray(parent: Element, tags: Array<any> = null): Array<DAETechnique> {
		if (parent == null) {
			return null;
		}
		var selector = DAEUtil.getChildSelector(DAETechnique.TagName);
		var elements = parent.querySelectorAll(selector);
		if (elements == null || elements.length <= 0) {
			return null;
		}
		var length = elements.length;
		var result: Array<DAETechnique> = [];
		for (var i = 0; i < length; i++) {
			var el = elements[i];
			var instance = DAETechnique.parse(el, tags);
			if (instance == null) {
				continue;
			}
			result.push(instance);
		}
		return result;
	}

	protected static parseChildren(el: Element, value: DAETechnique, tags: Array<any>): void {
		var children = el.children;
		if (children == null || children.length <= 0) {
			return;
		}
		if (tags == null) {
			tags = [];
		}
		for (var i = tags.length - 1; i >= 0; i--) {
			var tag = tags[i];
			if (tag == null
			||  tag.parse == null
			||  tag.TagName == null) {
				tags.splice(i, 1);
			}
		}
		var length = children.length;
		var tagCount = tags.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			if (child == null) {
				continue;
			}
			var instance: any = null;
			for (var n = 0; n < tagCount; n++) {
				var tag = tags[n];
				if (child.tagName !== tag.TagName) {
					continue;
				}
				instance = tag.parse(child);
				if (instance != null) {
					value.children.push(instance);
					break;
				}
			}
			if (instance != null) {
				continue;
			}
			instance = DAEElement.parse(child);
			if (instance != null) {
				value.children.push(instance);
			}
		}
	}

	toXML(): Element {
		var el = document.createElement(DAETechnique.TagName);
		DAEUtil.setAttr(el, "profile", this.profile);
		DAEUtil.setAttr(el, "xmlns", this.xmlns);
		DAEUtil.addElementArray(el, this.children);
		return el;
	}
}
