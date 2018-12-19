import { DAEUtil } from "../../DAEUtil";
import { DAEAccessor } from "../data/DAEAccessor";
import { DAEPerspective } from "../camera/DAEPerspective";
import { DAEElement } from "../../DAEElement";

// parent: bind_material, instance_rigid_body, light, optics, physics_material, 
// physics_scene, rigid_body, rigid_constraint, source(core), motion, 
// kinematics, kinematics_model
export class DAETechniqueCommon {
	static readonly TagName: string = "technique_common";
	accessor: DAEAccessor;
	children: Array<any>;

	constructor() {
		this.accessor = null;
		this.children = [];
	}

	static parse(el: Element, tags: Array<any> = null): DAETechniqueCommon {
		if (el == null) {
			return null;
		}
		var value = new DAETechniqueCommon();
		value.accessor = DAEAccessor.parse(
			DAEUtil.queryChildSelector(el, DAEAccessor.TagName)
		);
		if (value.children == null) {
			value.children = [];
		}
		DAETechniqueCommon.parseChildren(el, value, tags);
		return value;
	}

	protected static parseChildren(el: Element, value: DAETechniqueCommon, tags: Array<any>): void {
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
			if (child.tagName === DAEAccessor.TagName) {
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
		var el = document.createElement(DAETechniqueCommon.TagName);
		DAEUtil.addElement(el, this.accessor);
		DAEUtil.addElementArray(el, this.children);
		return el;
	}
}
