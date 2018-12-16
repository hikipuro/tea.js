
import { DAELines } from "./DAELines";
import { DAELinestrips } from "./DAELineStrips";
import { DAEPolygons } from "./DAEPolygons";
import { DAEPolylist } from "./DAEPolylist";
import { DAETriangles } from "./DAETriangles";
import { DAETrifans } from "./DAETrifans";
import { DAETristrips } from "./DAETristrips";

export class DAEPrimitiveElement {
	static parseArray(el: Element): Array<DAEPrimitiveElement> {
		if (el == null || el.childElementCount <= 0) {
			return null;
		}
		var elements = [];
		var el = el.firstElementChild;
		while (el != null) {
			var name = el.tagName;
			var child = null;
			switch (name) {
				case DAELines.TagName:
					child = DAELines.parse(el);
					break;
				case DAELinestrips.TagName:
					child = DAELinestrips.parse(el);
					break;
				case DAEPolygons.TagName:
					child = DAEPolygons.parse(el);
					break;
				case DAEPolylist.TagName:
					child = DAEPolylist.parse(el);
					break;
				case DAETriangles.TagName:
					child = DAETriangles.parse(el);
					break;
				case DAETrifans.TagName:
					child = DAETrifans.parse(el);
					break;
				case DAETristrips.TagName:
					child = DAETristrips.parse(el);
					break;
				/*
				case DAESource.TagName:
				case DAEVertices.TagName:
				case DAEExtra.TagName:
					break;
				//*/
				default:
					//console.warn("unknown tag:", name);
					break;
			}
			if (child != null) {
				elements.push(child);
			}
			el = el.nextElementSibling;
		}
		return elements;
	}

	toXML(): Element {
		return null;
	}
}
