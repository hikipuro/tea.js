import { DAEUtil } from "../../DAEUtil";

// parent: asset
export class DAEContributor {
	static readonly TagName: string = "contributor";
	author?: string;
	authorEmail?: string;
	authorWebsite?: string;
	authoringTool?: string;
	comments?: string;
	copyright?: string;
	sourceData?: string;

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
		var value = new DAEContributor();
		value.author = DAEUtil.getStringContent(el, "author");
		value.authorEmail = DAEUtil.getStringContent(el, "author_email");
		value.authorWebsite = DAEUtil.getStringContent(el, "author_website");
		value.authoringTool = DAEUtil.getStringContent(el, "authoring_tool");
		value.comments = DAEUtil.getStringContent(el, "comments");
		value.copyright = DAEUtil.getStringContent(el, "copyright");
		value.sourceData = DAEUtil.getStringContent(el, "source_data");
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEContributor.TagName);
		DAEUtil.addStringContent(el, "author", this.author);
		DAEUtil.addStringContent(el, "author_email", this.authorEmail);
		DAEUtil.addStringContent(el, "author_website", this.authorWebsite);
		DAEUtil.addStringContent(el, "authoring_tool", this.authoringTool);
		DAEUtil.addStringContent(el, "comments", this.comments);
		DAEUtil.addStringContent(el, "copyright", this.copyright);
		DAEUtil.addStringContent(el, "source_data", this.sourceData);
		return el;
	}
}
