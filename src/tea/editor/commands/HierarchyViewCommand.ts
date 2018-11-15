import * as Tea from "../../Tea";
import { EventDispatcher } from "../../utils/EventDispatcher";
import { EditorMenu } from "../EditorMenu";
import { EditorCommand } from "./EditorCommand";
import { HierarchyView } from "../HierarchyView";
import { InspectorView } from "../InspectorView";
import { NativeContextMenu } from "../basic/NativeContextMenu";

export class HierarchyViewCommand extends EventDispatcher {
	scene: Tea.Scene;
	editorCommand: EditorCommand;
	hierarchyView: HierarchyView;
	inspectorView: InspectorView;
	contextMenu: NativeContextMenu;

	constructor() {
		super();
	}

	getSelectedObject(): Tea.Object3D {
		var hierarchyView = this.hierarchyView;
		var item = hierarchyView.getSelectedItem();
		if (item == null) {
			return null;
		}
		var id = item.tag as number;
		return this.scene.findChildById(id);
	}
	
	showContextMenu(): void {
		var contextMenu = EditorMenu.createHierarchyViewMenu(
			this.hierarchyView,
			this.onSelectMenu
		)
		this.contextMenu = contextMenu;
		contextMenu.onClose = () => {
			this.contextMenu = null;
		};
		contextMenu.show();
	}

	closeContextMenu(): void {
		if (this.contextMenu == null) {
			return;
		}
		this.contextMenu.hide();
	}

	selectItem(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		var hierarchyView = this.hierarchyView;
		var item = hierarchyView.findItemByTag(object3d.id);
		hierarchyView.select(item);
	}

	update(expand: boolean = false, callback: Function = null): void {
		var hierarchyView = this.hierarchyView;
		//setTimeout(() => {
		//hierarchyView.$nextTick(() => {
			var items = [];
			var createItems = (items, child: Tea.Object3D) => {
				var item = {
					text: child.name,
					children: [],
					isFolder: false,
					isOpen: null,
					tag: child.id
				};
				child.children.forEach((i) => {
					createItems(item.children, i);
				});
				if (item.children.length > 0) {
					item.isFolder = true;
				}
				if (expand === false) {
					var currentItem = hierarchyView.findItemByTag(item.tag);
					if (currentItem != null) {
						item.isOpen = currentItem.isOpen;
					}
				}
				items.push(item);
			};
			var children = this.scene.children;
			for (var i = children.length - 1; i >= 0; i--) {
				var child = children[i];
				createItems(items, child);
			}
			var sceneItem = {
				text: "Scene",
				children: items,
				isFolder: true,
				isOpen: null,
				tag: "-1"
			};
			hierarchyView.items = [sceneItem];
			//hierarchyView.items = items;
			hierarchyView.unselect();
			if (expand) {
				hierarchyView.$nextTick(() => {
					hierarchyView.expandAll();
				});
			}
			if (callback != null) {
				hierarchyView.$nextTick(() => {
					setTimeout(() => {
						callback();
					}, 0);
				});
			}
		//});
		//}, 17);
	}

	deleteSelectedItem(): void {
		var hierarchyView = this.hierarchyView;
		var inspectorView = this.inspectorView;
		var item = hierarchyView.getSelectedItem();
		if (item == null) {
			return;
		}
		var id = item.tag as number;
		var object3d = this.scene.findChildById(id);
		console.log(object3d);
		inspectorView.hide();
		object3d.destroy();
		this.scene.app.renderer.once("update", () => {
			this.update();
		});
	}

	protected onSelectMenu = (item: Electron.MenuItem): void => {
		var scene = this.scene;
		var app = scene.app;
		//console.log(item.id);
		var object3d: Tea.Object3D;

		switch (item.id) {
			case "Create Empty":
				object3d = app.createObject3D();
				break;
			case "3D Object/Cube":
				object3d = Tea.Object3D.createPrimitive(
					app, Tea.PrimitiveType.Cube
				);
				break;
			case "3D Object/Sphere":
				object3d = Tea.Object3D.createPrimitive(
					app, Tea.PrimitiveType.Sphere
				);
				break;
			case "3D Object/Capsule":
				object3d = Tea.Object3D.createPrimitive(
					app, Tea.PrimitiveType.Capsule
				);
				break;
			case "3D Object/Cylinder":
				object3d = Tea.Object3D.createPrimitive(
					app, Tea.PrimitiveType.Cylinder
				);
				break;
			case "3D Object/Plane":
				object3d = Tea.Object3D.createPrimitive(
					app, Tea.PrimitiveType.Plane
				);
				break;
			case "3D Object/Quad":
				object3d = Tea.Object3D.createPrimitive(
					app, Tea.PrimitiveType.Quad
				);
				break;
			case "3D Object/Text":
				object3d = app.createTextMesh();
				break;
			case "Effects/Particle System":
				object3d = app.createParticleSystem();
				break;
			case "Light/Directional Light":
				object3d = app.createDirectionalLight();
				break;
			case "Light/Point Light":
				object3d = app.createPointLight();
				break;
			case "Light/Spot Light":
				object3d = app.createSpotLight();
				break;
			case "Camera":
				object3d = app.createCamera();
				break;
			case "Delete":
				this.deleteSelectedItem();
				this.editorCommand.isChanged = true;
				return;
		}

		if (object3d != null) {
			scene.addChild(object3d);
			this.update(false, () => {
				this.selectItem(object3d);
			});
			this.editorCommand.isChanged = true;
		}

		this.emit("menu", item.id);
	}
}
