import * as Electron from "electron";
const remote = Electron.remote;
const Menu = remote.Menu;

import * as Tea from "../Tea";
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
			},
			{
				role: "help",
				submenu: [
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
			}
		}
		Tea.Editor.NativeContextMenu.setMenuItemHandler(
			template, handler
		);
		return Menu.buildFromTemplate(template);
	}

	static getHierarchyViewMenu(
		hierarchyView: HierarchyView,
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
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
					},
					{
						id: "Light/Point Light",
						label: "Point Light"
					},
					{
						id: "Light/Spot Light",
						label: "Spot Light"
					}
				]
			},
			{
				id: "Camera",
				label: "Camera"
			}
		];
		var item = hierarchyView.getSelectedItem();
		if (item != null && item.tag >= 0) {
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
			template, handler
		);
		return Tea.Editor.NativeContextMenu.create(template);
	}

	static getInspectorViewComponentMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				id: "Remove Component",
				label: "Remove Component"
			}
		];
		Tea.Editor.NativeContextMenu.setMenuItemHandler(
			template, handler
		);
		return Tea.Editor.NativeContextMenu.create(template);
	}

	static getInspectorViewAddComponentMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				label: "Effects",
				submenu: [
					{
						id: "Effects/Line Renderer",
						label: "Line Renderer"
					}
				]
			},
			{
				label: "Mesh",
				submenu: [
					{
						id: "Mesh/Mesh Filter",
						label: "Mesh Filter"
					},
					{
						id: "Mesh/Mesh Renderer",
						label: "Mesh Renderer"
					}
				]
			},
			{
				label: "Physics",
				submenu: [
					{
						id: "Physics/BoxCollider",
						label: "BoxCollider"
					},
					{
						id: "Physics/Rigidbody",
						label: "Rigidbody"
					}
				]
			},
			{
				label: "Rendering",
				submenu: [
					{
						id: "Rendering/Camera",
						label: "Camera"
					},
					{
						id: "Rendering/Light",
						label: "Light"
					}
				]
			}
		];
		Tea.Editor.NativeContextMenu.setMenuItemHandler(
			template, handler
		);
		return Tea.Editor.NativeContextMenu.create(template);
	}

	static getProjectViewMenu(
		handler: (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => void
	): NativeContextMenu {
		var template: Electron.MenuItemConstructorOptions[] = [
			{
				id: "Reveal in Finder",
				label: "Reveal in Finder"
			}
		];
		Tea.Editor.NativeContextMenu.setMenuItemHandler(
			template, handler
		);
		return Tea.Editor.NativeContextMenu.create(template);
	}
}
