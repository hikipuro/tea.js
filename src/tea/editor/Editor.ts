import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

import { EditorBehavior } from "./EditorBehavior";
import { ConsoleView } from "./ConsoleView";
import { HierarchyView } from "./HierarchyView";
import { ProjectView } from "./ProjectView";
import { InspectorView } from "./InspectorView";
import { ObjectInspector } from "./ObjectInspector";

import { Button } from "./basic/Button";
import { CheckBox } from "./basic/CheckBox";
import { ColorPicker } from "./basic/ColorPicker";
import { ContextMenu } from "./basic/ContextMenu";
import { HResizeBar } from "./basic/HResizeBar";
import { ImageSelector } from "./basic/ImageSelector";
import { InputNumber } from "./basic/InputNumber";
import { InputRange } from "./basic/InputRange";
import { InputText } from "./basic/InputText";
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
import { Tabs, TabItem } from "./containers/Tabs";
import { Window } from "./containers/Window";

import { AudioSource } from "./components/AudioSource";
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
Vue.component("ObjectInspector", ObjectInspector);

Vue.component("Button", Button);
Vue.component("CheckBox", CheckBox);
Vue.component("ColorPicker", ColorPicker);
Vue.component("ContextMenu", ContextMenu);
Vue.component("HResizeBar", HResizeBar);
Vue.component("ImageSelector", ImageSelector);
Vue.component("InputNumber", InputNumber);
Vue.component("InputRange", InputRange);
Vue.component("InputText", InputText);
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
Vue.component("Tabs", Tabs);
Vue.component("TabItem", TabItem);
Vue.component("Window", Window);

Vue.component("AudioSource", AudioSource);
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
			ref="container"
			@click.capture="onClick">
			<HLayout
				:style="{
					height: '100%'
				}">
				<VLayout class="LeftLayout">
					<HLayout class="TopLeftLayout">
						<Panel ref="left" class="LeftPanel">
							<HierarchyView ref="hierarchy"></HierarchyView>
							<HResizeBar ref="hierarchyResize"></HResizeBar>
						</Panel>
						<Tabs ref="mainTabs" class="Top">
							<TabItem name="Player" class="MainPanel">
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
									<Panel ref="playerPanel" class="PlayerPanel">
										<canvas ref="canvas" id="canvas"></canvas>
									</Panel>
								</VLayout>
							</TabItem>
							<TabItem name="Scene">
								<Panel ref="scenePanel" class="ScenePanel">
								</Panel>
							</TabItem>
						</Tabs>
					</HLayout>
					<Tabs class="Bottom">
						<TabItem name="Project">
							<ProjectView ref="project"></ProjectView>
						</TabItem>
						<TabItem name="Console">
							<ConsoleView ref="console"></ConsoleView>
						</TabItem>
						<VResizeBar ref="projectResize" :isTop="true"></VResizeBar>
					</Tabs>
				</VLayout>
				<Panel ref="right" class="RightPanel">
					<InspectorView ref="inspector"></InspectorView>
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
	components: {
		ConsoleView: ConsoleView,
		HierarchyView: HierarchyView,
		ProjectView: ProjectView,
		InspectorView: InspectorView
	}
})
export class Editor extends Vue {
	static instance: Editor;
	static readonly el = "#editor";
	protected _behavior: EditorBehavior;

	mounted(): void {
		this._behavior = new EditorBehavior(this);
	}

	/*
	addComponent(name: string, component: Vue): void {
		Vue.component(name, component);
	}
	//*/

	get consoleView(): ConsoleView {
		return this.$refs.console as ConsoleView;
	}

	get hierarchyView(): HierarchyView {
		return this.$refs.hierarchy as HierarchyView;
	}

	get inspectorView(): InspectorView {
		return this.$refs.inspector as InspectorView;
	}

	get projectView(): ProjectView {
		return this.$refs.project as ProjectView;
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

	setScene(scene: Tea.Scene) {
		this._behavior.setScene(scene);
	}

	protected onUpdateAspect(): void {
		this._behavior.updateScreenSize();
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
var  _Window = Window;
type _Window = Window;

var  _AudioSource = AudioSource;
type _AudioSource = AudioSource;
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
	export var  Window = _Window;
	export type Window = _Window;

	export var  AudioSource = _AudioSource;
	export type AudioSource = _AudioSource;
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
	var editor = document.querySelector("#editor");
	if (editor) {
		Editor.instance = new Editor({
			el: Editor.el
		});
	}
};
document.addEventListener(
	"DOMContentLoaded", loaded
);
