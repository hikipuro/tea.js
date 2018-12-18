import { DAEUtil } from "../../DAEUtil";

// parent: shader
export class DAESources {
	static readonly TagName: string = "sources";
	entry?: string;
	inlines?: Array<string>;
	imports?: Array<string>;

	constructor() {
		this.entry = null;
		this.inlines = null;
		this.imports = null;
	}

	static parse(el: Element): DAESources {
		if (el == null) {
			return null;
		}
		var value = new DAESources();
		value.entry = DAEUtil.getStringAttr(el, "entry");
		value.inlines = DAEUtil.getStringArrayContent(el, "inline");
		value.imports = DAEUtil.getStringArrayContent(el, "import");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAESources.TagName);
		DAEUtil.setAttr(el, "entry", this.entry);
		DAEUtil.addStringArrayContent(el, "inline", this.inlines);
		DAEUtil.addStringArrayContent(el, "import", this.imports);
		return el;
	}
}
