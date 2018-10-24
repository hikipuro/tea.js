import Vue from "vue";
import * as Electron from "electron";
import * as Tea from "../Tea";
import { Editor } from "./Editor";
import { EditorMenu } from "./EditorMenu";
import { SelectAspect } from "./basic/SelectAspect";
import { UICommands } from "./commands/UICommands";
import { HierarchyViewCommand } from "./commands/HierarchyViewCommand";
import { ObjectInspectorCommand } from "./commands/ObjectInspectorCommand";
import { EditorCommand } from "./commands/EditorCommand";
import { Tabs } from "./containers/Tabs";

export class EditorBehavior {
	editor: Editor;
	scene: Tea.Scene;
	commands: UICommands;
	editorCommand: EditorCommand;
	hierarchyViewCommand: HierarchyViewCommand;
	objectInspectorCommand: ObjectInspectorCommand;

	constructor(editor: Editor) {
		this.editor = editor;
		this.initEvents();
		this.initMainMenu();
		this.initUICommands();
		this.initTabs();
		this.initScreenView();
		this.initHierarchyView();
		this.initInspectorView();
		this.initProjectView();
	}

	initEvents(): void {
		var keyDownHandler = this.onDocumentKeyDown;
		if (process && process.platform) {
			if (process.platform === "darwin") {
				keyDownHandler = this.onDocumentKeyDownMac;
			}
		}
		document.addEventListener("keydown", keyDownHandler);
	}

	initMainMenu(): void {
		var menu = EditorMenu.getMainMenu(
			this.onSelectMainMenu
		);
		EditorMenu.setMainMenu(menu);
	}

	initUICommands(): void {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;

		this.commands = new UICommands();
		this.commands.hierarchyView = hierarchyView;
		this.commands.inspectorView = inspectorView;

		this.editorCommand = new EditorCommand();
		this.editorCommand.editor = this.editor;
		this.editorCommand.hierarchyView = hierarchyView;
		this.editorCommand.inspectorView = inspectorView;

		this.hierarchyViewCommand = new HierarchyViewCommand();
		this.hierarchyViewCommand.hierarchyView = hierarchyView;
		this.hierarchyViewCommand.inspectorView = inspectorView;

		this.objectInspectorCommand = new ObjectInspectorCommand();
		this.objectInspectorCommand.hierarchyView = hierarchyView;
		this.objectInspectorCommand.inspectorView = inspectorView;
		this.objectInspectorCommand.hierarchyViewCommand = this.hierarchyViewCommand;
	}

	initTabs(): void {
		var mainTabs = this.editor.$refs.mainTabs as Tabs;
		var playerPanel = this.editor.$refs.playerPanel as Vue;
		var scenePanel = this.editor.$refs.scenePanel as Vue;
		var canvas = this.editor.$refs.canvas as HTMLElement;
		mainTabs.$on("select", (item) => {
			switch (item.name) {
				case "Player":
					playerPanel.$el.appendChild(canvas);
					this.scene.app.isSceneView = false;
					break;
				case "Scene":
					scenePanel.$el.appendChild(canvas);
					this.scene.app.isSceneView = true;
					break;
			}
			this.updateScreenSize();
		});
	}

	initScreenView(): void {
		var hierarchyResize = this.editor.$refs.hierarchyResize as Vue;
		var inspectorResize = this.editor.$refs.inspectorResize as Vue;
		var projectResize = this.editor.$refs.projectResize as Vue;
		hierarchyResize.$on("resize", Tea.debounce(() => {
			this.scene.app.renderer.dispatchResizeEvent();
			//this.updateScreenSize();
		}, 100));
		inspectorResize.$on("resize", Tea.debounce(() => {
			this.scene.app.renderer.dispatchResizeEvent();
			//this.updateScreenSize();
			//this.scene.app.renderer.stats.updateSize();
		}, 100));
		projectResize.$on("resize", Tea.debounce(() => {
			this.scene.app.renderer.dispatchResizeEvent();
			//this.updateScreenSize();
		}, 100));
	}

	initHierarchyView(): void {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;
		//var contextMenu = this.editor.contextMenu;

		hierarchyView.$on("menu", (e: MouseEvent) => {
			e.preventDefault();
			this.hierarchyViewCommand.showContextMenu();
		});
		hierarchyView.$on("select", (item: Tea.Editor.TreeViewItem) => {
			if (item == null) {
				hierarchyView.unselect();
				inspectorView.hide();
				return;
			}
			//console.log("select", item.tag);
			this.objectInspectorCommand.update();
		});
		hierarchyView.$on("drop", (mode: number, idSrc: number, idDst: number) => {
			//console.log("drop", idSrc, idDst, item.model.text);
			var scene = this.scene;
			var object3dSrc = scene.findChildById(idSrc);
			var object3dDst = scene.findChildById(idDst);
			if (object3dSrc == null || object3dDst == null) {
				return;
			}
			//console.log(mode);
			var item: Tea.Editor.TreeViewItem = null;
			switch (mode) {
				case 0:
					object3dSrc.parent = object3dDst;
					this.hierarchyViewCommand.update(false, () => {
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
					scene.moveChild(object3dSrc, object3dDst);
					this.hierarchyViewCommand.update(false, () => {
						item = hierarchyView.findItemByTag(object3dSrc.id);
						if (item != null) {
							hierarchyView.select(item);
						}
					});
					break;
				case 2:
					scene.moveChild(object3dSrc, object3dDst, false);
					this.hierarchyViewCommand.update(false, () => {
						item = hierarchyView.findItemByTag(object3dSrc.id);
						if (item != null) {
							hierarchyView.select(item);
						}
					});
					break;
			}
		});
	}

	initInspectorView(): void {
		var hierarchyView = this.editor.hierarchyView;
		var inspectorView = this.editor.inspectorView;

		inspectorView._commands = this.commands;
		inspectorView.$on("update", (type: string, key: string, value: any) => {
			if (type === "ObjectInspector") {
				if (hierarchyView.getSelectedItem() == null) {
					return;
				}
				var object3d = this.hierarchyViewCommand.getSelectedObject();
				if (object3d == null) {
					return;
				}
				this.editorCommand.isChanged = true;
				switch (key) {
					case "name":
						hierarchyView.getSelectedItem().model.text = value;
						break;
					case "rotation":
						this.objectInspectorCommand.snoozeUpdateTimer(1000);
						break;
				}
			}
		});
		inspectorView.$on("change", (type: any, property: string, value: any) => {
			console.log("change", property, value);
		});
		inspectorView.$on("menu", (type: string) => {
			switch (type) {
				case "component":
					this.objectInspectorCommand.showComponentMenu();
					break;
				case "addComponent":
					this.objectInspectorCommand.showAddComponentMenu();
					break;
			}
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

	setScene(scene: Tea.Scene) {
		var renderer = scene.app.renderer;
		renderer.off("resize", this.updateScreenSize);
		renderer.on("resize", this.updateScreenSize);
		renderer.once("update", () => {
			this.hierarchyViewCommand.update(true);
		});

		this.scene = scene;
		this.commands.scene = scene;
		this.editorCommand.app = scene.app;
		this.editorCommand.scene = scene;
		this.hierarchyViewCommand.scene = scene;
		this.objectInspectorCommand.scene = scene;
	}

	updateScreenSize = (): void => {
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

	showProjectViewMenu(): void {
		var contextMenu = EditorMenu.getProjectViewMenu(
			this.onSelectProjectViewMenu
		);
		contextMenu.show();
	}

	protected onDocumentKeyDown = (e: KeyboardEvent): void => {
		var ctrlKey = e.ctrlKey;
		if (ctrlKey === false) {
			return;
		}
		var shiftKey = e.shiftKey;
		var key = e.key.toLowerCase();
		switch (key) {
			case "z":
				e.preventDefault();
				if (shiftKey) {
					this.commands.redo();
					break;
				}
				this.commands.undo();
				break;
		}
	}

	protected onDocumentKeyDownMac = (e: KeyboardEvent): void => {
		var ctrlKey = e.metaKey;
		if (ctrlKey === false) {
			return;
		}
		var shiftKey = e.shiftKey;
		var key = e.key.toLowerCase();
		switch (key) {
			case "z":
				e.preventDefault();
				if (shiftKey) {
					this.commands.redo();
					break;
				}
				this.commands.undo();
				break;
		}
	}

	protected onSelectMainMenu = (item: Electron.MenuItem): void => {
		console.log(item.id);
		//this.editorCommand.isChanged = true;

		switch (item.id) {
			case "File/New Scene":
				this.editorCommand.newScene();
				break;
			case "File/Open Scene":
				this.editorCommand.openScene();
				break;
			case "File/Save Scene":
				this.editorCommand.saveScene();
				break;
			case "File/Save Scene as":
				this.editorCommand.saveSceneAs();
				break;
		}
	}

	protected onSelectProjectViewMenu = (item: Electron.MenuItem): void => {
		var projectView = this.editor.projectView;
		var menuItem = projectView.selectedItem;

		switch (item.id) {
			case "Reveal in Finder":
				Electron.shell.openItem(menuItem.tag);
				console.log("Reveal in Finder", menuItem);
				break;
		}
	}
}
