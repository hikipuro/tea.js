import Vue from "vue";
import Component from "vue-class-component";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="FileInspector">
			<div class="title">File</div>
			<div class="textContainer">
				<textarea readonly wrap="off">{{ text }}</textarea>
			</div>
			<div class="size">{{ fileType }} - {{ size }}</div>
			<div class="created">Created: {{ createdTime }}</div>
			<div class="modified">Modified: {{ modifiedTime }}</div>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "",
			text: "",
			fileType: "",
			size: "",
			createdTime: "",
			modifiedTime: ""
		}
	}
})
export class FileInspector extends Vue {
	translator: any;
	name: string;
	text: string;
	fileType: string;
	size: string;
	createdTime: string;
	modifiedTime: string;

	translate(): void {
		var translator = Translator.getInstance();
		translator.basePath = "FileInspector";
	}

	setSize(size: number): void {
		this.size = this.getSizeString(size);
	}

	setCreatedTime(date: Date): void {
		this.createdTime = this.getDateTimeString(date);
	}

	setModifiedTime(date: Date): void {
		this.modifiedTime = this.getDateTimeString(date);
	}

	protected created(): void {
		this.translate();
	}

	protected getSizeString(size: number): string {
		var units = [
			"bytes",
			"KB",
			"MB",
			"GB",
			"TB"
		];
		var unit = 1000;
		var i = 0;
		for (; size >= unit; i++) {
			size /= unit;
		}
		return Math.round(size) + " " + units[i];
	}

	protected getDateTimeString(date: Date): string {
		if (date == null) {
			return "";
		}
		var options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric"
		};
		return date.toLocaleString(undefined, options);
	}
}
