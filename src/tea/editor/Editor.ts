import Vue from "vue";
import Component from "vue-class-component";
import { Button } from "./Button";
import { Label } from "./Label";
import { ListView } from "./ListView";
import { Pane } from "./Pane";

//*
Vue.component("Button", Button);
Vue.component("Label", Label);
Vue.component("ListView", ListView);
Vue.component("Pane", Pane);
//*/

@Component({
	template: `
		<div id="editor">
			<Pane ref="left" class="LeftPane"></Pane>
			<Pane ref="main" class="MainPane"></Pane>
		</div>
	`,
	data: () => { return {
	}},
	/*
	components: {
		Button: Button,
		Label: Label,
		ListView: ListView,
		Pane: Pane
	}
	//*/
})
export class Editor extends Vue {
	static instance: Editor;
	static readonly el = "#editor";
	current: string = "Label";
	panes: Editor.Panes;

	constructor(obj: any) {
		super(obj);
		this.panes = new Editor.Panes(this);
	}
	
	onClick(): void {
	}
	nextTick(callback: () => void): void {
		this.$nextTick(callback);
	}
	children(index: number): Vue {
		return this.$children[index];
	}
	debug(): void {
		for (var i of this.$children) {
			console.log(i);
		}
	}
}

var  _Button = Button;
type _Button = Button;
var  _Label = Label;
type _Label = Label;
var  _ListView = ListView;
type _ListView = ListView;

export module Editor {
	export class Panes {
		editor: Editor;
		constructor(editor: Editor) {
			this.editor = editor;
		}
		get left(): Pane {
			var $refs = this.editor.$refs;
			return $refs.left as Pane;
		}
		get main(): Pane {
			var $refs = this.editor.$refs;
			return $refs.main as Pane;
		}
	}
	export var  Button = _Button;
	export type Button = _Button;
	export var  Label = _Label;
	export type Label = _Label;
	export var  ListView = _ListView;
	export type ListView = _ListView;
}

var loaded = () => {
	document.removeEventListener(
		"DOMContentLoaded", loaded
	);
	Editor.instance = new Editor({
		el: Editor.el
	});
};
document.addEventListener(
	"DOMContentLoaded", loaded
);
