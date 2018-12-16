import { DAEUtil } from "../../DAEUtil";
import { DAEAnnotate } from "../../fx/effects/DAEAnnotate";
import { DAESemanticType } from "../data/DAESemanticType";
import { DAEModifier } from "../../fx/parameters/DAEModifier";

// TODO: fix parse(), toXML()

// parent:
// core: formula
export class DAENewparam {
	static readonly TagName: string = "newparam";
	sid: string;
	annotates?: Array<DAEAnnotate>;
	semantic?: DAESemanticType;
	modifier?: DAEModifier;
	data: any;

	constructor() {
		this.sid = "";
		this.annotates = null;
		this.semantic = null;
		this.modifier = null;
		this.data = null;
	}

	static parse(el: Element): DAENewparam {
		if (el == null) {
			return null;
		}
		var value = new DAENewparam();
		value.sid = DAEUtil.getStringAttr(el, "sid");
		value.annotates = DAEAnnotate.parseArray(el);
		var $semantic = DAEUtil.queryChildSelector(el, "semantic");
		if ($semantic != null) {
			value.semantic = DAESemanticType[$semantic.textContent];
		} else {
			value.semantic = null;
		}
		value.modifier = DAEModifier.parse(
			DAEUtil.queryChildSelector(el, DAEModifier.TagName)
		);
		value.data = DAEUtil.getFloatContent(el, "float");
		if (value.data == null) {
			value.data = DAEUtil.getIntContent(el, "int");
		}
		if (value.data == null) {
			value.data = DAEUtil.getBoolContent(el, "bool");
		}
		if (value.data == null) {
			value.data = DAEUtil.getStringContent(el, "SIDREF");
		}
		return value;
	}

	static parseArray(parent: Element): Array<DAENewparam> {
		return DAEUtil.parseArray<DAENewparam>(
			this.parse, parent, DAENewparam.TagName
		);
	}

	toXML(): Element {
		var el = document.createElement(DAENewparam.TagName);
		DAEUtil.setAttr(el, "sid", this.sid);
		DAEUtil.addElementArray(el, this.annotates);
		if (this.semantic != null) {
			var $semantic = document.createElement("semantic");
			DAEUtil.setStringContent($semantic, DAESemanticType.toString(this.semantic));
			el.appendChild($semantic);
		}
		DAEUtil.addElement(el, this.modifier);
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
