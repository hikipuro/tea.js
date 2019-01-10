import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorMenu } from "../EditorMenu";
import { NativeContextMenu } from "../basic/NativeContextMenu";
import { Timer } from "../Timer";
import { ObjectInspector } from "../views/ObjectInspector";

export class ObjectInspectorCommand {
	editor: Editor;
	protected _updateTimer: Timer;
	protected _componentMenu: NativeContextMenu;
	protected _addComponentMenu: NativeContextMenu;

	constructor() {
		this._updateTimer = new Timer();
		this._updateTimer.onUpdate = this.updateTRS;
	}

	startUpdateTimer(): void {
		this._updateTimer.start();
	}

	snoozeUpdateTimer(wait: number = 1000): void {
		this._updateTimer.snooze(wait);
	}

	stopUpdateTimer(): void {
		this._updateTimer.stop();
	}

	update(): void {
		var object3d = this.getSelectedObject();
		if (object3d == null) {
			return;
		}
		var inspectorView = this.editor.inspectorView;
		inspectorView.hide();
		//var commands = this.commands;
		inspectorView.component = ObjectInspector.extend({
			created: function () {
				var self = this as ObjectInspector;
				//self._commands = commands;
				self.setObject3D(object3d);
				object3d = undefined;
				//commands = undefined;
			}
		});
		inspectorView.show();
		this.startUpdateTimer();
	}

	showComponentMenu(): void {
		var object3d = this.getSelectedObject();
		if (object3d == null) {
			return;
		}
		var inspectorView = this.editor.inspectorView;
		var inspector = inspectorView.getComponent() as ObjectInspector;
		if ((inspector instanceof ObjectInspector) === false) {
			return;
		}

		var contextMenu = EditorMenu.createInspectorViewComponentMenu(
			this.onSelectComponentMenu
		);
		this._componentMenu = contextMenu;
		contextMenu.once("close", () => {
			this._componentMenu = null;
		});

		var component = inspector._configComponent;
		var index = object3d.getComponentIndex(component);
		if (index === 0) {
			contextMenu.disableItem("Move Up");
		}
		var count = object3d.componentCount;
		if (index + 1 >= count) {
			contextMenu.disableItem("Move Down");
		}
		contextMenu.show();
	}

	closeComponentMenu(): void {
		if (this._componentMenu == null) {
			return;
		}
		this._componentMenu.hide();
	}

	showAddComponentMenu(): void {
		if (this.editor.hierarchyView.getSelectedItem() == null) {
			return;
		}
		var contextMenu = EditorMenu.createInspectorViewAddComponentMenu(
			this.onSelectAddComponentMenu
		);
		this._addComponentMenu = contextMenu;
		contextMenu.once("close", () => {
			this._addComponentMenu = null;
		});
		var button = this.editor.inspectorView.$el.querySelector("div.AddComponent button");
		if (button) {
			var rect = button.getBoundingClientRect();
			//console.log(rect);
			//contextMenu.show(rect.left, rect.top);
			var zoom = window.outerWidth / window.innerWidth;
			var x = Math.floor(rect.left * zoom);
			var y = Math.floor(rect.bottom * zoom + 10);
			contextMenu.show(x, y);
		} else {
			contextMenu.show();
		}
	}

	closeAddComponentMenu(): void {
		if (this._addComponentMenu == null) {
			return;
		}
		this._addComponentMenu.hide();
	}

	protected getSelectedObject(): Tea.Object3D {
		var hierarchyView = this.editor.hierarchyView;
		var item = hierarchyView.getSelectedItem();
		if (item == null) {
			return null;
		}
		var id = item.tag as number;
		var scene = this.editor.status.scene;
		return scene.findChildById(id);
	}

	protected updateTRS = (): void => {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;

		if (this.editor.status.app.isEditing) {
			return;
		}
		if (hierarchyView.getSelectedItem() == null) {
			this._updateTimer.stop();
			return;
		}
		if (inspectorView.hasFocus()) {
			return;
		}
		var object3d = this.getSelectedObject();
		if (object3d == null) {
			return;
		}
		var inspector = inspectorView.getComponent() as ObjectInspector;
		if ((inspector instanceof ObjectInspector) === false) {
			return;
		}
		var position = object3d.localPosition;
		var rotation = object3d.localEulerAngles;
		var scale = object3d.localScale;
		inspector.setPosition(position);
		inspector.setRotation(rotation);
		inspector.setScale(scale);
	}

	protected onSelectComponentMenu = (item: Electron.MenuItem): void => {
		var inspectorView = this.editor.inspectorView;
		var inspector = inspectorView.getComponent() as ObjectInspector;
		if ((inspector instanceof ObjectInspector) === false) {
			return;
		}
		var component = inspector._configComponent;
		//console.log(item.id, component);
		var object3d = this.getSelectedObject();
		if (object3d == null) {
			return;
		}
		switch (item.id) {
			case "Remove Component":
				object3d.removeComponent(component);
				this.update();
				break;
			case "Move Up":
				var index = object3d.getComponentIndex(component);
				object3d.swapComponents(index, index - 1);
				this.update();
				break;
			case "Move Down":
				var index = object3d.getComponentIndex(component);
				object3d.swapComponents(index, index + 1);
				this.update();
				break;
		}
		this.editor.status.isChanged = true;
	}

	protected onSelectAddComponentMenu = (item: Electron.MenuItem): void => {
		var object3d = this.getSelectedObject();
		if (object3d == null) {
			return;
		}

		var editor = this.editor;
		var app = editor.status.app;
		var component = null;
		switch (item.id) {
			case "Audio/Audio Source":
				component = new Tea.AudioSource(app);
				break;
			case "Effects/Line Renderer":
				component = new Tea.LineRenderer(app);
				break;
			case "Mesh/Mesh Filter":
				component = new Tea.MeshFilter(app);
				break;
			case "Mesh/Mesh Renderer":
				component = new Tea.MeshRenderer(app);
				break;
			case "Physics/BoxCollider":
				component = new Tea.BoxCollider(app);
				break;
			case "Physics/SphereCollider":
				component = new Tea.SphereCollider(app);
				break;
			case "Physics/Rigidbody":
				component = new Tea.Rigidbody(app);
				break;
			case "Rendering/Camera":
				component = new Tea.Camera(app);
				break;
			case "Rendering/Light":
				component = new Tea.Light(app);
				break;
			case "UI/Canvas":
				component = new Tea.Canvas(app);
				break;
			case "UI/CanvasRenderer":
				component = new Tea.CanvasRenderer(app);
				var shader = new Tea.Shader(app);
				shader.attach(
					Tea.ShaderSources.uiComponentVS,
					Tea.ShaderSources.uiComponentFS
				);
				shader.settings.enableDepthTest = false;
				shader.settings.enableBlend = true;
				shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
				shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
				shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
				shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
				component.material = Tea.Material.getDefault(app);
				component.material.renderQueue = 4000;
				component.material.setFloat("_Cutoff", 0.0);
				component.material.shader = shader;
				break;
			case "UI/Button":
				component = new Tea.UI.Button(app);
				break;
			case "UI/Image":
				component = new Tea.UI.Image(app);
				break;
			case "UI/Text":
				component = new Tea.UI.Text(app);
				break;
		}
		if (component != null) {
			object3d.addComponentInstance(component);
			editor.hierarchyView.command.selectItem(object3d);
			editor.status.isChanged = true;
		}
	}
}
