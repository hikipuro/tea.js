export class DaeContributor {
	author: string;
	authoringTool: string;

	constructor() {
		this.author = "";
		this.authoringTool = "";
	}

	static parse(el: Element): DaeContributor {
		if (el == null) {
			return null;
		}
		var contributor = new DaeContributor();
		var $author = el.querySelector("author");
		contributor.author = $author.textContent;
		var $authoringTool = el.querySelector("authoring_tool");
		contributor.authoringTool = $authoringTool.textContent;
		return contributor;
	}
}
