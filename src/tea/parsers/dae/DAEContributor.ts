export class DAEContributor {
	author: string;
	authoringTool: string;

	constructor() {
		this.author = "";
		this.authoringTool = "";
	}

	static parse(el: Element): DAEContributor {
		if (el == null) {
			return null;
		}
		var contributor = new DAEContributor();
		var $author = el.querySelector("author");
		contributor.author = $author.textContent;
		var $authoringTool = el.querySelector("authoring_tool");
		contributor.authoringTool = $authoringTool.textContent;
		return contributor;
	}
}
