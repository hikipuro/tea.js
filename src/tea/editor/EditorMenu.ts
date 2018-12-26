import * as Electron from "electron";
import { Editor } from "./Editor";
import { Translator } from "./translate/Translator";
import { NativeContextMenu } from "./basic/NativeContextMenu";
import { HierarchyView } from "./views/HierarchyView";

const remote = Electron.remote;
const Menu = remote.Menu;

export class EditorMenu {
	static mainMenu: Electron.Menu;

	static getMainMenu(): Electron.Menu {
		if (process && process.platform) {
			if (process.platform === "darwin") {
				return Menu.getApplicationMenu();
			}
		}
		return EditorMenu.mainMenu;
	}

	static setMainMenu(menu: Electron.Menu): void {
		EditorMenu.mainMenu = menu;
		if (process && process.platform) {
			if (process.platform === "darwin") {
				Menu.setApplicationMenu(menu);
				return;
			}
		}
		if (process.type !== "browser") {
			var window = Electron.remote.getCurrentWindow();
			window.setMenu(menu);
		}
	}

	static createMainMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): Electron.Menu {
		var appName = "";
		if (process.type === "browser") {
			appName = Electron.app.getName();
		} else {
			appName = Electron.remote.app.getName();
		}
		var translator = Translator.getInstance();
		translator.basePath = "MainMenu";
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				id: "File",
				label: translator.getText("File/Title"),
				submenu: [
					{
						id: "File/New Scene",
						label: translator.getText("File/NewScene"),
						accelerator: "CmdOrCtrl+N"
					},
					{
						id: "File/Open Scene",
						label: translator.getText("File/OpenScene"),
						accelerator: "CmdOrCtrl+O"
					},
					{
						type: "separator"
					},
					{
						id: "File/Save Scene",
						label: translator.getText("File/SaveScene"),
						accelerator: "CmdOrCtrl+S"
					},
					{
						id: "File/Save Scene as",
						label: translator.getText("File/SaveSceneAs"),
						accelerator: "CmdOrCtrl+Shift+S"
					},
					{
						type: "separator"
					},
					{
						id: "File/New Project",
						label: translator.getText("File/NewProject")
					},
					{
						id: "File/Open Project",
						label: translator.getText("File/OpenProject")
					},
					{
						type: "separator"
					},
					{
						id: "File/Build",
						label: translator.getText("File/Build"),
						accelerator: "CmdOrCtrl+B"
					},
				]
			},
			{
				label: translator.getText("Edit/Title"),
				submenu: [
					{
						id: "Edit/Undo",
						label: translator.getText("Edit/Undo"),
						accelerator: "CmdOrCtrl+Z",
						enabled: false
					},
					{
						id: "Edit/Redo",
						label: translator.getText("Edit/Redo"),
						accelerator: "CmdOrCtrl+Shift+Z",
						enabled: false
					}
				]
			},
			{
				label: translator.getText("View/Title"),
				submenu: [
					{
						id: "View/Reload",
						label: translator.getText("View/Reload"),
						accelerator: "CmdOrCtrl+R",
					},
					//{ role: "forcereload" },
					{
						role: "toggledevtools",
						label: translator.getText("View/ToggleDevTools")
					},
					{ type: "separator" },
					{
						role: "resetzoom",
						label: translator.getText("View/ResetZoom")
					},
					{
						role: "zoomin",
						label: translator.getText("View/ZoomIn")
					},
					{
						role: "zoomout",
						label: translator.getText("View/ZoomOut")
					},
					{ type: "separator" },
					{
						role: "togglefullscreen",
						label: translator.getText("View/ToggleFullScreen")
					}
				]
			},
			{
				role: "window",
				label: translator.getText("Window/Title"),
				submenu: [
					{
						role: "minimize",
						label: translator.getText("Window/Minimize")
					}
				]
			}
		];
		if (process && process.platform) {
			if (process.platform === "darwin") {
				template[3].submenu = [
					{
						role: "minimize",
						label: translator.getText("Window/Minimize")
					},
					{
						role: "zoom",
						label: translator.getText("Window/Zoom")
					},
					{ type: "separator" },
					{
						role: "front",
						label: translator.getText("Window/Front")
					}
				];
				template.unshift(
					{
						label: Electron.remote.app.getName(),
						submenu: [
							{
								role: "about",
								label: translator.getText("App/About").replace("{{App}}", appName)
							},
							{
								id: "App/Preferences",
								label: translator.getText("App/Preferences"),
								accelerator: "CmdOrCtrl+,"
							},
							{ type: "separator" },
							{
								role: "services",
								label: translator.getText("App/Services"),
								submenu: []
							},
							{ type: "separator" },
							{
								role: "hide",
								label: translator.getText("App/Hide").replace("{{App}}", appName)
							},
							{
								role: "hideothers",
								label: translator.getText("App/HideOthers")
							},
							{
								role: "unhide",
								label: translator.getText("App/Unhide")
							},
							{ type: "separator" },
							{
								role: "quit",
								label: translator.getText("App/Quit")
							}
						]
					}
				);
				template.push(
					{
						role: "help",
						label: translator.getText("Help/Title"),
						submenu: []
					}
				);
			}
			if (process.platform === "win32") {
				var fileMenu = template[0].submenu as Electron.MenuItemConstructorOptions[];
				fileMenu.push(
					{ type: "separator" },
					{
						id: "App/Quit",
						role: "quit",
						label: translator.getText("App/Quit")
					}
				);
				var editMenu = template[1].submenu as Electron.MenuItemConstructorOptions[];
				editMenu.push(
					{ type: "separator" },
					{
						id: "App/Preferences",
						label: translator.getText("App/Preferences"),
						accelerator: "CmdOrCtrl+,"
					}
				);
			}
		}
		EditorMenu.setMenuItemHandler(
			template, handler
		);
		return Menu.buildFromTemplate(template);
	}

	static createHierarchyViewMenu(
		hierarchyView: HierarchyView,
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var translator = Translator.getInstance();
		translator.basePath = "HierarchyView/ContextMenu";

		var template: Electron.MenuItemConstructorOptions[] = [
			{
				id: "Create Empty",
				label: translator.getText("CreateEmpty")
			},
			{
				label: translator.getText("3DObject/Title"),
				submenu: [
					{
						id: "3D Object/Cube",
						label: translator.getText("3DObject/Cube"),
					},
					{
						id: "3D Object/Sphere",
						label: translator.getText("3DObject/Sphere"),
					},
					{
						id: "3D Object/Capsule",
						label: translator.getText("3DObject/Capsule"),
					},
					{
						id: "3D Object/Cylinder",
						label: translator.getText("3DObject/Cylinder"),
					},
					{
						id: "3D Object/Plane",
						label: translator.getText("3DObject/Plane"),
					},
					{
						id: "3D Object/Quad",
						label: translator.getText("3DObject/Quad"),
					},
					{
						type: "separator"
					},
					{
						id: "3D Object/Text",
						label: translator.getText("3DObject/Text"),
					},
				]
			},
			{
				label: translator.getText("Effects/Title"),
				submenu: [
					{
						id: "Effects/Particle System",
						label: translator.getText("Effects/ParticleSystem"),
					}
				]
			},
			{
				label: translator.getText("Light/Title"),
				submenu: [
					{
						id: "Light/Directional Light",
						label: translator.getText("Light/DirectionalLight"),
					},
					{
						id: "Light/Point Light",
						label: translator.getText("Light/PointLight"),
					},
					{
						id: "Light/Spot Light",
						label: translator.getText("Light/SpotLight"),
					}
				]
			},
			{
				label: translator.getText("Audio/Title"),
				submenu: [
					{
						id: "Audio/Audio Source",
						label: translator.getText("Audio/AudioSource"),
					}
				]
			},
			{
				id: "Camera",
				label: translator.getText("Camera/Title"),
			},
			{
				id: "UI",
				label: translator.getText("UI/Title"),
				submenu: [
					{
						id: "UI/Canvas",
						label: translator.getText("UI/Canvas"),
					},
					{
						id: "UI/Text",
						label: translator.getText("UI/Text"),
					}
				]
			}
		];
		var item = hierarchyView.getSelectedItem();
		if (item != null && item.tag >= 0) {
			template.unshift(
				{
					id: "Rename",
					label: translator.getText("Rename")
				},
				{
					id: "Delete",
					label: translator.getText("Delete"),
				},
				{
					type: "separator"
				}
			);
		}
		EditorMenu.setMenuItemHandler(
			template, handler
		);
		return Editor.NativeContextMenu.create(template);
	}

	static createInspectorViewComponentMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var translator = Translator.getInstance();
		translator.basePath = "ObjectInspector/ComponentMenu";
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				id: "Remove Component",
				label: translator.getText("RemoveComponent")
			},
			{
				id: "Move Up",
				label: translator.getText("MoveUp")
			},
			{
				id: "Move Down",
				label: translator.getText("MoveDown")
			}
		];
		EditorMenu.setMenuItemHandler(
			template, handler
		);
		return Editor.NativeContextMenu.create(template);
	}

	static createInspectorViewAddComponentMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var translator = Translator.getInstance();
		translator.basePath = "ObjectInspector/AddComponentMenu";

		var template: Electron.MenuItemConstructorOptions[] = [
			{
				label: translator.getText("Audio/Title"),
				submenu: [
					{
						id: "Audio/Audio Source",
						label: translator.getText("Audio/AudioSource")
					}
				]
			},
			{
				label: translator.getText("Effects/Title"),
				submenu: [
					{
						id: "Effects/Line Renderer",
						label: translator.getText("Effects/LineRenderer")
					}
				]
			},
			{
				label: translator.getText("Mesh/Title"),
				submenu: [
					{
						id: "Mesh/Mesh Filter",
						label: translator.getText("Mesh/MeshFilter")
					},
					{
						id: "Mesh/Mesh Renderer",
						label: translator.getText("Mesh/MeshRenderer")
					}
				]
			},
			{
				label: translator.getText("Physics/Title"),
				submenu: [
					{
						id: "Physics/BoxCollider",
						label: translator.getText("Physics/BoxCollider")
					},
					{
						id: "Physics/SphereCollider",
						label: translator.getText("Physics/SphereCollider")
					},
					{
						id: "Physics/Rigidbody",
						label: translator.getText("Physics/Rigidbody")
					}
				]
			},
			{
				label: translator.getText("Rendering/Title"),
				submenu: [
					{
						id: "Rendering/Camera",
						label: translator.getText("Rendering/Camera")
					},
					{
						id: "Rendering/Light",
						label: translator.getText("Rendering/Light")
					}
				]
			}
		];
		EditorMenu.setMenuItemHandler(
			template, handler
		);
		return Editor.NativeContextMenu.create(template);
	}

	static createProjectViewMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var translator = Translator.getInstance();
		translator.basePath = "ProjectView/ContextMenu";
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				id: "Create",
				label: translator.getText("Create/Title"),
				submenu: [
					{
						id: "Create/Folder",
						label: translator.getText("Create/Folder")
					},
					{
						id: "Create/JavaScript",
						label: translator.getText("Create/JavaScript")
					}
				]
			},
			{
				id: "Delete",
				label: translator.getText("Delete")
			},
			{
				id: "Rename",
				label: translator.getText("Rename")
			},
			{
				id: "Copy Path",
				label: translator.getText("CopyPath")
			},
			{
				type: "separator"
			},
			{
				id: "Refresh",
				label: translator.getText("Refresh")
			}
		];
		if (process && process.platform) {
			if (process.platform === "win32") {
				template.splice(1, 0,
					{
						id: "Show in Explorer",
						label: translator.getText("Show in Explorer")
					}
				);
			} else if (process.platform === "darwin") {
				template.splice(1, 0,
					{
						id: "Reveal in Finder",
						label: translator.getText("Reveal in Finder")
					}
				);
			}
		}
		EditorMenu.setMenuItemHandler(
			template, handler
		);
		return Editor.NativeContextMenu.create(template);
	}

	static createProjectViewFileMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var translator = Translator.getInstance();
		translator.basePath = "ProjectView/ContextMenu";
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				label: translator.getText("Create/Title"),
				submenu: [
					{
						id: "Create/Folder",
						label: translator.getText("Create/Folder"),
					},
					{
						id: "Create/JavaScript",
						label: translator.getText("Create/JavaScript"),
					}
				]
			},
			{
				id: "Open",
				label: translator.getText("Open")
			},
			{
				id: "Delete",
				label: translator.getText("Delete")
			},
			{
				id: "Rename",
				label: translator.getText("Rename")
			},
			{
				id: "Copy Path",
				label: translator.getText("CopyPath")
			},
			{
				type: "separator"
			},
			{
				id: "Refresh",
				label: translator.getText("Refresh")
			},
			{
				id: "Convert",
				label: "Convert"
			},
		];
		if (process && process.platform) {
			if (process.platform === "win32") {
				template.splice(1, 0,
					{
						id: "Show in Explorer",
						label: translator.getText("Show in Explorer")
					}
				);
			} else if (process.platform === "darwin") {
				template.splice(1, 0,
					{
						id: "Reveal in Finder",
						label: translator.getText("Reveal in Finder")
					}
				);
			}
		}
		EditorMenu.setMenuItemHandler(
			template, handler
		);
		return Editor.NativeContextMenu.create(template);
	}

	static setMenuItemHandler(
		template: Electron.MenuItemConstructorOptions[],
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): void {
		if (template == null) {
			return;
		}
		var setHandler = (item: Electron.MenuItemConstructorOptions) => {
			item.click = handler
			if (item.submenu) {
				var submenu = item.submenu as Electron.MenuItemConstructorOptions[];
				submenu.forEach(item => {
					setHandler(item);
				});
			}
		};
		template.forEach(item => {
			setHandler(item);
		});
	}
}
