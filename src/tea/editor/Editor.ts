import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";
import { EditorBehavior } from "./EditorBehavior";
import { Button } from "./basic/Button";
import { CheckBox } from "./basic/CheckBox";
import { ColorPicker } from "./basic/ColorPicker";
import { ContextMenu } from "./basic/ContextMenu";
import { HResizeBar } from "./basic/HResizeBar";
import { InputNumber } from "./basic/InputNumber";
import { InputRange } from "./basic/InputRange";
import { InputText } from "./basic/InputText";
import { Inspector } from "./Inspector";
import { Label } from "./basic/Label";
import { ListView } from "./basic/ListView";
import { NativeContextMenu } from "./basic/NativeContextMenu";
import { ObjectTitle } from "./basic/ObjectTitle";
import { Rectangle } from "./basic/Rectangle";
import { SelectAspect } from "./basic/SelectAspect";
import { SelectEnum } from "./basic/SelectEnum";
import { TextArea } from "./basic/TextArea";
import { TreeView } from "./basic/TreeView";
import { Vector3 } from "./basic/Vector3";
import { VResizeBar } from "./basic/VResizeBar";

import { Panel } from "./containers/Panel";
import { HLayout } from "./containers/HLayout";
import { VLayout } from "./containers/VLayout";

import { BoxCollider } from "./components/BoxCollider";
import { Camera } from "./components/Camera";
import { Light } from "./components/Light";
import { LineRenderer } from "./components/LineRenderer";
import { MeshFilter } from "./components/MeshFilter";
import { MeshRenderer } from "./components/MeshRenderer";
import { ParticleSystem } from "./components/ParticleSystem";
import { Rigidbody } from "./components/Rigidbody";
import { Script } from "./components/Script";
import { TextMesh } from "./components/TextMesh";

//*
Vue.component("Button", Button);
Vue.component("CheckBox", CheckBox);
Vue.component("ColorPicker", ColorPicker);
Vue.component("ContextMenu", ContextMenu);
Vue.component("HResizeBar", HResizeBar);
Vue.component("InputNumber", InputNumber);
Vue.component("InputRange", InputRange);
Vue.component("InputText", InputText);
Vue.component("Inspector", Inspector);
Vue.component("Label", Label);
Vue.component("ListView", ListView);
Vue.component("ObjectTitle", ObjectTitle);
Vue.component("Rectangle", Rectangle);
Vue.component("SelectAspect", SelectAspect);
Vue.component("SelectEnum", SelectEnum);
Vue.component("TextArea", TextArea);
Vue.component("TreeView", TreeView);
Vue.component("Vector3", Vector3);
Vue.component("VResizeBar", VResizeBar);

Vue.component("Panel", Panel);
Vue.component("HLayout", HLayout);
Vue.component("VLayout", VLayout);

Vue.component("BoxCollider", BoxCollider);
Vue.component("Camera", Camera);
Vue.component("Light", Light);
Vue.component("LineRenderer", LineRenderer);
Vue.component("MeshFilter", MeshFilter);
Vue.component("MeshRenderer", MeshRenderer);
Vue.component("ParticleSystem", ParticleSystem);
Vue.component("Rigidbody", Rigidbody);
Vue.component("Script", Script);
Vue.component("TextMesh", TextMesh);
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
				<VLayout class="LeftLayout">
					<HLayout class="TopLeftLayout">
						<Panel ref="left" class="LeftPanel">
							<TreeView ref="hierarchy" tabindex="0"></TreeView>
							<HResizeBar ref="hierarchyResize"></HResizeBar>
						</Panel>
						<Panel ref="main" class="MainPanel">
							<VLayout
								:style="{
									height: '100%'
								}">
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
					</HLayout>
					<HLayout class="BottomLayout">
						<Panel class="BottomPanel">
							<TreeView ref="project" tabindex="1"></TreeView>
						</Panel>
						<Panel class="FileList">
							<TreeView ref="fileList" tabindex="2"></TreeView>
						</Panel>
						<VResizeBar ref="projectResize" :isTop="true"></VResizeBar>
					</HLayout>
				</VLayout>
				<Panel ref="right" class="RightPanel">
					<Inspector ref="inspector"></Inspector>
					<HResizeBar ref="inspectorResize" :isLeft="true"></HResizeBar>
				</Panel>
			</HLayout>
			<div
				ref="dragImages"
				class="dragImages">
			</div>
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

	get projectView(): TreeView {
		return this.$refs.project as TreeView;
	}

	get fileList(): TreeView {
		return this.$refs.fileList as TreeView;
	}

	get dragImages(): HTMLElement {
		return this.$refs.dragImages as HTMLElement;
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
var  _CheckBox = CheckBox;
type _CheckBox = CheckBox;
var  _ContextMenu = ContextMenu;
type _ContextMenu = ContextMenu;
var  _InputNumber = InputNumber;
type _InputNumber = InputNumber;
var  _Inspector = Inspector;
type _Inspector = Inspector;
var  _Label = Label;
type _Label = Label;
var  _ListView = ListView;
type _ListView = ListView;
var  _NativeContextMenu = NativeContextMenu;
type _NativeContextMenu = NativeContextMenu;
var  _Rect = Rectangle;
type _Rect = Rectangle;
var  _TreeView = TreeView;
type _TreeView = TreeView;
var  _Vector3 = Vector3;
type _Vector3 = Vector3;

var  _Panel = Panel;
type _Panel = Panel;
var  _HLayout = HLayout;
type _HLayout = HLayout;
var  _VLayout = VLayout;
type _VLayout = VLayout;

var  _BoxCollider = BoxCollider;
type _BoxCollider = BoxCollider;
var  _Camera = Camera;
type _Camera = Camera;
var  _Light = Light;
type _Light = Light;
var  _LineRenderer = LineRenderer;
type _LineRenderer = LineRenderer;
var  _MeshFilter = MeshFilter;
type _MeshFilter = MeshFilter;
var  _MeshRenderer = MeshRenderer;
type _MeshRenderer = MeshRenderer;
var  _ParticleSystem = ParticleSystem;
type _ParticleSystem = ParticleSystem;
var  _Rigidbody = Rigidbody;
type _Rigidbody = Rigidbody;
var  _Script = Script;
type _Script = Script;
var  _TextMesh = TextMesh;
type _TextMesh = TextMesh;

export module Editor {
	export var  Button = _Button;
	export type Button = _Button;
	export var  CheckBox = _CheckBox;
	export type CheckBox = _CheckBox;
	export var  ContextMenu = _ContextMenu;
	export type ContextMenu = _ContextMenu;
	export var  ContextMenuItem = ContextMenu.Item;
	export type ContextMenuItem = ContextMenu.Item;
	export var  InputNumber = _InputNumber;
	export type InputNumber = _InputNumber;
	export var  Inspector = _Inspector;
	export type Inspector = _Inspector;
	export var  Label = _Label;
	export type Label = _Label;
	export var  ListView = _ListView;
	export type ListView = _ListView;
	export var  NativeContextMenu = _NativeContextMenu;
	export type NativeContextMenu = _NativeContextMenu;
	export var  Rect = _Rect;
	export type Rect = _Rect;
	export var  TreeView = _TreeView;
	export type TreeView = _TreeView;
	export var  TreeViewItem = TreeView.Item;
	export type TreeViewItem = TreeView.Item;
	export var  Vector3 = _Vector3;
	export type Vector3 = _Vector3;

	export var  Panel = _Panel;
	export type Panel = _Panel;
	export var  HLayout = _HLayout;
	export type HLayout = _HLayout;
	export var  VLayout = _VLayout;
	export type VLayout = _VLayout;

	export var  BoxCollider = _BoxCollider;
	export type BoxCollider = _BoxCollider;
	export var  Camera = _Camera;
	export type Camera = _Camera;
	export var  Light = _Light;
	export type Light = _Light;
	export var  LineRenderer = _LineRenderer;
	export type LineRenderer = _LineRenderer;
	export var  MeshFilter = _MeshFilter;
	export type MeshFilter = _MeshFilter;
	export var  MeshRenderer = _MeshRenderer;
	export type MeshRenderer = _MeshRenderer;
	export var  ParticleSystem = _ParticleSystem;
	export type ParticleSystem = _ParticleSystem;
	export var  Rigidbody = _Rigidbody;
	export type Rigidbody = _Rigidbody;
	export var  Script = _Script;
	export type Script = _Script;
	export var  TextMesh = _TextMesh;
	export type TextMesh = _TextMesh;
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
