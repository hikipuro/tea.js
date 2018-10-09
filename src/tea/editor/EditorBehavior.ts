import Vue from "vue";
import * as Tea from "../Tea";
import { Editor } from "./Editor";
import { SelectAspect } from "./SelectAspect";
import { Camera } from "./Camera";

export class EditorBehavior {
	editor: Editor;
	scene: Tea.Scene;
	inspectorViewTimer: Timer;

	constructor(editor: Editor) {
		this.editor = editor;
		this.inspectorViewTimer = new Timer();
		this.inspectorViewTimer.update = this.updateInspectorView;
		this.init();
	}

	get hierarchyViewItem(): Tea.Object3D {
		var hierarchyView = this.editor.hierarchyView;
		if (hierarchyView.selectedItem == null) {
			return null;
		}
		var id = hierarchyView.selectedItem.tag as number;
		return this.scene.findChildById(id);
	}

	init(): void {
		this.editor.$nextTick(() => {
			this.initScreenView();
			this.initHierarchyView();
			this.initInspectorView();
			this.initContextMenu();
			this.updateHierarchyView(true);
		});
	}

	initScreenView(): void {
		setTimeout(() => {
			this.scene.app.renderer.on("resize", () => {
				this.updateScreenSize();
			});
		}, 30);
	}

	initHierarchyView(): void {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;
		var contextMenu = this.editor.contextMenu;
		hierarchyView.openIcon = "⏏️";
		hierarchyView.closeIcon = "▶️";

		hierarchyView.$on("menu", (e: MouseEvent) => {
			e.preventDefault();
			contextMenu.items = [
				{ text: "Delete" },
				{ text: "-" },
				{ text: "Add Cube" },
				{ text: "test3" },
				{ text: "test4" }
			]
			contextMenu.move(e.clientX, e.clientY);
			contextMenu.show("hierarchyView");
		});

		hierarchyView.$on("select", (item: Tea.Editor.TreeViewItem) => {
			if (item == null) {
				inspectorView.hide();
				return;
			}
			inspectorView.show();
			console.log("select", item.tag);
			var object3d = this.hierarchyViewItem;
			if (object3d == null) {
				return;
			}
			inspectorView.name = object3d.name;
			inspectorView.clearComponents();
			var components = object3d.getComponents(Tea.Component);
			components.forEach((component) => {
				//console.log(component.editorView);
				if (component.editorView == null) {
					return;
				}
				var vue = component.editorView.extend({
					created: function () {
						(this as any)._component = component;
					}
				});
				inspectorView.components.push(vue);
			});
			this.inspectorViewTimer.start();
		});
	}

	initInspectorView(): void {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;

		inspectorView.$on("update", (key: string, value: any) => {
			if (hierarchyView.selectedItem == null) {
				return;
			}
			var object3d = this.hierarchyViewItem;
			if (object3d == null) {
				return;
			}
			switch (key) {
				case "position":
					object3d.localPosition.copy(value);
					break;
				case "rotation":
					object3d.localRotation.setEuler(value);
					break;
				case "scale":
					object3d.localScale.copy(value);
					break;
			}
		});
	}

	initContextMenu(): void {
		var contextMenu = this.editor.contextMenu;
		contextMenu.$on("select", (state: string, item: Tea.Editor.ContextMenuItem) => {
			switch (state) {
				case "hierarchyView":
					this.onSelectHierarchyViewMenu(item);
					break;
			}
		});
	}

	updateScreenSize(): void {
		var app = this.scene.app;
		var aspect = this.editor.$refs.aspect as SelectAspect;
		var canvas = this.editor.$refs.canvas as HTMLCanvasElement;
		var width = canvas.parentElement.clientWidth;
		var height = canvas.parentElement.clientHeight;
		if (aspect.x != 0 && aspect.y != 0) {
			if (width / height < aspect.x / aspect.y) {
				height = width * aspect.y / aspect.x;
			} else {
				width = height * aspect.x / aspect.y;
			}
		}
		app.width = width;
		app.height = height;
		console.log("updateScreenSize", width, height);
	}

	onUpdateAspect(): void {
		this.updateScreenSize();
	}

	onSelectHierarchyViewMenu(item: Tea.Editor.ContextMenuItem): void {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;
		var scene = this.scene;
		console.log("menu select", item.text);
		switch (item.text) {
			case "Delete":
				if (hierarchyView.selectedItem == null) {
					return;
				}
				var id = hierarchyView.selectedItem.tag as number;
				var object3d = scene.findChildById(id);
				console.log(object3d);
				inspectorView.hide();
				object3d.destroy();
				this.updateHierarchyView();
				break;
			case "Add Cube":
				var cube = Tea.Object3D.createPrimitive(
					scene.app, Tea.PrimitiveType.Cube
				);
				scene.addChild(cube);
				this.updateHierarchyView();
				break;
		}
	}

	updateHierarchyView(expand: boolean = false): void {
		setTimeout(() => {
			var items = [];
			var createItems = (items, child) => {
				var item = {
					text: child.name,
					children: [],
					tag: child.id
				};
				child.children.forEach((i) => {
					createItems(item.children, i);
				});
				items.push(item);
			};
			var children = this.scene.children;
			for (var i = children.length - 1; i >= 0; i--) {
				var child = children[i];
				createItems(items, child);
			}
			var hierarchyView = this.editor.hierarchyView;
			hierarchyView.items = items;
			if (expand) {
				hierarchyView.$nextTick(() => {
					hierarchyView.expandAll();
				});
			}
		}, 17);
	}

	updateInspectorView = (): void => {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;

		if (hierarchyView.selectedItem == null) {
			this.inspectorViewTimer.stop();
			return;
		}
		if (inspectorView.hasFocus()) {
			return;
		}
		var object3d = this.hierarchyViewItem;
		if (object3d == null) {
			return;
		}
		var position = object3d.localPosition;
		var rotation = object3d.localEulerAngles;
		var scale = object3d.localScale;
		inspectorView.setPosition(position);
		inspectorView.setRotation(rotation);
		inspectorView.setScale(scale);
	}
}

class Timer {
	interval: number;
	handle: any;
	update: () => void;

	constructor() {
		this.interval = 100;
		this.handle = null;
	}

	start(): void {
		if (this.handle != null) {
			this.stop();
		}
		this.handle = setInterval(
			this.update, this.interval
		);
	}

	stop(): void {
		if (this.handle == null) {
			return;
		}
		clearInterval(this.handle);
		this.handle = null;
	}
}
