import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorMenu } from "../EditorMenu";
import { HierarchyView } from "../HierarchyView";
import { InspectorView } from "../InspectorView";
import { NativeContextMenu } from "../basic/NativeContextMenu";
import { Timer } from "../Timer";
import { EditorCommand } from "./EditorCommand";
import { HierarchyViewCommand } from "./HierarchyViewCommand";
import { ObjectInspector } from "../ObjectInspector";

export class ObjectInspectorCommand {
	scene: Tea.Scene;
	editor: Editor;
	editorCommand: EditorCommand;
	hierarchyViewCommand: HierarchyViewCommand;
	hierarchyView: HierarchyView;
	inspectorView: InspectorView;
	updateTimer: Timer;
	componentMenu: NativeContextMenu;
	addComponentMenu: NativeContextMenu;

	constructor() {
		this.updateTimer = new Timer();
		this.updateTimer.onUpdate = this.updateTRS;
	}

	startUpdateTimer(): void {
		this.updateTimer.start();
	}

	snoozeUpdateTimer(wait: number = 1000): void {
		this.updateTimer.snooze(wait);
	}

	stopUpdateTimer(): void {
		this.updateTimer.stop();
	}

	update(): void {
		var object3d = this.getSelectedObject();
		if (object3d == null) {
			return;
		}
		var inspectorView = this.inspectorView;
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
		if (this.hierarchyView.getSelectedItem() == null) {
			return;
		}
		var contextMenu = EditorMenu.createInspectorViewComponentMenu(
			this.onSelectComponentMenu
		);
		this.componentMenu = contextMenu;
		contextMenu.onClose = () => {
			this.componentMenu = null;
		};
		contextMenu.show();
	}

	closeComponentMenu(): void {
		if (this.componentMenu == null) {
			return;
		}
		this.componentMenu.hide();
	}

	showAddComponentMenu(): void {
		if (this.hierarchyView.getSelectedItem() == null) {
			return;
		}
		var contextMenu = EditorMenu.createInspectorViewAddComponentMenu(
			this.onSelectAddComponentMenu
		);
		this.addComponentMenu = contextMenu;
		contextMenu.onClose = () => {
			this.addComponentMenu = null;
		};
		var button = this.inspectorView.$el.querySelector("div.AddComponent button");
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
		if (this.addComponentMenu == null) {
			return;
		}
		this.addComponentMenu.hide();
	}

	protected getSelectedObject(): Tea.Object3D {
		var hierarchyView = this.hierarchyView;
		var item = hierarchyView.getSelectedItem();
		if (item == null) {
			return null;
		}
		var id = item.tag as number;
		return this.scene.findChildById(id);
	}

	protected updateTRS = (): void => {
		var hierarchyView = this.hierarchyView;
		var inspectorView = this.inspectorView;

		if (hierarchyView.getSelectedItem() == null) {
			this.updateTimer.stop();
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
		var inspectorView = this.inspectorView;
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
			this.hierarchyViewCommand.selectItem(object3d);
			//this.selectHierarchyViewItem(object3d);
			this.editor.status.isChanged = true;
		}
	}
}
