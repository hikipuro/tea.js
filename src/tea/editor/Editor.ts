import Vue from "vue";
import Component from "vue-class-component";
import { NoCache } from "./basic/NoCache";
import * as Tea from "../Tea";

import * as BasicComponents from "./basic/BasicComponents";
import * as Containers from "./containers/Containers";
import * as TeaComponents from "./components/TeaComponents";

import { EditorAssets } from "./EditorAssets";
import { EditorSettings } from "./EditorSettings";
import { Translator } from "./translate/Translator";
import { EditorBehavior } from "./EditorBehavior";
import { EditorStatus } from "./EditorStatus";
import { EditorCommand } from "./commands/EditorCommand";
import { ToolBox } from "./views/ToolBox";
import { ConsoleView } from "./views/ConsoleView";
import { HierarchyView } from "./views/HierarchyView";
import { ProjectView } from "./views/ProjectView";
import { InspectorView } from "./views/InspectorView";
import { FileInspector } from "./views/FileInspector";
import { ObjectInspector } from "./views/ObjectInspector";
import { DragImages } from "./views/DragImages";

Vue.config.devtools = false;
Vue.config.productionTip = false;

var vueComponents = {
	FileInspector: FileInspector,
	ObjectInspector: ObjectInspector,
};
Object.assign(
	vueComponents,
	BasicComponents.getComponents()
);
Object.assign(
	vueComponents,
	Containers.getComponents()
);
Object.assign(
	vueComponents,
	TeaComponents.getComponents()
);
Object.keys(vueComponents).forEach((key: string) => {
	Vue.component(key, vueComponents[key]);
});

@Component({
	template: `
		<div
			id="editor"
			ref="container"
			@click.capture="onClick">
			<VLayout style="height: 100%">
				<ToolBox ref="toolBox"></ToolBox>
				<HLayout>
					<VLayout class="LeftLayout">
						<HLayout class="TopLeftLayout">
							<Panel ref="left" class="LeftPanel">
								<HierarchyView ref="hierarchy"></HierarchyView>
								<HResizeBar ref="hierarchyResize"></HResizeBar>
							</Panel>
							<Tabs
								ref="mainTabs"
								class="Top"
								:tabindex="0">
								<TabItem tabId="player" :name="translator.player" class="MainPanel">
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
								<TabItem tabId="scene" :name="translator.scene">
									<Panel ref="scenePanel" class="ScenePanel">
									</Panel>
								</TabItem>
							</Tabs>
						</HLayout>
						<Tabs
							class="Bottom"
							:tabindex="1">
							<TabItem tabId="project" :name="translator.project">
								<ProjectView ref="project"></ProjectView>
							</TabItem>
							<TabItem tabId="console" :name="translator.console" class="ConsoleViewTab">
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
			</VLayout>
			<DragImages ref="dragImages">
			</DragImages>
			<ContextMenu ref="menu"></ContextMenu>
		</div>
	`,
	data: () => {
		return {
			translator: {}
		}
	},
	components: {
		ToolBox: ToolBox,
		ConsoleView: ConsoleView,
		HierarchyView: HierarchyView,
		ProjectView: ProjectView,
		InspectorView: InspectorView,
		DragImages: DragImages
	}
})
export class Editor extends Vue {
	static instance: Editor;
	static readonly el = "#editor";
	translator: any;
	protected _status: EditorStatus;
	protected _behavior: EditorBehavior;
	protected _command: EditorCommand;

	@NoCache
	get command(): EditorCommand {
		return this._command;
	}

	get toolBox(): ToolBox {
		return this.$refs.toolBox as ToolBox;
	}

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

	get fileList(): BasicComponents.TreeView {
		return this.$refs.fileList as BasicComponents.TreeView;
	}

	get dragImages(): DragImages {
		return this.$refs.dragImages as DragImages;
	}

	get contextMenu(): BasicComponents.ContextMenu {
		return this.$refs.menu as BasicComponents.ContextMenu;
	}

	setApp(app: Tea.App) {
		this._status.app = app;
		this._behavior.setApp(app);
	}

	setScene(scene: Tea.Scene) {
		this.status.scene = scene;
		this._behavior.setScene(scene);
	}

	translate(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Tabs";
		this.translator.player = translator.getText("Player");
		this.translator.scene = translator.getText("Scene");
		this.translator.project = translator.getText("Project");
		this.translator.console = translator.getText("Console");
		var inspectorView = this.$refs.inspector;
		if (inspectorView != null) {
			inspectorView["translate"]();
		}
		var selectAspect = this.$refs.aspect;
		if (selectAspect != null) {
			selectAspect["translate"]();
			(selectAspect as Vue).$forceUpdate();
		}
		var toolBox = this.$refs.toolBox;
		if (toolBox != null) {
			toolBox["translate"]();
			(toolBox as Vue).$forceUpdate();
		}
	}

	get status(): EditorStatus {
		return this._status;
	}

	protected created(): void {
		this._status = new EditorStatus();
		var settings = EditorSettings.getInstance();
		settings.load();
		if (settings.language) {
			var translator = Translator.getInstance();
			translator.loadResource(settings.language);
		}
		this.translate();
		EditorAssets.cacheImages();
		this._command = new EditorCommand();
		this._command.editor = this;
	}

	protected mounted(): void {
		this._behavior = new EditorBehavior(this);
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

export module Editor {
	export var  Button = BasicComponents.Button;
	export type Button = BasicComponents.Button;
	export var  CheckBox = BasicComponents.CheckBox;
	export type CheckBox = BasicComponents.CheckBox;
	export var  ContextMenu = BasicComponents.ContextMenu;
	export type ContextMenu = BasicComponents.ContextMenu;
	export var  ContextMenuItem = BasicComponents.ContextMenuItem;
	export type ContextMenuItem = BasicComponents.ContextMenuItem;
	export var  InputNumber = BasicComponents.InputNumber;
	export type InputNumber = BasicComponents.InputNumber;
	export var  Label = BasicComponents.Label;
	export type Label = BasicComponents.Label;
	export var  ListView = BasicComponents.ListView;
	export type ListView = BasicComponents.ListView;
	export var  NativeContextMenu = BasicComponents.NativeContextMenu;
	export type NativeContextMenu = BasicComponents.NativeContextMenu;
	export var  Rect = BasicComponents.Rectangle;
	export type Rect = BasicComponents.Rectangle;
	export var  TreeView = BasicComponents.TreeView;
	export type TreeView = BasicComponents.TreeView;
	export var  TreeViewItem = BasicComponents.TreeViewItem;
	export type TreeViewItem = BasicComponents.TreeViewItem;
	export var  Vector3 = BasicComponents.Vector3;
	export type Vector3 = BasicComponents.Vector3;

	export var  Panel = Containers.Panel;
	export type Panel = Containers.Panel;
	export var  HLayout = Containers.HLayout;
	export type HLayout = Containers.HLayout;
	export var  VLayout = Containers.VLayout;
	export type VLayout = Containers.VLayout;
	export var  Window = Containers.Window;
	export type Window = Containers.Window;

	export var  AudioSource = TeaComponents.AudioSource;
	export type AudioSource = TeaComponents.AudioSource;
	export var  BoxCollider = TeaComponents.BoxCollider;
	export type BoxCollider = TeaComponents.BoxCollider;
	export var  Camera = TeaComponents.Camera;
	export type Camera = TeaComponents.Camera;
	export var  Light = TeaComponents.Light;
	export type Light = TeaComponents.Light;
	export var  LineRenderer = TeaComponents.LineRenderer;
	export type LineRenderer = TeaComponents.LineRenderer;
	export var  MeshFilter = TeaComponents.MeshFilter;
	export type MeshFilter = TeaComponents.MeshFilter;
	export var  MeshRenderer = TeaComponents.MeshRenderer;
	export type MeshRenderer = TeaComponents.MeshRenderer;
	export var  ParticleSystem = TeaComponents.ParticleSystem;
	export type ParticleSystem = TeaComponents.ParticleSystem;
	export var  Rigidbody = TeaComponents.Rigidbody;
	export type Rigidbody = TeaComponents.Rigidbody;
	export var  Script = TeaComponents.Script;
	export type Script = TeaComponents.Script;
	export var  TextMesh = TeaComponents.TextMesh;
	export type TextMesh = TeaComponents.TextMesh;
}

var loaded = () => {
	document.removeEventListener(
		"DOMContentLoaded", loaded
	);
	var editor = document.querySelector("#editor");
	if (editor == null) {
		return;
	}
	Editor.instance = new Editor({
		el: Editor.el
	});
};
document.addEventListener(
	"DOMContentLoaded", loaded
);
