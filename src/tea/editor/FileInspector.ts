import Vue from "vue";
import Component from "vue-class-component";
import { Translator } from "./translate/Translator";

@Component({
	template: `
		<div class="FileInspector">
			<div class="title">File</div>
			<div class="textContainer">
				<textarea readonly wrap="off">{{ text }}</textarea>
			</div>
			<div class="size">Size: {{ size }}</div>
			<div class="create">Create: {{ create }}</div>
			<div class="update">Update: {{ update }}</div>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "",
			text: "",
			size: "",
			create: "",
			update: ""
		}
	}
})
export class FileInspector extends Vue {
	translator: any;
	name: string;
	text: string;
	size: string;
	create: string;
	update: string;

	translate(): void {
		var translator = Translator.getInstance();
		translator.basePath = "FileInspector";
	}

	protected created(): void {
		this.translate();
	}
}
