import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../metadata/DAEAsset";
import { DAENode } from "./DAENode";
import { DAEExtra } from "../extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryNodes {
	static readonly TagName: string = "library_nodes";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	nodes: Array<DAENode>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.nodes = [];
		this.extras = null;
	}

	static parse(el: Element): DAELibraryNodes {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryNodes();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.nodes = DAENode.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryNodes.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.nodes);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
