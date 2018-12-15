import { DAEUtil } from "../../DAEUtil";
import { DAEAnnotate } from "../../fx/effects/DAEAnnotate";
import { DAESemanticType } from "../data/DAESemanticType";

// TODO: fix parse(), toXML()

// parent:
// core: formula
export class DAENewparam {
	sid: string;
	annotates?: Array<DAEAnnotate>;
	semantic?: DAESemanticType;
	//modifier?: DAEModifier;
	data: any;

	constructor() {
		this.sid = "";
		this.annotates = null;
		this.semantic = null;
		//this.modifier = null;
		this.data = null;
	}

	static parse(el: Element): DAENewparam {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAENewparam();
		value.sid = DAEUtil.stringAttrib(el, "sid");
		value.annotates = DAEAnnotate.parseArray(el);
		var $semantic = el.querySelector(":scope > semantic");
		if ($semantic != null) {
			value.semantic = DAESemanticType[$semantic.textContent];
		}
		value.data = DAEUtil.floatContent(el, "float");
		if (value.data == null) {
			value.data = DAEUtil.intContent(el, "int");
		}
		if (value.data == null) {
			value.data = DAEUtil.boolContent(el, "bool");
		}
		if (value.data == null) {
			value.data = DAEUtil.textContent(el, "SIDREF");
		}
		return value;
	}

	static parseArray(parent: Element): Array<DAENewparam> {
		return DAEUtil.parseArray<DAENewparam>(
			this.parse, parent, "newparam"
		);
	}

	toXML(): Element {
		var el = document.createElement("newparam");
		DAEUtil.setAttribute(el, "sid", this.sid);
		DAEUtil.addXMLArray(el, this.annotates);
		if (this.semantic != null) {
			var $semantic = document.createElement("semantic");
			DAEUtil.setTextContent($semantic, DAESemanticType.toString(this.semantic));
			el.appendChild($semantic);
		}
		DAEUtil.setArrayContent(el, this.data);
		return el;
	}
}
