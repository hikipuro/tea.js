import * as Electron from "electron";
const remote = Electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export class NativeContextMenu {
	menu: Electron.Menu;
	onShow: (menu: NativeContextMenu) => void;
	onClose: (menu: NativeContextMenu) => void;

	constructor() {
		this.menu = null;
		this.onClose = null;
	}

	static create(template: Electron.MenuItemConstructorOptions[]): NativeContextMenu {
		var menu = new NativeContextMenu();
		menu.menu = Menu.buildFromTemplate(template);
		menu.menu.once("menu-will-show", menu._onShow);
		menu.menu.once("menu-will-close", menu._onClose);
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

	protected _onShow = (e: Electron.Event): void => {
		if (this.onShow != null) {
			this.onShow(this);
		}
	}

	protected _onClose = (e: Electron.Event): void => {
		if (this.onClose != null) {
			this.onClose(this);
		}
	}
}
