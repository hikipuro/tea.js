import Vue from "vue";
import * as Tea from "../Tea";
import { Editor } from "./Editor";
import { SelectAspect } from "./SelectAspect";

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
			this.initProjectView();
			this.initContextMenu();
			this.updateHierarchyView(true);
		});
	}

	initScreenView(): void {
		var hierarchyResize = this.editor.$refs.hierarchyResize as Vue;
		var inspectorResize = this.editor.$refs.inspectorResize as Vue;
		var projectResize = this.editor.$refs.projectResize as Vue;
		hierarchyResize.$on("resize", () => {
			this.updateScreenSize();
		});
		inspectorResize.$on("resize", () => {
			this.updateScreenSize();
			this.scene.app.renderer.stats.updateSize();
		});
		projectResize.$on("resize", () => {
			this.updateScreenSize();
		});
		setTimeout(() => {
			this.scene.app.renderer.on("resize", () => {
				this.updateScreenSize();
			});
		}, 30);
	}

	initHierarchyView(): void {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;
		//var contextMenu = this.editor.contextMenu;
		hierarchyView.openIcon = "⏏️";
		hierarchyView.closeIcon = "▶️";

		hierarchyView.$on("menu", (e: MouseEvent) => {
			e.preventDefault();
			this.showHierarchyViewMenu();
			/*
			contextMenu.items = [
				{ text: "Delete" },
				{ text: "-" },
				{ text: "Add Cube" },
				{ text: "test3" },
				{ text: "test4" }
			]
			contextMenu.move(e.clientX, e.clientY);
			contextMenu.show("hierarchyView");
			//*/
		});

		hierarchyView.$on("select", (item: Tea.Editor.TreeViewItem) => {
			if (item == null) {
				inspectorView.hide();
				return;
			}
			console.log("select", item.tag);
			var object3d = this.hierarchyViewItem;
			if (object3d == null) {
				return;
			}
			inspectorView.setObject3D(object3d);
			inspectorView.show();
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
				case "name":
					hierarchyView.selectedItem.model.text = value;
					break;
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

	initProjectView(): void {
		var projectView = this.editor.projectView;
		projectView.$on("expand", (item: Tea.Editor.TreeViewItem) => {
			//console.log("expand", item);
			var i = item.model;
			if (i == null || i.children.length > 0) {
				return;
			}
			var items = [];
			var files = Tea.Directory.getFilesSync(item.tag);
			files.forEach(file => {
				var item = createItems(file);
				if (item == null) {
					return;
				}
				items.push(item);
			});
			i.children = items;
		});
		projectView.$on("collapse", (item: Tea.Editor.TreeViewItem) => {
			//console.log("collapse", item);
		});

		var createItems = (file: Tea.FileInfo): any => {
			if (file == null || file.exists === false) {
				return null;
			}
			if (file.isDirectory === false) {
				return null;
			}
			var item = {
				text: file.name,
				children: [],
				isFolder: file.hasChildDirectory,
				tag: file.fullName
			};
			return item;
		};
		var items = [];
		Tea.Directory.getFiles(".", (files) => {
			files.forEach(file => {
				var item = createItems(file);
				if (item == null) {
					return;
				}
				items.push(item);
			});
		});
		projectView.items = items;
	}

	initContextMenu(): void {
		/*
		var contextMenu = this.editor.contextMenu;
		contextMenu.$on("select", (state: string, item: Tea.Editor.ContextMenuItem) => {
			switch (state) {
				case "hierarchyView":
					this.onSelectHierarchyViewMenu(item);
					break;
			}
		});
		//*/
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
		//console.log("updateScreenSize", width, height);
	}

	showHierarchyViewMenu(): void {
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				id: "Create Empty",
				label: "Create Empty"
			},
			{
				label: "3D Object",
				submenu: [
					{
						id: "3D Object/Cube",
						label: "Cube"
					},
					{
						id: "3D Object/Sphere",
						label: "Sphere"
					},
					{
						id: "3D Object/Capsule",
						label: "Capsule"
					},
					{
						id: "3D Object/Cylinder",
						label: "Cylinder"
					},
					{
						id: "3D Object/Plane",
						label: "Plane"
					},
					{
						id: "3D Object/Quad",
						label: "Quad"
					},
					{
						type: "separator"
					},
					{
						id: "3D Object/Text",
						label: "Text"
					},
				]
			},
			{
				label: "Effects",
				submenu: [
					{
						id: "Effects/Particle System",
						label: "Particle System"
					}
				]
			},
			{
				label: "Light",
				submenu: [
					{
						id: "Light/Directional Light",
						label: "Directional Light"
					}
				]
			},
			{
				id: "Camera",
				label: "Camera"
			}
		];
		var hierarchyView = this.editor.hierarchyView;
		if (hierarchyView.selectedItem != null) {
			template.unshift(
				{
					id: "Delete",
					label: "Delete"
				},
				{
					type: "separator"
				}
			);
		}
		Tea.Editor.NativeContextMenu.setMenuItemHandler(
			template, this.onSelectHierarchyViewMenuItem
		);
		var contextMenu = Tea.Editor.NativeContextMenu.create(template);
		contextMenu.show();
	}

	selectHierarchyViewItem(object3d: Tea.Object3D): void {
		var hierarchyView = this.editor.hierarchyView;
		var item = hierarchyView.findItemByTag(object3d.id);
		hierarchyView.select(item);
	}

	onUpdateAspect(): void {
		this.updateScreenSize();
	}

	onSelectHierarchyViewMenuItem = (item: Electron.MenuItem): void => {
		var scene = this.scene;
		var app = scene.app;
		console.log(item.id);
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
				object3d = app.createLight();
				break;
			case "Camera":
				object3d = app.createCamera();
				break;
			case "Delete":
				var hierarchyView = this.editor.hierarchyView;
				var inspectorView = this.editor.inspectorView;
				if (hierarchyView.selectedItem == null) {
					return;
				}
				var id = hierarchyView.selectedItem.tag as number;
				var object3d = scene.findChildById(id);
				console.log(object3d);
				inspectorView.hide();
				object3d.destroy();
				this.updateHierarchyView();
				return;
		}

		if (object3d != null) {
			scene.addChild(object3d);
			this.updateHierarchyView(false, () => {
				this.selectHierarchyViewItem(object3d);
			});
		}
	}

	/*
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
	//*/

	updateHierarchyView(expand: boolean = false, callback: Function = null): void {
		setTimeout(() => {
			var items = [];
			var createItems = (items, child) => {
				var item = {
					text: child.name,
					children: [],
					isFolder: false,
					tag: child.id
				};
				child.children.forEach((i) => {
					createItems(item.children, i);
				});
				if (item.children.length > 0) {
					item.isFolder = true;
				}
				items.push(item);
			};
			var children = this.scene.children;
			for (var i = children.length - 1; i >= 0; i--) {
				var child = children[i];
				createItems(items, child);
			}
			var hierarchyView = this.editor.hierarchyView;
			hierarchyView.items = items;
			hierarchyView.unselect();
			if (expand) {
				hierarchyView.$nextTick(() => {
					hierarchyView.expandAll();
				});
			}
			if (callback != null) {
				hierarchyView.$nextTick(() => {
					callback();
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
