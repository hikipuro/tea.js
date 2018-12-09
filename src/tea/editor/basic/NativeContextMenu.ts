import * as Electron from "electron";
import { EventDispatcher } from "../../utils/EventDispatcher";
const remote = Electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export class NativeContextMenu extends EventDispatcher {
	menu: Electron.Menu;

	constructor() {
		super();
		this.menu = null;
	}

	static create(template: Electron.MenuItemConstructorOptions[]): NativeContextMenu {
		var menu = new NativeContextMenu();
		menu.menu = Menu.buildFromTemplate(template);
		menu.menu.once("menu-will-show", menu.onShow);
		menu.menu.once("menu-will-close", menu.onClose);
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

	showItem(id: string): void {
		var item = this.getMenuItemById(id);
		item.visible = true;
	}

	hideItem(id: string): void {
		var item = this.getMenuItemById(id);
		item.visible = false;
	}

	enableItem(id: string): void {
		var item = this.getMenuItemById(id);
		this.enableSubmenu(item, true);
	}

	disableItem(id: string): void {
		var item = this.getMenuItemById(id);
		this.enableSubmenu(item, false);
	}

	protected enableSubmenu(item: Electron.MenuItem, enabled: boolean): void {
		if (item == null) {
			return;
		}
		item.enabled = enabled;
		if (item.submenu == null) {
			return;
		}
		var items = item.submenu.items;
		items.forEach((item: Electron.MenuItem) => {
			item.enabled = enabled;
			this.enableSubmenu(item, enabled);
		});
	}

	protected onShow = (e: Electron.Event): void => {
		this.emit("show", this);
	}

	protected onClose = (e: Electron.Event): void => {
		this.emit("close", this);
	}
}
