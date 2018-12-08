import Vue from "vue";
import Component from "vue-class-component";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="FileInspector">
			<div class="title">File</div>
			<div
				v-if="type === Type.Text"
				class="textContainer">
				<textarea readonly wrap="off">{{ text }}</textarea>
			</div>
			<div
				v-if="type === Type.Image"
				class="imageContainer">
				<img
					ref="image"
					:src="image"
					@load="onLoadImage">
				<div>Size: {{ width }}x{{ height }}</div>
			</div>
			<div class="size">{{ fileType }} - {{ size }}</div>
			<div class="created">Created: {{ createdTime }}</div>
			<div class="modified">Modified: {{ modifiedTime }}</div>
		</div>
	`,
	data: () => {
		return {
			Type: FileInspector.Type,
			translator: {},
			name: "",
			type: 0,
			text: "",
			image: "",
			width: 0,
			height: 0,
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
	type: FileInspector.Type;
	text: string;
	image: string;
	width: number;
	height: number;
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

	protected onLoadImage(e: Event): void {
		var image = this.$refs.image as HTMLImageElement;
		this.width = image.naturalWidth;
		this.height = image.naturalHeight;
	}
}

export module FileInspector {
	export enum Type {
		Null = 0,
		Text,
		Image
	}
}
