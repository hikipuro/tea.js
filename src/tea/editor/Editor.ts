import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";
import { EditorBehavior } from "./EditorBehavior";
import { Button } from "./Button";
import { Camera } from "./Camera";
import { CheckBox } from "./CheckBox";
import { ContextMenu } from "./ContextMenu";
import { HLayout } from "./HLayout";
import { InputNumber } from "./InputNumber";
import { Inspector } from "./Inspector";
import { Label } from "./Label";
import { ListView } from "./ListView";
import { Panel } from "./Panel";
import { Rectangle } from "./Rectangle";
import { SelectAspect } from "./SelectAspect";
import { TreeView } from "./TreeView";
import { Vector3 } from "./Vector3";
import { VLayout } from "./VLayout";

//*
Vue.component("Button", Button);
Vue.component("Camera", Camera);
Vue.component("CheckBox", CheckBox);
Vue.component("ContextMenu", ContextMenu);
Vue.component("HLayout", HLayout);
Vue.component("InputNumber", InputNumber);
Vue.component("Inspector", Inspector);
Vue.component("Label", Label);
Vue.component("ListView", ListView);
Vue.component("Panel", Panel);
Vue.component("Rectangle", Rectangle);
Vue.component("SelectAspect", SelectAspect);
Vue.component("TreeView", TreeView);
Vue.component("Vector3", Vector3);
Vue.component("VLayout", VLayout);
//*/

@Component({
	template: `
		<div
			id="editor"
			@click.capture="onClick">
			<HLayout
				:style="{
					height: '100%'
				}">
				<Panel ref="left" class="LeftPanel">
					<TreeView ref="hierarchy" tabindex="0"></TreeView>
				</Panel>
				<Panel ref="main" class="MainPanel">
					<VLayout>
						<Panel class="Toolbar">
							<SelectAspect
								ref="aspect"
								@update="onUpdateAspect">
							</SelectAspect>
						</Panel>
						<Panel class="CanvasPanel">
							<canvas ref="canvas" id="canvas"></canvas>
						</Panel>
					</VLayout>
				</Panel>
				<Panel ref="right" class="RightPanel">
					<Inspector ref="inspector"></Inspector>
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
	protected _behavior: EditorBehavior;

	created(): void {
		this._behavior = new EditorBehavior(this);
	}

	/*
	addComponent(name: string, component: Vue): void {
		Vue.component(name, component);
	}
	//*/

	get hierarchyView(): TreeView {
		return this.$refs.hierarchy as TreeView;
	}

	get inspectorView(): Inspector {
		return this.$refs.inspector as Inspector;
	}

	get contextMenu(): ContextMenu {
		return this.$refs.menu as ContextMenu;
	}

	setScene(value: Tea.Scene) {
		this._behavior.scene = value;
	}

	protected onUpdateAspect(): void {
		this._behavior.onUpdateAspect();
	}

	protected onClick(e: MouseEvent): void {
		var parent = e.srcElement.parentElement;
		if (parent && parent.classList.contains("ContextMenu")) {
			return;
		}
		if (this.contextMenu.isVisible) {
			this.contextMenu.hide();
			e.stopPropagation();
		}
	}
}

var  _Button = Button;
type _Button = Button;
var  _Camera = Camera;
type _Camera = Camera;
var  _CheckBox = CheckBox;
type _CheckBox = CheckBox;
var  _ContextMenu = ContextMenu;
type _ContextMenu = ContextMenu;
var  _HLayout = HLayout;
type _HLayout = HLayout;
var  _InputNumber = InputNumber;
type _InputNumber = InputNumber;
var  _Inspector = Inspector;
type _Inspector = Inspector;
var  _Label = Label;
type _Label = Label;
var  _ListView = ListView;
type _ListView = ListView;
var  _Panel = Panel;
type _Panel = Panel;
var  _Rect = Rectangle;
type _Rect = Rectangle;
var  _TreeView = TreeView;
type _TreeView = TreeView;
var  _Vector3 = Vector3;
type _Vector3 = Vector3;
var  _VLayout = VLayout;
type _VLayout = VLayout;

export module Editor {
	export var  Button = _Button;
	export type Button = _Button;
	export var  Camera = _Camera;
	export type Camera = _Camera;
	export var  CheckBox = _CheckBox;
	export type CheckBox = _CheckBox;
	export var  ContextMenu = _ContextMenu;
	export type ContextMenu = _ContextMenu;
	export var  ContextMenuItem = ContextMenu.Item;
	export type ContextMenuItem = ContextMenu.Item;
	export var  HLayout = _HLayout;
	export type HLayout = _HLayout;
	export var  InputNumber = _InputNumber;
	export type InputNumber = _InputNumber;
	export var  Inspector = _Inspector;
	export type Inspector = _Inspector;
	export var  Label = _Label;
	export type Label = _Label;
	export var  ListView = _ListView;
	export type ListView = _ListView;
	export var  Panel = _Panel;
	export type Panel = _Panel;
	export var  Rect = _Rect;
	export type Rect = _Rect;
	export var  TreeView = _TreeView;
	export type TreeView = _TreeView;
	export var  TreeViewItem = TreeView.Item;
	export type TreeViewItem = TreeView.Item;
	export var  Vector3 = _Vector3;
	export type Vector3 = _Vector3;
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
