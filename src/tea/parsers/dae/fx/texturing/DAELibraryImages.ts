import { DAEUtil } from "../../DAEUtil";

// parent: 
export class DAELibraryImages {
	static readonly TagName: string = "library_images";
	id?: string;

	constructor() {
		this.id = null;
	}

	static parse(el: Element): DAELibraryImages {
		if (el == null) {
			//console.error("parse error");
			return null;
		}
		var value = new DAELibraryImages();
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAELibraryImages.TagName);
		return el;
	}
}
