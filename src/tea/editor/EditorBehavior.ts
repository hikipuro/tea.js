import * as nodePath from "path";
import * as fs from "fs";
import * as Electron from "electron";
import Vue from "vue";
import * as Tea from "../Tea";
import { Editor } from "./Editor";
import { EditorSettings } from "./EditorSettings";
import { EditorMenu } from "./EditorMenu";
import { FileInspector } from "./FileInspector";
import { SceneInspector } from "./SceneInspector";
import { Translator } from "./translate/Translator";
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
	protected _willReload: boolean = false;

	constructor(editor: Editor) {
		this.editor = editor;
		this.initEvents();
		this.initMainMenu();
		this.initUICommands();
		this.initTabs();
		this.initToolBox();
		this.initConsoleView();
		this.initScreenView();
		this.initHierarchyView();
		this.initInspectorView();
		this.initProjectView();
	}

	initEvents(): void {
		if (Electron && Electron.remote) {
			var browserWindow = Electron.remote.getCurrentWindow();
			browserWindow.removeListener("enter-full-screen", this.onResizeWindow);
			browserWindow.removeListener("leave-full-screen", this.onResizeWindow);
			browserWindow.removeListener("maximize", this.onResizeWindow);
			browserWindow.removeListener("unmaximize", this.onResizeWindow);
			browserWindow.on("enter-full-screen", this.onResizeWindow);
			browserWindow.on("leave-full-screen", this.onResizeWindow);
			browserWindow.on("maximize", this.onResizeWindow);
			browserWindow.on("unmaximize", this.onResizeWindow);
			browserWindow.webContents.removeListener("devtools-reload-page", this.onDevtoolsReloadPage);
			browserWindow.webContents.on("devtools-reload-page", this.onDevtoolsReloadPage);
		}
		window.addEventListener("beforeunload", this.onBeforeUnload);
		window.addEventListener("message", this.onWindowMessage);
		var keyDownHandler = this.onDocumentKeyDown;
		if (process && process.platform) {
			if (process.platform === "darwin") {
				keyDownHandler = this.onDocumentKeyDownMac;
			}
		}
		document.addEventListener("keydown", keyDownHandler);
	}

	initMainMenu(): void {
		var menu = EditorMenu.createMainMenu(
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
		this.hierarchyViewCommand.editor = this.editor;
		this.hierarchyViewCommand.editorCommand = this.editorCommand;
		this.hierarchyViewCommand.hierarchyView = hierarchyView;
		this.hierarchyViewCommand.inspectorView = inspectorView;
		this.hierarchyViewCommand.on("menu", (id: string) => {
			this.editor.status.isChanged = true;
		});

		this.objectInspectorCommand = new ObjectInspectorCommand();
		this.objectInspectorCommand.editor = this.editor;
		this.objectInspectorCommand.editorCommand = this.editorCommand;
		this.objectInspectorCommand.hierarchyViewCommand = this.hierarchyViewCommand;
		this.objectInspectorCommand.hierarchyView = hierarchyView;
		this.objectInspectorCommand.inspectorView = inspectorView;

		this.editor.status.on("isChanged", (value: boolean) => {
			this.updateWindowTitle();
		});
	}

	initTabs(): void {
		var mainTabs = this.editor.$refs.mainTabs as Tabs;
		var playerPanel = this.editor.$refs.playerPanel as Vue;
		var scenePanel = this.editor.$refs.scenePanel as Vue;
		var canvas = this.editor.$refs.canvas as HTMLElement;
		mainTabs.$on("select", (item) => {
			switch (item.tabId) {
				case "player":
					playerPanel.$el.appendChild(canvas);
					this.scene.app.isSceneView = false;
					break;
				case "scene":
					scenePanel.$el.appendChild(canvas);
					this.scene.app.isSceneView = true;
					break;
			}
			this.updateScreenSize();
		});
	}

	initToolBox(): void {
		var toolBox = this.editor.toolBox;
		toolBox.$on("play", () => {
			console.log("play");
			if (this.editor.status.isChanged) {
				this.editorCommand.once("save", (path: string) => {
					if (path != null) {
						this.editorCommand.play();
					}
				});
				this.editorCommand.saveScene();
			} else {
				this.editorCommand.play();
			}
		});
		toolBox.$on("stop", () => {
			console.log("stop");
			this.editorCommand.stop();
		});
	}

	initConsoleView(): void {
		var consoleView = this.editor.consoleView;
		//*
		var log = console.log;
		var info = console.info;
		var warn = console.warn;
		var error = console.error;
		console.log = (message: any, ...optionalParams: any[]) => {
			log.apply(console, [message].concat(optionalParams));
			consoleView.log(message, optionalParams);
		};
		console.info = (message: any, ...optionalParams: any[]) => {
			info.apply(console, [message].concat(optionalParams));
			consoleView.info(message, optionalParams);
		};
		console.warn = (message: any, ...optionalParams: any[]) => {
			warn.apply(console, [message].concat(optionalParams));
			consoleView.warn(message, optionalParams);
		};
		console.error = (message: any, ...optionalParams: any[]) => {
			error.apply(console, [message].concat(optionalParams));
			consoleView.error(message, optionalParams);
		};
		window.addEventListener("error", (e: ErrorEvent) => {
			consoleView.error(e.message);
		});
		/*
		var webContents = Electron.remote.getCurrentWebContents();
		webContents.on("console-message", (e: Electron.Event, level: number, message: string, line: number, sourceId: string) => {
			switch (level) {
				case 0:
					consoleView.log(message, line, sourceId);
					break;
				case 1:
					consoleView.warn(message, line, sourceId);
					break;
				case 2:
					consoleView.error(message, line, sourceId);
					break;
			}
		});
		*/
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
		var projectView = this.editor.projectView;
		//var contextMenu = this.editor.contextMenu;

		hierarchyView.$on("menu", (e: MouseEvent) => {
			e.preventDefault();
			this.hierarchyViewCommand.showContextMenu();
		});
		hierarchyView.$on("select", (item: Editor.TreeViewItem) => {
			if (item == null) {
				hierarchyView.unselect();
				inspectorView.hide();
				return;
			}
			//console.log("select", item.tag);

			if (item.tag == -1) {
				//console.log("select scene");
				var scene = this.scene;
				inspectorView.hide();
				inspectorView.component = SceneInspector.extend({
					created: function () {
						var self = this as SceneInspector;
						self._scene = scene;
						scene = undefined;
					}
				});
				inspectorView.show();
			} else {
				this.objectInspectorCommand.update();
			}
		});
		hierarchyView.$on("doubleClick", (item: Editor.TreeViewItem) => {
			var object3d = this.hierarchyViewCommand.getSelectedObject();
			this.scene.lockViewToSelected(object3d);
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
			var item: Editor.TreeViewItem = null;
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
			this.editor.status.isChanged = true;
		});
		hierarchyView.$on("dropFromProjectView", (item: Editor.TreeViewItem) => {
			var dragSource = projectView.getDragSource();
			//console.log("dropFromProjectView", item, dragSource.tag);
			var id = item.tag as number;
			var object3d = this.scene.findChildById(id);
			if (object3d == null) {
				return;
			}
			var filename = dragSource.tag;
			var ext = Tea.File.extension(filename);
			ext = ext.toLowerCase();
			switch (ext) {
				case "js":
					Tea.ScriptLoader.load(
						this.scene.app, filename,
						(script: Tea.Script) => {
							if (script == null) {
								return;
							}
							object3d.addComponentInstance(script);
	
							var selectedObject = this.hierarchyViewCommand.getSelectedObject();
							if (selectedObject != null) {
								this.hierarchyViewCommand.selectItem(selectedObject);
							}
							this.editor.status.isChanged = true;
						}
					);
					break;
				case "jpg":
				case "png":
					var selectedObject = this.hierarchyViewCommand.getSelectedObject();
					if (selectedObject == null) {
						return;
					}
					var renderer = selectedObject.getComponent(Tea.MeshRenderer);
					if (renderer == null) {
						return;
					}
					Tea.File.exists(filename, (exists: boolean) => {
						if (exists === false) {
							return;
						}
						renderer.material.mainTexture.load(filename, (err, url) => {
							if (err) {
								return;
							}
							this.objectInspectorCommand.update();
						});
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
				this.editor.status.isChanged = true;
				switch (key) {
					case "name":
						hierarchyView.getSelectedItem().model.text = value;
						break;
					case "rotation":
						this.objectInspectorCommand.snoozeUpdateTimer(1000);
						break;
				}
			}
			if (type === "SceneInspector") {
				this.editor.status.isChanged = true;
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
		var inspectorView = this.editor.inspectorView;
		projectView.$on("folderListMenu", (e: MouseEvent) => {
			if (projectView.getSelectedFolderPath() == null) {
				return;
			}
			e.preventDefault();
			this.showProjectViewMenu();
		});
		projectView.$on("fileListMenu", (e: MouseEvent) => {
			if (projectView.getSelectedFolderPath() == null) {
				return;
			}
			e.preventDefault();
			this.showProjectViewFileMenu();
		});
		projectView.$on("selectFile", (item: Editor.TreeViewItem) => {
			if (item == null) {
				return;
			}
			var path = item.tag;
			if (fs.existsSync(path) === false) {
				return;
			}
			var ext = Tea.File.extension(path);
			ext = ext.toLowerCase();
			switch (ext) {
				case "json":
				case "html":
				case "css":
				case "js":
				case "ts":
				case "md":
				case "txt":
					Tea.File.readText(path, (err, data) => {
						if (err) {
							return;
						}
						inspectorView.hide();
						inspectorView.component = FileInspector;
						inspectorView.show();
						inspectorView.$nextTick(() => {
							var component = inspectorView.getComponent() as FileInspector;
							var stat = fs.statSync(path);
							component.fileType = ext.toUpperCase();
							component.text = data;
							component.setSize(stat.size);
							component.setCreatedTime(stat.birthtime);
							component.setModifiedTime(stat.mtime);
						});
					});
					break;
			}
		});
		projectView.openFolder(process.cwd());
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

		scene.off("addChild", this.onAddChild);
		scene.on("addChild", this.onAddChild);
		scene.off("removeChild", this.onRemoveChild);
		scene.on("removeChild", this.onRemoveChild);

		this.editor.consoleView.clear();
		this.updateScreenSize();
	}

	updateWindowTitle(): void {
		var remote = Electron.remote;
		if (remote == null || remote.getCurrentWindow == null) {
			return;
		}
		var window = remote.getCurrentWindow();
		var title = window.getTitle();
		var suffix = title.substr(-2);
		if (this.editor.status.isChanged) {
			if (suffix !== " *") {
				title += " *";
				window.setTitle(title);
			}
		} else {
			if (suffix === " *") {
				title = title.substr(0, title.length - 2);
				window.setTitle(title);
			}
		}
	}

	updateScreenSize = (): void => {
		var app = this.scene.app;
		var aspect = this.editor.$refs.aspect as SelectAspect;
		var canvas = this.editor.$refs.canvas as HTMLCanvasElement;
		var width = canvas.parentElement.clientWidth;
		var height = canvas.parentElement.clientHeight;
		if (app.isSceneView === false && aspect.x != 0 && aspect.y != 0) {
			if (width / height < aspect.x / aspect.y) {
				height = width * aspect.y / aspect.x;
			} else {
				width = height * aspect.x / aspect.y;
			}
		}
		var zoom = window.outerWidth / window.innerWidth;
		app.width = width * zoom;
		app.height = height * zoom;
		//console.log("updateScreenSize", width, height);
	}

	showProjectViewMenu(): void {
		var contextMenu = EditorMenu.createProjectViewMenu(
			this.onSelectProjectViewMenu
		);
		contextMenu.show();
	}

	showProjectViewFileMenu(): void {
		var contextMenu = EditorMenu.createProjectViewFileMenu(
			this.onSelectProjectViewFileMenu
		);
		contextMenu.show();
	}

	protected onBeforeUnload = (e: BeforeUnloadEvent): void => {
		if (this.editor.status.isChanged) {
			e.returnValue = false;
			this.editorCommand.showConfirmSaveSceneDialog((response: string) => {
				switch (response) {
					case "Save":
						this.editorCommand.once("save", (path: string) => {
							if (path == null) {
								return;
							}
							if (this._willReload) {
								location.reload();
							} else {
								window.close();
							}
						});
						this.editorCommand.saveScene();
						//window.close();
						break;
					case "Don't Save":
						this.editor.status.isChanged = false;
						if (this._willReload) {
							location.reload();
						} else {
							window.close();
						}
						break;
					default:
						this._willReload = false;
						break;
				}
			});
			return;
		}
		var settings = EditorSettings.getInstance();
		var browserWindow = Electron.remote.getCurrentWindow();
		var translator = Translator.getInstance();
		if (browserWindow.isFullScreen()) {
			browserWindow.setFullScreen(false);
		}
		if (browserWindow.isMaximized()) {
			browserWindow.hide();
			browserWindow.unmaximize();
		} else if (browserWindow.isMinimized()) {
			browserWindow.restore();
		}
		settings.window.setData(browserWindow);
		settings.language = translator.lang;
		settings.save();
		//e.returnValue = false;
	}

	protected onResizeWindow = (): void => {
		if (this.scene == null) {
			return;
		}
		var renderer = this.scene.app.renderer;
		setTimeout(() => {
			renderer.dispatchResizeEvent();
		}, 250);
	}

	protected onWindowMessage = (e: MessageEvent) => {
		var json = e.data;
		if (json.type === "preferences") {
			var translator = Translator.getInstance();
			switch (json.key) {
				case "ready":
					var source = e.source as any;
					var data = {
						key: "language",
						value: translator.lang
					}
					source.postMessage(data, "*");
					break;
				case "language":
					translator.loadResource(json.value);
					this.editor.translate();
					this.editor.$forceUpdate();
					console.log("language", json.value);
					break;
			}
		}
	}

	protected onDocumentKeyDown = (e: KeyboardEvent): void => {
		var ctrlKey = e.ctrlKey;
		var shiftKey = e.shiftKey;
		if (ctrlKey) {
			var key = e.key.toLowerCase();
			switch (key) {
				case "r":
					this._willReload = true;
					break;
				case "z":
					e.preventDefault();
					if (shiftKey) {
						this.commands.redo();
						break;
					}
					this.commands.undo();
					break;
			}
			return;
		}
		if (shiftKey) {
			var key = e.key.toLowerCase();
			switch (key) {
				case "f":
					var object3d = this.hierarchyViewCommand.getSelectedObject();
					this.scene.lockViewToSelected(object3d);
					break;
			}
			return;
		}
	}

	protected onDocumentKeyDownMac = (e: KeyboardEvent): void => {
		var ctrlKey = e.metaKey;
		var shiftKey = e.shiftKey;
		if (ctrlKey) {
			var key = e.key.toLowerCase();
			switch (key) {
				case "r":
					this._willReload = true;
					break;
				case "z":
					e.preventDefault();
					if (shiftKey) {
						this.commands.redo();
						break;
					}
					this.commands.undo();
					break;
			}
			return;
		}
		if (shiftKey) {
			var key = e.key.toLowerCase();
			switch (key) {
				case "f":
					var object3d = this.hierarchyViewCommand.getSelectedObject();
					this.scene.lockViewToSelected(object3d);
					break;
			}
			return;
		}
	}

	protected onAddChild = (): void => {
		var item = this.hierarchyViewCommand.getSelectedObject();
		this.editor.$nextTick(() => {
			this.hierarchyViewCommand.update();
			this.hierarchyViewCommand.selectItem(item);
		});
	}

	protected onRemoveChild = (): void => {
		var item = this.hierarchyViewCommand.getSelectedObject();
		this.editor.$nextTick(() => {
			this.hierarchyViewCommand.update();
			this.hierarchyViewCommand.selectItem(item);
		});
	}

	protected onSelectMainMenu = (item: Electron.MenuItem): void => {
		console.log(item.id);
		//this.editorCommand.isChanged = true;

		switch (item.id) {
			case "App/Preferences":
				this.editorCommand.showPreferences();
				break;
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
			case "File/New Project":
				this.editorCommand.newProject();
				break;
			case "File/Open Project":
				this.editorCommand.openProject();
				break;
			case "File/Build":
				this.editorCommand.build();
				break;
			case "View/Reload":
				this._willReload = true;
				location.reload();
				break;
		}
	}

	protected onSelectProjectViewMenu = (item: Electron.MenuItem): void => {
		var projectView = this.editor.projectView;
		var path = projectView.getSelectedFolderPath();
		path = nodePath.resolve(path);

		switch (item.id) {
			case "Show in Explorer":
				Electron.shell.openItem(path);
				break;
			case "Reveal in Finder":
				console.log("Reveal in Finder", path);
				Electron.shell.openItem(path);
				break;
		}
	}

	protected onSelectProjectViewFileMenu = (item: Electron.MenuItem): void => {
		var projectView = this.editor.projectView;
		var path = projectView.getSelectedFilePath();
		path = nodePath.resolve(path);

		switch (item.id) {
			case "Open":
				Electron.shell.openItem(path);
				console.log("Open", path);
				break;
		}
	}

	protected onDevtoolsReloadPage = (): void => {
		this._willReload = true;
	}
}
