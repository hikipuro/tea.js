import Vue from "vue";
import Component from "vue-class-component";
import { Button } from "./Button";
import { ContextMenu } from "./ContextMenu";
import { Label } from "./Label";
import { ListView } from "./ListView";
import { Pane } from "./Pane";
import { TreeView } from "./TreeView";

//*
Vue.component("Button", Button);
Vue.component("ContextMenu", ContextMenu);
Vue.component("Label", Label);
Vue.component("ListView", ListView);
Vue.component("Pane", Pane);
Vue.component("TreeView", TreeView);
//*/

@Component({
	template: `
		<div
			id="editor"
			@mousedown="onMouseDown">
			<Pane ref="left" class="LeftPane"></Pane>
			<Pane ref="main" class="MainPane"></Pane>
			<ContextMenu ref="menu"></ContextMenu>
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

	get menu(): ContextMenu {
		return this.$refs.menu as ContextMenu;
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

	protected onMouseDown(e: MouseEvent): void {
		var parent = e.srcElement.parentElement;
		if (parent && parent.classList.contains("ContextMenu")) {
			return;
		}
		this.menu.hide();
	}
}

var  _Button = Button;
type _Button = Button;
var  _ContextMenu = ContextMenu;
type _ContextMenu = ContextMenu;
var  _Label = Label;
type _Label = Label;
var  _ListView = ListView;
type _ListView = ListView;
var  _Pane = Pane;
type _Pane = Pane;
var  _TreeView = TreeView;
type _TreeView = TreeView;

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
	export var  ContextMenu = _ContextMenu;
	export type ContextMenu = _ContextMenu;
	export var  Label = _Label;
	export type Label = _Label;
	export var  ListView = _ListView;
	export type ListView = _ListView;
	export var  Pane = _Pane;
	export type Pane = _Pane;
	export var  TreeView = _TreeView;
	export type TreeView = _TreeView;
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
