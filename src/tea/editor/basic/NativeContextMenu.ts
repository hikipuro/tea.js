import * as Electron from "electron";
const remote = Electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export class NativeContextMenu {
	menu: Electron.Menu;

	static create(template: Electron.MenuItemConstructorOptions[]): NativeContextMenu {
		var menu = new NativeContextMenu();
		menu.menu = Menu.buildFromTemplate(template);
		return menu;
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

	add(options: Electron.MenuItemConstructorOptions): void {
		var item = new MenuItem(options);
		this.menu.append(item);
	}

	show(): void {
		var window = remote.getCurrentWindow();
		this.menu.popup({
			window: window
		});
	}

	hide(): void {
		var window = remote.getCurrentWindow();
		this.menu.closePopup(window);
	}
}
