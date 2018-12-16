import { DAEUtil } from "../../DAEUtil";
import { DAEAsset } from "../../core/metadata/DAEAsset";
import { DAEPhysicsScene } from "./DAEPhysicsScene";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: COLLADA
export class DAELibraryPhysicsScenes {
	static readonly TagName: string = "library_physics_scenes";
	id?: string;
	name?: string;
	asset?: DAEAsset;
	physicsScenes: Array<DAEPhysicsScene>;
	extras?: Array<DAEExtra>;

	constructor() {
		this.id = null;
		this.name = null;
		this.asset = null;
		this.physicsScenes = null;
		this.extras = null;
	}

	static parse(el: Element): DAELibraryPhysicsScenes {
		if (el == null) {
			return null;
		}
		var value = new DAELibraryPhysicsScenes();
		value.id = DAEUtil.getStringAttr(el, "id");
		value.name = DAEUtil.getStringAttr(el, "name");
		value.asset = DAEAsset.parse(
			DAEUtil.queryChildSelector(el, DAEAsset.TagName)
		);
		value.physicsScenes = DAEPhysicsScene.parseArray(el);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryPhysicsScenes.TagName);
		DAEUtil.setAttr(el, "id", this.id);
		DAEUtil.setAttr(el, "name", this.name);
		DAEUtil.addElement(el, this.asset);
		DAEUtil.addElementArray(el, this.physicsScenes);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
