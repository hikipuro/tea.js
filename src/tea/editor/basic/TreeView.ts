import Vue from "vue";
import Component from "vue-class-component";
import { NoCache } from "./NoCache";
import { TreeViewItem } from "./TreeViewItem";

export class Model {
	text: string;
	isFolder?: boolean;
	isOpen?: boolean;
	icon?: string;
	indent?: string;
	tag?: any;
	children: Array<Model>;
}

@Component({
	template: `
		<div
			class="TreeView"
			@keydown="onKeyDown"
			@click="onClick"
			@focus="onFocus"
			@contextmenu="onContextMenu">
			<slot name="before"></slot>
			<ul ref="root">
				<TreeViewItem
					v-for="(item, index) in items"
					ref="items"
					:key="index"
					:model="item"
					@create="onCreateItem"
					@select="onSelectItem"
					@doubleClick="onDoubleClickItem"
					@before-rename="onBeforeRenameItem"
					@rename="onRenameItem">
				</TreeViewItem>
			</ul>
			<slot></slot>
			<slot name="after"></slot>
		</div>
	`,
	data: () => {
		return {
			items: [],
			draggable: false
		}
	},
	components: {
		TreeViewItem: TreeViewItem
	}
})
export class TreeView extends Vue {
	static readonly maxDepth: number = 100;
	items: Array<Model>;
	selectedItem: TreeViewItem;
	openIcon: string;
	closeIcon: string;
	draggable: boolean;
	dragEvents: TreeView.DragEvents;
	tag: any;
	protected _preventSelectEvent: boolean;

	@NoCache
	get childCount(): number {
		return this.getItemComponents().length;
	}

	getItemComponents(): Array<TreeViewItem> {
		var items = this.$refs.items as Array<TreeViewItem>;
		if (items == null) {
			return [];
		}
		return items;
	}

	expandAll(): void {
		var expand = (item: TreeViewItem) => {
			item.expand();
			item.$children.forEach((item: TreeViewItem) => {
				expand(item);
			});
		};
		this.$children.forEach((item: TreeViewItem) => {
			if ((item instanceof TreeViewItem) === false) {
				return;
			}
			expand(item);
		});
	}

	collapseAll(): void {
		var collapse = (item: TreeViewItem) => {
			item.collapse();
			item.$children.forEach((item: TreeViewItem) => {
				collapse(item);
			});
		};
		this.$children.forEach((item: TreeViewItem) => {
			if ((item instanceof TreeViewItem) === false) {
				return;
			}
			collapse(item);
		});
	}

	expand(): void {
		if (this.selectedItem == null) {
			return;
		}
		this.selectedItem.expand();
	}

	collapse(): void {
		if (this.selectedItem == null) {
			return;
		}
		this.selectedItem.collapse();
	}

	findItemByTag(tag: any): TreeViewItem {
		var find = (i: TreeViewItem): TreeViewItem => {
			if ((i instanceof TreeViewItem) === false) {
				return null;
			}
			if (i.tag == tag) {
				return i;
			}
			var item: TreeViewItem = null;
			i.$children.some((i: TreeViewItem) => {
				item = find(i);
				return item != null;
			});
			return item;
		};
		var item: TreeViewItem = null;
		this.$children.some((i: TreeViewItem) => {
			item = find(i);
			return item != null;
		});
		return item;
	}

	select(item: TreeViewItem): void {
		if (item == null) {
			this.unselect();
			return;
		}
		this.forEachChild((item: TreeViewItem) => {
			item.select(false);
		});
		item.select();
		this.selectedItem = item;
		this.$emit("select", item);
	}

	unselect(): void {
		if (this.selectedItem == null) {
			return;
		}
		this.forEachChild((item: TreeViewItem) => {
			item.select(false);
		});
		this.selectedItem = null;
		this.$emit("select", null);
	}

	selectNext(): void {
		var items = this.getItemComponents();
		//console.log("select next", items);
		if (items.length <= 0) {
			return;
		}
		if (this.selectedItem == null) {
			this.onSelectItem(items[0]);
			return;
		}
		if (items.length <= 1
		&& items[0].isFolder === false) {
			return;
		}
		var item = this.selectedItem;
		if (item.isFolder && item.isOpen) {
			var child = item.firstChild;
			if (child) {
				this.onSelectItem(child);
			} else {
				var next = item.nextSibling;
				if (next == null) {
					next = item;
					for (var i = 0; i < TreeView.maxDepth; i++) {
						next = next.$parent as TreeViewItem;
						if (next == null) {
							break;
						}
						if (next.nextSibling != null) {
							next = next.nextSibling;
							break;
						}
					}
				}
				this.onSelectItem(next);
			}
			return;
		}
		var next = item;
		for (var i = 0; i < TreeView.maxDepth; i++) {
			var nextSibling = next.nextSibling;
			if (nextSibling == null) {
				next = next.$parent as TreeViewItem;
				if (next == null) {
					break;
				}
				continue;
			}
			next = nextSibling;
			break;
		}
		this.onSelectItem(next);
	}

	selectPrev(): void {
		var items = this.getItemComponents();
		if (items.length <= 0) {
			return;
		}
		if (this.selectedItem == null) {
			this.selectEnd();
			return;
		}
		var item = this.selectedItem;
		var prev = item.prevSibling;
		if (prev == null) {
			prev = item.$parent as TreeViewItem;
			if (prev instanceof TreeView) {
				return;
			}
			this.onSelectItem(prev);
			return;
		}
		if (prev.isFolder && prev.isOpen) {
			prev = prev.lastChild;
			if (prev == null) {
				item = item.prevSibling;
				this.onSelectItem(item);
				return;
			}
			for (var i = 0; i < TreeView.maxDepth; i++) {
				if (prev.isFolder && prev.isOpen) {
					if (prev.lastChild == null) {
						break;
					}
					prev = prev.lastChild;
					continue;
				}
				break;
			}
		}
		this.onSelectItem(prev);
	}

	selectParent(): void {
		var items = this.getItemComponents();
		if (items.length <= 0) {
			return;
		}
		var item = this.selectedItem;
		if (item == null) {
			return;
		}
		if (item.$parent instanceof TreeViewItem) {
			this.onSelectItem(item.$parent);
		}
	}

	selectHome(): void {
		var items = this.getItemComponents();
		if (items.length <= 0) {
			return;
		}
		this.onSelectItem(items[0]);
	}

	selectEnd(): void {
		var items = this.getItemComponents();
		if (items.length <= 0) {
			return;
		}
		var length = items.length;
		var item = items[length - 1] as TreeViewItem;
		for (var i = 0; i < TreeView.maxDepth; i++) {
			if (item.isFolder && item.isOpen) {
				item = item.lastChild;
				continue;
			}
			break;
		}
		this.onSelectItem(item);
	}

	protected created(): void {
		this._preventSelectEvent = false;
		this.dragEvents = new TreeView.DragEvents();
	}

	protected updated(): void {
		var items = this.items;
		this.$nextTick(() => {
			var removeIsOpen = (item) => {
				delete item.isOpen;
				item.children.forEach((i) => {
					removeIsOpen(i);
				});
			};
			items.forEach((item) => {
				removeIsOpen(item);
			});
		});
	}

	protected scrollTo(item: TreeViewItem): void {
		if (item == null) {
			return;
		}
		var el = this.$el as HTMLElement;
		var itemEl = item.$el as HTMLElement;
		var itemChildEl = itemEl.querySelector(".item") as HTMLElement;

		var top = el.scrollTop;
		var itemTop = itemEl.offsetTop - el.offsetTop;
		if (top > itemTop) {
			el.scrollTo(0, itemTop);
			return;
		}
		var bottom = top + el.clientHeight;
		var itemBottom = itemTop + itemChildEl.offsetHeight;
		if (bottom < itemBottom) {
			el.scrollTo(0, itemBottom - el.clientHeight);
		}
	}

	protected pageUp(): void {
		var item = this.selectedItem;
		if (item == null) {
			return;
		}
		var el = this.$el as HTMLElement;
		var itemEl = item.$el as HTMLElement;
		itemEl = itemEl.querySelector(".item");
		var itemsPerPage = Math.floor(el.clientHeight / itemEl.clientHeight);
		this._preventSelectEvent = true;
		for (var i = 1; i < itemsPerPage; i++) {
			this.selectPrev();
		}
		this._preventSelectEvent = false;
		this.$emit("select", this.selectedItem);
	}

	protected pageDown(): void {
		var item = this.selectedItem;
		if (item == null) {
			return;
		}
		var el = this.$el as HTMLElement;
		var itemEl = item.$el as HTMLElement;
		itemEl = itemEl.querySelector(".item");
		var itemsPerPage = Math.floor(el.clientHeight / itemEl.clientHeight);
		this._preventSelectEvent = true;
		for (var i = 1; i < itemsPerPage; i++) {
			this.selectNext();
		}
		this._preventSelectEvent = false;
		this.$emit("select", this.selectedItem);
	}

	protected onClick(): void {
		if (this.selectedItem == null) {
			return;
		}
		this.forEachChild((item: TreeViewItem) => {
			item.select(false);
		});
		this.selectedItem = null;
		this.$emit("select", null);
	}

	protected onFocus(e: Event): void {
		this.$emit("focus", e);
	}

	protected onContextMenu(e: MouseEvent): void {
		this.$emit("menu", e);
	}

	protected onKeyDown(e: KeyboardEvent): void {
		var target = e.target as HTMLElement;
		if (target.tagName.toLowerCase() === "input") {
			return;
		}
		var scrollFlag = false;
		var item = this.selectedItem;
		switch (e.key) {
			case "Escape":
				this.unselect();
				break;
			case "ArrowUp":
				scrollFlag = true;
				this.selectPrev();
				break;
			case "ArrowDown":
				scrollFlag = true;
				this.selectNext();
				break;
			case "ArrowLeft":
				if (item != null) {
					scrollFlag = true;
					if (item.isFolder) {
						if (item.isOpen) {
							this.collapse();
						} else {
							this.selectParent();
						}
					} else {
						this.selectParent();
					}
				}
				break;
			case "ArrowRight":
				scrollFlag = true;
				this.expand();
				break;
			case "Home":
				scrollFlag = true;
				this.selectHome();
				break;
			case "End":
				scrollFlag = true;
				this.selectEnd();
				break;
			case "PageUp":
				scrollFlag = true;
				this.pageUp();
				break;
			case "PageDown":
				scrollFlag = true;
				this.pageDown();
				break;
		}

		if (scrollFlag) {
			e.preventDefault();
			this.scrollTo(this.selectedItem);
		}
	}

	protected onCreateItem(item: TreeViewItem): void {
		if (this.openIcon != null) {
			item.openIcon = this.openIcon;
		}
		if (this.closeIcon != null) {
			item.closeIcon = this.closeIcon;
		}
		item.draggable = this.draggable;
		if (this.draggable) {
			item.dragEvents = this.dragEvents;
		}
	}

	protected onSelectItem(item: TreeViewItem): void {
		if (item == null || item == this.selectedItem) {
			return;
		}
		this.forEachChild((item: TreeViewItem) => {
			item.select(false);
		});
		item.select();
		this.selectedItem = item;
		if (this._preventSelectEvent === false) {
			this.$emit("select", item);
		}
	}

	protected onDoubleClickItem(item: TreeViewItem): void {
		this.$emit("doubleClick", item);
	}

	protected onBeforeRenameItem(item: TreeViewItem, rename: HTMLInputElement): void {
		this.$emit("before-rename", item, rename);
	}

	protected onRenameItem(item: TreeViewItem, value: string): void {
		this.$emit("rename", item, value);
	}

	protected forEachChild(callback: (item: TreeViewItem) => void) {
		var forEach = (item: TreeViewItem) => {
			if ((item instanceof TreeViewItem) === false) {
				return;
			}
			callback(item);
			item.getItemComponents().forEach((item: TreeViewItem) => {
				forEach(item);
			});
		};
		this.getItemComponents().forEach((item: TreeViewItem) => {
			forEach(item);
		});
	}
}

var  _Model = Model;
type _Model = Model;

export module TreeView {
	export class DragEvents {
		drag: (e: DragEvent, item: TreeViewItem) => void;
		dragStart: (e: DragEvent, item: TreeViewItem) => void;
		dragEnd: (e: DragEvent, item: TreeViewItem) => void;
		dragEnter: (e: DragEvent, item: TreeViewItem) => void;
		dragLeave: (e: DragEvent, item: TreeViewItem) => void;
		dragOver: (e: DragEvent, item: TreeViewItem) => void;
		drop: (e: DragEvent, item: TreeViewItem) => void;

		constructor() {
			this.drag = null;
			this.dragStart = null;
			this.dragEnd = null;
			this.dragEnter = null;
			this.dragLeave = null;
			this.dragOver = null;
			this.drop = null;
		}
	}

	export var  Model = _Model;
	export type Model = _Model;
}
