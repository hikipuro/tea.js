import Vue from "vue";
//import Vue from "vue/dist/vue.common";
import { Label } from "./Label";
import { Button } from "./Button";

export class Editor extends Vue {
	static instance: Editor;
	current: string = "Label";

	constructor(obj: any) {
		super(obj);
	}
	onClick(): void {
	}
	nextTick(func: () => void): void {
		Vue.nextTick(func);
	}
}

var loaded = () => {
	document.removeEventListener(
		"DOMContentLoaded", loaded
	);
	Editor.instance = new Editor({
		el: "#editor",
		data: {
			current: ""
		},
		components: {
			"Label": Label,
			"Button": Button
		}
	});
};
document.addEventListener(
	"DOMContentLoaded", loaded
);
