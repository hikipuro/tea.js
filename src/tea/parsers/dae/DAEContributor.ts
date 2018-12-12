import { DAEUtil } from "./DAEUtil";

// parent: asset
export class DAEContributor {
	author: string;
	authorEmail: string;
	authorWebsite: string;
	authoringTool: string;
	comments: string;
	copyright: string;
	sourceData: string;

	constructor() {
		this.author = null;
		this.authorEmail = null;
		this.authorWebsite = null;
		this.authoringTool = null;
		this.comments = null;
		this.copyright = null;
		this.sourceData = null;
	}

	static parse(el: Element): DAEContributor {
		if (el == null) {
			return null;
		}
		var contributor = new DAEContributor();
		contributor.author = DAEUtil.textContent(el, "author");
		contributor.authorEmail = DAEUtil.textContent(el, "author_email");
		contributor.authorWebsite = DAEUtil.textContent(el, "author_website");
		contributor.authoringTool = DAEUtil.textContent(el, "authoring_tool");
		contributor.comments = DAEUtil.textContent(el, "comments");
		contributor.copyright = DAEUtil.textContent(el, "copyright");
		contributor.sourceData = DAEUtil.textContent(el, "source_data");
		return contributor;
	}

	toXML(): Element {
		var el = document.createElement("contributor");
		DAEUtil.addTextContent(el, "author", this.author);
		DAEUtil.addTextContent(el, "author_email", this.authorEmail);
		DAEUtil.addTextContent(el, "author_website", this.authorWebsite);
		DAEUtil.addTextContent(el, "authoring_tool", this.authoringTool);
		DAEUtil.addTextContent(el, "comments", this.comments);
		DAEUtil.addTextContent(el, "copyright", this.copyright);
		DAEUtil.addTextContent(el, "source_data", this.sourceData);
		return el;
	}
}
