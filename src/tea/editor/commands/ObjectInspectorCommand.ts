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
		if (this.editor.hierarchyView.getSelectedItem() == null) {
			return;
		}
		var contextMenu = EditorMenu.createInspectorViewComponentMenu(
			this.onSelectComponentMenu
		);
		this._componentMenu = contextMenu;
		contextMenu.onClose = () => {
			this._componentMenu = null;
		};
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
		contextMenu.onClose = () => {
			this._addComponentMenu = null;
		};
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
				this.editor.status.isChanged = true;
				break;
		}
	}

	protected onSelectAddComponentMenu = (item: Electron.MenuItem): void => {
		var object3d = this.getSelectedObject();
		if (object3d == null) {
			return;
		}

		var component = null;
		switch (item.id) {
			case "Audio/Audio Source":
				component = Tea.AudioSource;
				break;
			case "Effects/Line Renderer":
				component = Tea.LineRenderer;
				break;
			case "Mesh/Mesh Filter":
				component = Tea.MeshFilter;
				break;
			case "Mesh/Mesh Renderer":
				component = Tea.MeshRenderer;
				break;
			case "Physics/BoxCollider":
				component = Tea.BoxCollider;
				break;
			case "Physics/Rigidbody":
				component = Tea.Rigidbody;
				break;
			case "Rendering/Camera":
				component = Tea.Camera;
				break;
			case "Rendering/Light":
				component = Tea.Light;
				break;
		}
		if (component != null) {
			object3d.addComponent(component);
			var editor = this.editor;
			editor.hierarchyView.command.selectItem(object3d);
			editor.status.isChanged = true;
		}
	}
}
