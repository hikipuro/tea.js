import * as Electron from "electron";
import Vue from "vue";
import * as Tea from "../Tea";
import { Editor } from "./Editor";
import { EditorSettings } from "./EditorSettings";
import { EditorMenu } from "./EditorMenu";
import { Translator } from "./translate/Translator";
import { SelectAspect } from "./basic/SelectAspect";
import { UICommands } from "./commands/UICommands";
import { Tabs } from "./containers/Tabs";

export class EditorBehavior {
	editor: Editor;
	commands: UICommands;
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
		this.editor.status.on("isChanged", (value: boolean) => {
			this.updateWindowTitle();
		});
		if (Electron && Electron.remote) {
			var browserWindow = Electron.remote.getCurrentWindow();
			browserWindow.removeListener("enter-full-screen", this.onResizeWindow);
			browserWindow.removeListener("leave-full-screen", this.onResizeWindow);
			browserWindow.removeListener("maximize", this.onResizeWindow);
			browserWindow.removeListener("unmaximize", this.onResizeWindow);
			browserWindow.webContents.removeListener("devtools-reload-page", this.onDevtoolsReloadPage);
			browserWindow.on("enter-full-screen", this.onResizeWindow);
			browserWindow.on("leave-full-screen", this.onResizeWindow);
			browserWindow.on("maximize", this.onResizeWindow);
			browserWindow.on("unmaximize", this.onResizeWindow);
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
	}

	initTabs(): void {
		var mainTabs = this.editor.$refs.mainTabs as Tabs;
		var playerPanel = this.editor.$refs.playerPanel as Vue;
		var scenePanel = this.editor.$refs.scenePanel as Vue;
		var canvas = this.editor.$refs.canvas as HTMLElement;
		mainTabs.$on("select", (item) => {
			var app = this.editor.status.app;
			switch (item.tabId) {
				case "player":
					playerPanel.$el.appendChild(canvas);
					app.isSceneView = false;
					break;
				case "scene":
					scenePanel.$el.appendChild(canvas);
					app.isSceneView = true;
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
				this.editor.command.once("save", (path: string) => {
					if (path != null) {
						this.editor.consoleView.clear();
						this.editor.command.play();
					}
				});
				this.editor.command.saveScene();
			} else {
				this.editor.consoleView.clear();
				this.editor.command.play();
			}
		});
		toolBox.$on("stop", () => {
			console.log("stop");
			this.editor.command.stop();
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
			var app = this.editor.status.app;
			app.renderer.dispatchResizeEvent();
			//this.updateScreenSize();
		}, 100));
		inspectorResize.$on("resize", Tea.debounce(() => {
			var app = this.editor.status.app;
			app.renderer.dispatchResizeEvent();
			//this.updateScreenSize();
			//this.scene.app.renderer.stats.updateSize();
		}, 100));
		projectResize.$on("resize", Tea.debounce(() => {
			var app = this.editor.status.app;
			app.renderer.dispatchResizeEvent();
			//this.updateScreenSize();
		}, 100));
	}

	initHierarchyView(): void {
	}

	initInspectorView(): void {
	}

	initProjectView(): void {
	}

	setApp(app: Tea.App): void {
		var renderer = app.renderer;
		renderer.on("resize", this.updateScreenSize);
		renderer.on("changeScene", this.onChangeScene);
	}

	setScene(scene: Tea.Scene): void {
		var hierarchyView = this.editor.hierarchyView;
		var renderer = scene.app.renderer;
		renderer.once("update", () => {
			hierarchyView.command.update(true);
		});

		this.commands.scene = scene;

		scene.off("addChild", this.onAddChild);
		scene.on("addChild", this.onAddChild);
		scene.off("removeChild", this.onRemoveChild);
		scene.on("removeChild", this.onRemoveChild);

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
		var app = this.editor.status.app;
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

	protected saveAppSettings(): void {
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
	}

	protected onBeforeUnload = (e: BeforeUnloadEvent): void => {
		if (this.editor.status.isChanged) {
			e.returnValue = false;
			this.editor.command.showConfirmSaveSceneDialog((response: number) => {
				switch (response) {
					case 0: // Save
						this.editor.command.once("save", (path: string) => {
							if (path == null) {
								this._willReload = false;
								return;
							}
							if (this._willReload) {
								location.reload();
							} else {
								window.close();
							}
						});
						this.editor.command.saveScene();
						break;
					case 2: // Don't Save
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
		this.saveAppSettings();
		//e.returnValue = false;
	}

	protected onResizeWindow = (): void => {
		var scene = this.editor.status.scene;
		if (scene == null) {
			return;
		}
		var renderer = scene.app.renderer;
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
					this.initMainMenu();
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
					var scene = this.editor.status.scene;
					var hierarchyView = this.editor.hierarchyView;
					var object3d = hierarchyView.command.getSelectedObject();
					scene.lockViewToSelected(object3d);
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
					var scene = this.editor.status.scene;
					var hierarchyView = this.editor.hierarchyView;
					var object3d = hierarchyView.command.getSelectedObject();
					scene.lockViewToSelected(object3d);
					break;
			}
			return;
		}
	}

	protected onAddChild = (): void => {
		var hierarchyView = this.editor.hierarchyView;
		var item = hierarchyView.command.getSelectedObject();
		this.editor.$nextTick(() => {
			hierarchyView.command.update();
			hierarchyView.command.selectItem(item);
		});
	}

	protected onRemoveChild = (): void => {
		var hierarchyView = this.editor.hierarchyView;
		var item = hierarchyView.command.getSelectedObject();
		this.editor.$nextTick(() => {
			hierarchyView.command.update();
			hierarchyView.command.selectItem(item);
		});
	}

	protected onChangeScene = (scene: Tea.Scene): void => {
		this.editor.status.scene = scene;
		//this.editor.hierarchyView.command.update(true);
	}

	protected onSelectMainMenu = (item: Electron.MenuItem): void => {
		console.log(item.id);
		//this.editorCommand.isChanged = true;

		var command = this.editor.command;
		switch (item.id) {
			case "App/Preferences":
				command.showPreferences();
				break;
			case "File/New Scene":
				command.newScene();
				break;
			case "File/Open Scene":
				command.openScene();
				break;
			case "File/Save Scene":
				command.saveScene();
				break;
			case "File/Save Scene as":
				command.saveSceneAs();
				break;
			case "File/New Project":
				command.newProject();
				break;
			case "File/Open Project":
				command.openProject();
				break;
			case "File/Build":
				command.build();
				break;
			case "View/Reload":
				this._willReload = true;
				location.reload();
				break;
		}
	}

	protected onDevtoolsReloadPage = (): void => {
		this._willReload = true;
	}
}
