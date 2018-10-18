import Vue from "vue";
import * as Electron from "electron";
import * as Tea from "../Tea";
import { Editor } from "./Editor";
import { EditorMenu } from "./EditorMenu";
import { SelectAspect } from "./basic/SelectAspect";

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
			this.scene.app.renderer.dispatchResizeEvent();
			//this.updateScreenSize();
		});
		inspectorResize.$on("resize", () => {
			this.scene.app.renderer.dispatchResizeEvent();
			//this.updateScreenSize();
			//this.scene.app.renderer.stats.updateSize();
		});
		projectResize.$on("resize", () => {
			this.scene.app.renderer.dispatchResizeEvent();
			//this.updateScreenSize();
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
		hierarchyView.draggable = true;

		var dragImages = this.editor.dragImages;
		var dragSource: Tea.Editor.TreeViewItem = null;
		var dragEvents = hierarchyView.dragEvents;
		dragEvents.dragStart = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			//console.log("onDragStart");
			dragSource = item;
			e.dataTransfer.effectAllowed = "move";
			//e.dataTransfer.dropEffect = "move";

			var dragImage = this.createDragImage(item.model.text);
			while (dragImages.firstChild) {
				dragImages.removeChild(dragImages.firstChild);
			}
			dragImages.appendChild(dragImage);
			e.dataTransfer.setDragImage(dragImage, 0, 0);
		};
		dragEvents.dragOver = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
			var el = e.currentTarget as HTMLElement;
			var text = el.querySelector(".text");
			var clientHeight = el.clientHeight;
			var borderSize = el.clientHeight * 0.3;
			var offsetY = e.offsetY;
			//console.log(e.offsetY, el.clientHeight);
			if (offsetY < borderSize) {
				el.classList.remove("dragEnter");
				text.classList.remove("dragOverBottom");
				text.classList.add("dragOverTop");
			} else if (clientHeight - offsetY < borderSize) {
				el.classList.remove("dragEnter");
				text.classList.remove("dragOverTop");
				text.classList.add("dragOverBottom");
			} else {
				el.classList.add("dragEnter");
				text.classList.remove("dragOverTop");
				text.classList.remove("dragOverBottom");
			}

		}
		dragEvents.dragEnter = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			//console.log("dragEnter", item.model.text);
			var el = e.currentTarget as HTMLElement;
			el.classList.add("dragEnter");
		}
		dragEvents.dragLeave = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			//console.log("dragLeave", this, e);
			var el = e.currentTarget as HTMLElement;
			var text = el.querySelector(".text");
			el.classList.remove("dragEnter");
			text.classList.remove("dragOverTop");
			text.classList.remove("dragOverBottom");
		}
		dragEvents.drop = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			var mode = 0;
			var el = e.currentTarget as HTMLElement;
			var text = el.querySelector(".text");
			if (text.classList.contains("dragOverTop")) {
				mode = 1;
			} else if (text.classList.contains("dragOverBottom")) {
				mode = 2;
			}
			el.classList.remove("dragEnter");
			text.classList.remove("dragOverTop");
			text.classList.remove("dragOverBottom");
			var idSrc = dragSource.model.tag as number;
			var idDst = item.model.tag as number;
			if (idSrc == null || idDst == null) {
				return;
			}
			if (idSrc == idDst) {
				return;
			}
			//console.log("drop", idSrc, idDst, item.model.text);
			var object3dSrc = this.scene.findChildById(idSrc);
			var object3dDst = this.scene.findChildById(idDst);
			if (object3dSrc == null || object3dDst == null) {
				return;
			}
			//console.log(mode);
			switch (mode) {
				case 0:
					object3dSrc.parent = object3dDst;
					this.updateHierarchyView(false, () => {
						item = hierarchyView.findItemByTag(object3dDst.id);
						//console.log("item", item);
						if (item != null) {
							item.expand();
							item = hierarchyView.findItemByTag(object3dSrc.id);
							if (item != null) {
								hierarchyView.select(item);
							}
						}
					});
					break;
				case 1:
					this.scene.moveChild(object3dSrc, object3dDst);
					this.updateHierarchyView(false, () => {
						item = hierarchyView.findItemByTag(object3dSrc.id);
						if (item != null) {
							hierarchyView.select(item);
						}
					});
					break;
				case 2:
					this.scene.moveChild(object3dSrc, object3dDst, false);
					this.updateHierarchyView(false, () => {
						item = hierarchyView.findItemByTag(object3dSrc.id);
						if (item != null) {
							hierarchyView.select(item);
						}
					});
					break;
			}
		}

		hierarchyView.$on("menu", (e: MouseEvent) => {
			e.preventDefault();
			this.showHierarchyViewMenu();
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
				case "rotation":
					this.inspectorViewTimer.snooze(1000);
					break;
				/*
				case "position":
					object3d.localPosition.copy(value);
					break;
				case "rotation":
					object3d.localRotation.setEuler(value);
					break;
				case "scale":
					object3d.localScale.copy(value);
					break;
				//*/
			}
		});
		inspectorView.$on("config", (component: Tea.Component) => {
			if (hierarchyView.selectedItem == null) {
				return;
			}
			this.showInspectorViewComponentMenu();
		});
		inspectorView.$on("addComponent", () => {
			if (hierarchyView.selectedItem == null) {
				return;
			}
			this.showInspectorViewAddComponentMenu();
		});
	}

	initProjectView(): void {
		var projectView = this.editor.projectView;
		var fileList = this.editor.fileList;
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
		projectView.$on("select", (item: Tea.Editor.TreeViewItem) => {
			if (item == null) {
				return;
			}
			//console.log("select", item.tag);
			var path = item.tag;
			Tea.Directory.getFiles(path, (files: Tea.FileInfo[]) => {
				var items = [];
				files.forEach((file) => {
					if (file.isDirectory) {
						return;
					}
					if (file.name === ".DS_Store") {
						return;
					}
					var item = {
						text: file.name,
						children: [],
						isFolder: false,
						tag: file.fullName
					};
					//console.log(file.fullName);
					items.push(item);
				});
				fileList.items = items;
			});
		});
		projectView.$on("menu", (e: MouseEvent) => {
			e.preventDefault();
			this.showProjectViewMenu();
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
		var contextMenu = EditorMenu.getHierarchyViewMenu(
			this.editor.hierarchyView,
			this.onSelectHierarchyViewMenuItem
		)
		contextMenu.show();
	}

	showInspectorViewComponentMenu(): void {
		var contextMenu = EditorMenu.getInspectorViewComponentMenu(
			this.onSelectInspectorViewComponentMenu
		);
		contextMenu.show();
	}

	showInspectorViewAddComponentMenu(): void {
		var contextMenu = EditorMenu.getInspectorViewAddComponentMenu(
			this.onSelectInspectorViewAddComponentMenu
		);
		contextMenu.show();
	}

	showProjectViewMenu(): void {
		var contextMenu = EditorMenu.getProjectViewMenu(
			this.onSelectProjectViewMenu
		);
		contextMenu.show();
	}

	selectHierarchyViewItem(object3d: Tea.Object3D): void {
		var hierarchyView = this.editor.hierarchyView;
		var item = hierarchyView.findItemByTag(object3d.id);
		hierarchyView.select(item);
	}

	createDragImage(text: string): HTMLElement {
		var dragImage = document.createElement("div");
		var imageText = document.createElement("div");
		dragImage.classList.add("dragImage");
		imageText.innerText = text;
		dragImage.appendChild(imageText);
		return dragImage;
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

	onSelectInspectorViewComponentMenu = (item: Electron.MenuItem): void => {
		var inspectorView = this.editor.inspectorView;
		var component = inspectorView._configComponent;
		//console.log(item.id, component);
		var object3d = this.hierarchyViewItem;
		if (object3d == null) {
			return;
		}

		switch (item.id) {
			case "Remove Component":
				object3d.removeComponent(component);
				this.selectHierarchyViewItem(object3d);
				break;
		}
	}

	onSelectInspectorViewAddComponentMenu = (item: Electron.MenuItem): void => {
		var object3d = this.hierarchyViewItem;
		if (object3d == null) {
			return;
		}

		var component = null;
		switch (item.id) {
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
			this.selectHierarchyViewItem(object3d);
		}
	}

	onSelectProjectViewMenu = (item: Electron.MenuItem): void => {
		var projectView = this.editor.projectView;
		var menuItem = projectView.selectedItem;

		switch (item.id) {
			case "Reveal in Finder":
				Electron.shell.openItem(menuItem.tag);
				console.log("Reveal in Finder", menuItem);
				break;
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
		var hierarchyView = this.editor.hierarchyView;
		setTimeout(() => {
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
			hierarchyView.items = items;
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
	snoozeHandle: any;
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
		if (this.snoozeHandle != null) {
			clearTimeout(this.snoozeHandle);
			this.snoozeHandle = null;
		}
		clearInterval(this.handle);
		this.handle = null;
	}

	snooze(wait: number): void {
		if (this.handle == null) {
			if (this.snoozeHandle != null) {
				clearTimeout(this.snoozeHandle);
				this.snoozeHandle = setTimeout(() => {
					this.snoozeHandle = null;
					this.start();
				}, wait);
			}
			return;
		}
		clearInterval(this.handle);
		this.handle = null;
		this.snoozeHandle = setTimeout(() => {
			this.snoozeHandle = null;
			this.start();
		}, wait);
	}
}
