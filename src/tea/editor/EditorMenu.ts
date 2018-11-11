import * as Electron from "electron";
var remote = null;
var Menu = null;
if (Electron) {
	remote = Electron.remote;
	Menu = remote.Menu;
}

import { Editor } from "./Editor";
import { Translator } from "./translate/Translator";
import { NativeContextMenu } from "./basic/NativeContextMenu";
import { HierarchyView } from "./HierarchyView";

export class EditorMenu {
	static setMainMenu(menu: Electron.Menu): void {
		Menu.setApplicationMenu(menu);
	}

	static getMainMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): Electron.Menu {
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				label: "File",
				submenu: [
					{
						id: "File/New Scene",
						label: "New Scene",
						accelerator: "CmdOrCtrl+N"
					},
					{
						id: "File/Open Scene",
						label: "Open Scene",
						accelerator: "CmdOrCtrl+O"
					},
					{
						type: "separator"
					},
					{
						id: "File/Save Scene",
						label: "Save Scene",
						accelerator: "CmdOrCtrl+S"
					},
					{
						id: "File/Save Scene as",
						label: "Save Scene as...",
						accelerator: "CmdOrCtrl+Shift+S"
					},
					{
						type: "separator"
					},
					{
						id: "File/Build",
						label: "Build",
						accelerator: "CmdOrCtrl+B"
					},
				]
			},
			{
				label: "Edit",
				submenu: [
					{
						id: "Edit/Undo",
						label: "Undo",
						accelerator: "CmdOrCtrl+Z"
					},
					{
						id: "Edit/Redo",
						label: "Redo",
						accelerator: "CmdOrCtrl+Shift+Z"
					}
				]
			},
			{
				label: "View",
				submenu: [
					{ role: "reload" },
					{ role: "forcereload" },
					{ role: "toggledevtools" },
					{ type: "separator" },
					{ role: "resetzoom" },
					{ role: "zoomin" },
					{ role: "zoomout" },
					{ type: "separator" },
					{ role: "togglefullscreen" }
				]
			},
			{
				role: "window",
				submenu: [
					{ role: "minimize" }
				]
			}
		];
		if (process && process.platform) {
			if (process.platform === "darwin") {
				template[3].submenu = [
					{ role: "minimize" },
					{ role: "zoom" },
					{ type: "separator" },
					{ role: "front" }
				];
				template.unshift(
					{
						label: Electron.remote.app.getName(),
						submenu: [
							{ role: "about" },
							{
								id: "App/Preferences",
								label: "Preferences",
								accelerator: "CmdOrCtrl+,"
							},
							{ type: "separator" },
							{ role: "services", submenu: [] },
							{ type: "separator" },
							{ role: "hide" },
							{ role: "hideothers" },
							{ role: "unhide" },
							{ type: "separator" },
							{ role: "quit" }
						]
					}
				);
				template.push(
					{
						role: "help",
						submenu: []
					}
				);
			}
		}
		EditorMenu.setMenuItemHandler(
			template, handler
		);
		return Menu.buildFromTemplate(template);
	}

	static getHierarchyViewMenu(
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
				id: "Camera",
				label: translator.getText("Camera/Title"),
			}
		];
		var item = hierarchyView.getSelectedItem();
		if (item != null && item.tag >= 0) {
			template.unshift(
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

	static getInspectorViewComponentMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var translator = Translator.getInstance();
		translator.basePath = "ObjectInspector/ComponentMenu";
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				id: "Remove Component",
				label: translator.getText("RemoveComponent")
			}
		];
		EditorMenu.setMenuItemHandler(
			template, handler
		);
		return Editor.NativeContextMenu.create(template);
	}

	static getInspectorViewAddComponentMenu(
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

	static getProjectViewMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var template: Electron.MenuItemConstructorOptions[] = [];
		if (process && process.platform) {
			console.log("process.platform", process.platform);
			if (process.platform === "win32") {
				template.push(
					{
						id: "Show in Explorer",
						label: "Show in Explorer"
					}
				);
			} else if (process.platform === "darwin") {
				template.push(
					{
						id: "Reveal in Finder",
						label: "Reveal in Finder"
					}
				);
			}
		}
		EditorMenu.setMenuItemHandler(
			template, handler
		);
		return Editor.NativeContextMenu.create(template);
	}

	static getProjectViewFileMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				id: "Open",
				label: "Open"
			},
			{
				id: "Delete",
				label: "Delete",
				enabled: false
			},
			{
				id: "Rename",
				label: "Rename",
				enabled: false
			}
		];
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
