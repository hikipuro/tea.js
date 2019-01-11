import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorMenu } from "../EditorMenu";
import { NativeContextMenu } from "../basic/NativeContextMenu";
import { TreeView } from "../basic/TreeView";

export class HierarchyViewCommand {
	editor: Editor;
	contextMenu: NativeContextMenu;

	getSelectedObject(): Tea.Object3D {
		var hierarchyView = this.editor.hierarchyView;
		return hierarchyView.getSelectedObject();
	}
	
	showContextMenu(): void {
		var contextMenu = EditorMenu.createHierarchyViewMenu(
			this.editor.hierarchyView,
			this.onSelectMenu
		)
		this.contextMenu = contextMenu;
		contextMenu.once("close", () => {
			this.contextMenu = null;
		});
		contextMenu.show();
	}

	closeContextMenu(): void {
		if (this.contextMenu == null) {
			return;
		}
		this.contextMenu.hide();
	}

	selectItem(object3d: Tea.Object3D): void {
		var hierarchyView = this.editor.hierarchyView;
		if (object3d == null) {
			hierarchyView.select(null);
			return;
		}
		var item = hierarchyView.findItemByTag(object3d.id);
		hierarchyView.select(item);
	}

	update(expand: boolean = false, callback: Function = null): void {
		var scene = this.editor.status.scene;
		var hierarchyView = this.editor.hierarchyView;
		if (scene == null || scene.children == null) {
			hierarchyView.items = [];
			hierarchyView.unselect();
			return;
		}

		var items = this.createTreeViewData(expand);
		var sceneItem: TreeView.Model = {
			text: "Scene",
			children: items,
			isFolder: true,
			isOpen: null,
			tag: "-1"
		};
		hierarchyView.items = [sceneItem];
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
	}

	deleteSelectedItem(): void {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;
		var item = hierarchyView.getSelectedItem();
		if (item == null) {
			return;
		}
		var id = item.tag as number;
		var scene = this.editor.status.scene;
		var object3d = scene.findChildById(id);
		//console.log(object3d);
		inspectorView.hide();
		object3d.destroy();
		scene.app.renderer.once("update", () => {
			this.update();
		});
	}

	protected createTreeViewData(expand: boolean): Array<TreeView.Model> {
		var scene = this.editor.status.scene;
		var hierarchyView = this.editor.hierarchyView;

		var items: Array<TreeView.Model> = [];
		var createItems = (items: Array<TreeView.Model>, child: Tea.Object3D) => {
			var item: TreeView.Model = {
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
		var children = scene.children;
		for (var i = children.length - 1; i >= 0; i--) {
			var child = children[i];
			createItems(items, child);
		}
		return items;
	}

	protected onSelectMenu = (item: Electron.MenuItem): void => {
		var hierarchyView = this.editor.hierarchyView;
		var scene = this.editor.status.scene;
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
			case "Audio/Audio Source":
				object3d = app.createAudioSource();
				break;
			case "Camera":
				object3d = app.createCamera();
				break;
			case "UI/Canvas":
				object3d = app.createCanvas();
				break;
			case "UI/Button":
				object3d = app.createUIButton();
				break;
			case "UI/RadioButton":
				object3d = app.createUIRadioButton();
				break;
			case "UI/Checkbox":
				object3d = app.createUICheckbox();
				break;
			case "UI/Image":
				object3d = app.createUIImage();
				break;
			case "UI/Text":
				object3d = app.createUIText();
				break;
			case "UI/Slider":
				object3d = app.createUISlider();
				break;
			case "Rename":
				var i = hierarchyView.getSelectedItem();
				if (i) {
					i.rename();
				}
				return;
			case "Delete":
				this.deleteSelectedItem();
				this.editor.status.isChanged = true;
				return;
		}

		if (object3d != null) {
			var selectedObject = hierarchyView.getSelectedObject();
			if (selectedObject) {
				selectedObject.addChild(object3d, false);
			} else {
				scene.addChild(object3d);
			}
			this.update(false, () => {
				if (selectedObject) {
					var item = hierarchyView.findItemByTag(selectedObject.id);
					if (item) {
						item.expand();
					}
				}
				this.selectItem(object3d);
			});
			this.editor.status.isChanged = true;
		}

		this.editor.status.isChanged = true;
	}
}
