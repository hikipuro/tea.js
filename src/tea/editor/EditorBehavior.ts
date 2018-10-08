import * as Tea from "../Tea";
import { Editor } from "./Editor";

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
			this.initHierarchyView();
			this.initInspectorView();
			this.initContextMenu();
			this.updateHierarchyView();
		});
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

		hierarchyView.$on("select", () => {
			if (hierarchyView.selectedItem == null) {
				inspectorView.hide();
				return;
			}
			inspectorView.show();
			console.log("select", hierarchyView.selectedItem.tag);
			var object3d = this.hierarchyViewItem;
			if (object3d == null) {
				return;
			}
			inspectorView.name = object3d.name;
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

	onSelectHierarchyViewMenu(item: Tea.Editor.ContextMenuItem): void {
		var hierarchyView = this.editor.hierarchyView;
		var scene = this.scene;
		console.log("menu select", item.text);
		if (item.text === "Delete") {
			if (hierarchyView.selectedItem == null) {
				return;
			}
			var id = hierarchyView.selectedItem.tag as number;
			var object3d = scene.findChildById(id);
			console.log(object3d);
			object3d.destroy();
			this.updateHierarchyView();
			return;
		}
		if (item.text === "Add Cube") {
			var cube = Tea.Object3D.createPrimitive(scene.app, Tea.PrimitiveType.Cube);
			scene.addChild(cube);
			this.updateHierarchyView();
			return;
		}
	}

	updateHierarchyView(): void {
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
			hierarchyView.$nextTick(() => {
				hierarchyView.expandAll();
			});
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
