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

	add(options: Electron.MenuItemConstructorOptions): void {
		var item = new MenuItem(options);
		this.menu.append(item);
	}

	show(x: number = null, y: number = null): void {
		var window = remote.getCurrentWindow();
		var options: Electron.PopupOptions = {
			window: window
		};
		if (x != null && y != null) {
			options.x = x;
			options.y = y;
		}
		this.menu.popup(options);
	}

	hide(): void {
		var window = remote.getCurrentWindow();
		this.menu.closePopup(window);
	}

	getMenuItemById(id: string): Electron.MenuItem {
		return this.menu.getMenuItemById(id);
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
