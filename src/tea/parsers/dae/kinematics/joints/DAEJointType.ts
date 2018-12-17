import { DAEUtil } from "../../DAEUtil";
import { DAEPrismatic } from "./DAEPrismatic";
import { DAERevolute } from "./DAERevolute";

export class DAEJointType {
	static parse(element: Element): DAEJointType {
		if (element == null) {
			return null;
		}
		var el = DAEUtil.queryChildSelector(
			element, DAEPrismatic.TagName
		);
		if (el != null) {
			return DAEPrismatic.parse(el);
		}
		el = DAEUtil.queryChildSelector(
			element, DAERevolute.TagName
		);
		if (el != null) {
			return DAERevolute.parse(el);
		}
		return null;
	}

	toXML(): Element {
		return null;
	}
}
