import Vue from "vue";
import Component from "vue-class-component";
import { Button } from "./Button";
import { ContextMenu } from "./ContextMenu";
import { HLayout } from "./HLayout";
import { Label } from "./Label";
import { ListView } from "./ListView";
import { Panel } from "./Panel";
import { TreeView } from "./TreeView";
import { VLayout } from "./VLayout";

//*
Vue.component("Button", Button);
Vue.component("ContextMenu", ContextMenu);
Vue.component("HLayout", HLayout);
Vue.component("Label", Label);
Vue.component("ListView", ListView);
Vue.component("Panel", Panel);
Vue.component("TreeView", TreeView);
Vue.component("VLayout", VLayout);
//*/

@Component({
	template: `
		<div
			id="editor"
			@mousedown="onMouseDown">
			<HLayout
				:style="{
					height: '100%'
				}">
				<Panel ref="left" class="LeftPanel">
					<TreeView></TreeView>
				</Panel>
				<Panel ref="main" class="MainPanel">
					<canvas id="canvas"></canvas>
				</Panel>
				<Panel class="RightPanel">
					<TreeView ref="right"></TreeView>
				</Panel>
			</HLayout>
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
	panels: Editor.Panels;

	constructor(obj: any) {
		super(obj);
		this.panels = new Editor.Panels(this);
		this.$nextTick(() => {
			this.panels.left.isResizableX = true;
		});
	}

	get layout(): HLayout {
		return this.$refs.layout as HLayout;
	}

	get menu(): ContextMenu {
		return this.$refs.menu as ContextMenu;
	}
	
	children(index: number): Vue {
		return this.$children[index];
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
var  _HLayout = HLayout;
type _HLayout = HLayout;
var  _Label = Label;
type _Label = Label;
var  _ListView = ListView;
type _ListView = ListView;
var  _Panel = Panel;
type _Panel = Panel;
var  _TreeView = TreeView;
type _TreeView = TreeView;
var  _VLayout = VLayout;
type _VLayout = VLayout;

export module Editor {
	export class Panels {
		editor: Editor;
		constructor(editor: Editor) {
			this.editor = editor;
		}
		get left(): Panel {
			var $refs = this.editor.$refs;
			return $refs.left as Panel;
		}
	}
	export var  Button = _Button;
	export type Button = _Button;
	export var  ContextMenu = _ContextMenu;
	export type ContextMenu = _ContextMenu;
	export var  HLayout = _HLayout;
	export type HLayout = _HLayout;
	export var  Label = _Label;
	export type Label = _Label;
	export var  ListView = _ListView;
	export type ListView = _ListView;
	export var  Panel = _Panel;
	export type Panel = _Panel;
	export var  TreeView = _TreeView;
	export type TreeView = _TreeView;
	export var  VLayout = _VLayout;
	export type VLayout = _VLayout;
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
