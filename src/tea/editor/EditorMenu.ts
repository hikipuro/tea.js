import * as Tea from "../Tea";
import { NativeContextMenu } from "./NativeContextMenu";

export class EditorMenu {
	static getHierarchyViewMenu(
		hierarchyView: Tea.Editor.TreeView,
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
					}
				]
			},
			{
				id: "Camera",
				label: "Camera"
			}
		];
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
