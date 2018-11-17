import Vue from "vue";
import Component from "vue-class-component";
import { NoCache } from "./NoCache";

@Component({
	template: `
		<li>
			<div
				class="item"
				ref="item"
				:class="{ selected: isSelected }"
				:style="{ paddingLeft: (0.2 + (depth * 1.3)) + 'em' }"
				:title="model.title"
				:draggable="draggable"
				@click.stop="onClick"
				@dblclick.stop="onDoubleClick"
				@contextmenu="onContextMenu">
				<div
					class="folder"
					@click.stop="toggle"
					v-html="folderIcon">
				</div>
				<div class="text">{{ model.text }}</div>
			</div>
			<ul v-show="isOpen" v-if="isFolder">
				<item
					v-for="(model, index) in model.children"
					ref="items"
					:key="index"
					:model="model"
					:depth="depth + 1"
					@create="onCreate"
					@select="onSelect"
					@doubleClick="$emit('doubleClick', $event)">
				</item>
			</ul>
		</li>
	`,
	props: {
		model: Object,
		depth: Number
	},
	data: () => {
		return {
			isOpen: false,
			isSelected: false,
			title: null,
			openIcon: "📂",
			closeIcon: "📁",
			draggable: false,
		}
	},
	computed: {
		/*
		isFolder: function (): boolean {
			var item = this as Item;
			return item.isFolder;
		}
		*/
	}
})
export class Item extends Vue {
	model: any;
	depth: number;
	isOpen: boolean;
	isSelected: boolean;
	//isFolder: boolean;
	title: string;
	openIcon: string;
	closeIcon: string;
	draggable: boolean;
	dragEvents: TreeView.DragEvents;

	@NoCache
	get text(): string {
		return this.model.text;
	}

	@NoCache
	get tag(): any {
		return this.model.tag;
	}

	@NoCache
	get isFolder(): boolean {
		return this.model.isFolder;
	}

	/*
	get isFolder(): boolean {
		var children = this.model.children;
		return children != null
			&& children.length > 0;
	}
	//*/

	@NoCache
	get index(): number {
		var parent = this.$parent as Item | TreeView;
		var items = parent.getItemComponents();
		return items.indexOf(this);
	}

	@NoCache
	get folderIcon(): string {
		if (this.isFolder === false) {
			return "";
		}
		if (this.isOpen) {
			return this.openIcon;
		}
		return this.closeIcon;
	}

	@NoCache
	get firstChild(): Item {
		return this.getItemComponents()[0];
	}

	@NoCache
	get lastChild(): Item {
		var items = this.getItemComponents();
		var length = items.length;
		return items[length - 1];
	}

	@NoCache
	get nextSibling(): Item {
		var parent = this.$parent as Item | TreeView;
		var items = parent.getItemComponents();
		var index = items.indexOf(this);
		return items[index + 1];
	}

	@NoCache
	get prevSibling(): Item {
		var parent = this.$parent as Item | TreeView;
		var items = parent.getItemComponents();
		var index = items.indexOf(this);
		return items[index - 1];
	}

	getItemComponents(): Array<Item> {
		var items = this.$refs.items as Array<Item>;
		if (items == null) {
			return [];
		}
		return items;
	}

	expand(): void {
		if (this.isFolder === false) {
			return;
		}
		if (this.isOpen) {
			return;
		}
		this.isOpen = true;
		var parent = this.findTreeView();
		parent.$emit("expand", this);
	}

	collapse(): void {
		if (this.isFolder === false) {
			return;
		}
		if (this.isOpen === false) {
			return;
		}
		this.isOpen = false;
		var treeView = this.findTreeView();
		if (treeView != null) {
			var selectedItem = treeView.selectedItem;
			if (selectedItem != null) {
				this.forEachChild((item: Item): boolean => {
					if (selectedItem === item) {
						treeView.unselect();
						return true;
					}
					return false;
				});
			}
		}
		var parent = this.findTreeView();
		parent.$emit("collapse", this);
	}

	toggle(): void {
		if (this.isFolder === false) {
			return;
		}
		if (this.isOpen) {
			this.collapse();
		} else {
			this.expand();
		}
	}

	select(value: boolean = true): void {
		this.isSelected = value;
	}

	findTreeView(): TreeView {
		var treeView = this.$parent;
		var length = TreeView.maxDepth;
		for (var i = 0; i < length; i++) {
			if (treeView == null) {
				return null;
			}
			if (treeView instanceof TreeView) {
				return treeView;
			}
			treeView = treeView.$parent;
		}
		return null;
	}

	protected created(): void {
		this.$emit("create", this);
		if (this.dragEvents == null) {
			this.dragEvents = new TreeView.DragEvents();
		}
	}

	protected mounted(): void {
		if (this.draggable) {
			var item = this.$refs.item as HTMLElement;
			item.addEventListener("drag", this.onDrag);
			item.addEventListener("dragstart", this.onDragStart);
			item.addEventListener("dragend", this.onDragEnd);
			item.addEventListener("dragenter", this.onDragEnter);
			item.addEventListener("dragleave", this.onDragLeave);
			item.addEventListener("dragover", this.onDragOver);
			item.addEventListener("drop", this.onDrop);
		}
		var isOpen = this.model.isOpen;
		if (isOpen != null) {
			if (isOpen === true) {
				this.expand();
			} else {
				this.collapse();
			}
		}
	}

	protected updated(): void {
		var isOpen = this.model.isOpen;
		if (isOpen != null) {
			if (isOpen === true) {
				this.expand();
			} else {
				this.collapse();
			}
		}
	}

	protected beforeDestroy(): void {
		if (this.draggable) {
			var item = this.$refs.item as HTMLElement;
			item.removeEventListener("drag", this.onDrag);
			item.removeEventListener("dragstart", this.onDragStart);
			item.removeEventListener("dragend", this.onDragEnd);
			item.removeEventListener("dragenter", this.onDragEnter);
			item.removeEventListener("dragleave", this.onDragLeave);
			item.removeEventListener("dragover", this.onDragOver);
			item.removeEventListener("drop", this.onDrop);
		}
	}

	protected forEachChild(callback: (item: Item) => boolean) {
		var forEach = (item: Item): boolean => {
			if ((item instanceof Item) === false) {
				return false;
			}
			var result = callback(item);
			if (result) {
				return true;
			}
			item.getItemComponents().some((item: Item) => {
				return forEach(item);
			});
			return false;
		};
		this.getItemComponents().some((item: Item) => {
			return forEach(item);
		});
	}

	protected onClick(): void {
		this.$emit("select", this);
	}

	protected onDoubleClick(): void {
		this.$emit("doubleClick", this);
	}

	protected onContextMenu(): void {
		this.$emit("select", this);
	}

	protected onCreate(item: Item): void {
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

	protected onSelect(item: Item): void {
		this.$emit("select", item);
	}

	protected onDrag(e: DragEvent): void {
		if (this.dragEvents.drag) {
			this.dragEvents.drag(e, this);
		}
	}

	protected onDragStart(e: DragEvent): void {
		if (this.dragEvents.dragStart) {
			this.dragEvents.dragStart(e, this);
		}
	}

	protected onDragEnd(e: DragEvent): void {
		if (this.dragEvents.dragEnd) {
			this.dragEvents.dragEnd(e, this);
		}
	}

	protected onDragEnter(e: DragEvent): void {
		if (this.dragEvents.dragEnter) {
			this.dragEvents.dragEnter(e, this);
		}
	}

	protected onDragLeave(e: DragEvent): void {
		if (this.dragEvents.dragLeave) {
			this.dragEvents.dragLeave(e, this);
		}
	}

	protected onDragOver(e: DragEvent): void {
		if (this.dragEvents.dragOver) {
			this.dragEvents.dragOver(e, this);
		}
	}

	protected onDrop(e: DragEvent): void {
		if (this.dragEvents.drop) {
			this.dragEvents.drop(e, this);
		}
	}
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
				<item
					v-for="(item, index) in items"
					ref="items"
					:key="index"
					:model="item"
					:depth="0"
					@create="onCreateItem"
					@select="onSelectItem"
					@doubleClick="onDoubleClickItem">
				</item>
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
		item: Item
	}
})
export class TreeView extends Vue {
	static readonly maxDepth: number = 100;
	items: Array<any>;
	selectedItem: Item;
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

	getItemComponents(): Array<Item> {
		var items = this.$refs.items as Array<Item>;
		if (items == null) {
			return [];
		}
		return items;
	}

	expandAll(): void {
		var expand = (item: Item) => {
			item.expand();
			item.$children.forEach((item: Item) => {
				expand(item);
			});
		};
		this.$children.forEach((item: Item) => {
			if ((item instanceof Item) === false) {
				return;
			}
			expand(item);
		});
	}

	collapseAll(): void {
		var collapse = (item: Item) => {
			item.collapse();
			item.$children.forEach((item: Item) => {
				collapse(item);
			});
		};
		this.$children.forEach((item: Item) => {
			if ((item instanceof Item) === false) {
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

	findItemByTag(tag: any): Item {
		var find = (i: Item): Item => {
			if (i instanceof Item === false) {
				return null;
			}
			if (i.tag == tag) {
				return i;
			}
			var item: Item = null;
			i.$children.some((i: Item) => {
				item = find(i);
				return item != null;
			});
			return item;
		};
		var item: Item = null;
		this.$children.some((i: Item) => {
			item = find(i);
			return item != null;
		});
		return item;
	}

	select(item: Item): void {
		if (item == null) {
			this.unselect();
			return;
		}
		this.forEachChild((item: Item) => {
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
		this.forEachChild((item: Item) => {
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
						next = next.$parent as Item;
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
				next = next.$parent as Item;
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
			prev = item.$parent as Item;
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
		if (item.$parent instanceof Item) {
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
		var item = items[length - 1] as Item;
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

	protected scrollTo(item: Item): void {
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
		this.forEachChild((item: Item) => {
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

	protected onCreateItem(item: Item): void {
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

	protected onSelectItem(item: Item): void {
		if (item == null || item == this.selectedItem) {
			return;
		}
		this.forEachChild((item: Item) => {
			item.select(false);
		});
		item.select();
		this.selectedItem = item;
		if (this._preventSelectEvent === false) {
			this.$emit("select", item);
		}
	}

	protected onDoubleClickItem(item: Item): void {
		this.$emit("doubleClick", item);
	}

	protected forEachChild(callback: (item: Item) => void) {
		var forEach = (item: Item) => {
			if ((item instanceof Item) === false) {
				return;
			}
			callback(item);
			item.getItemComponents().forEach((item: Item) => {
				forEach(item);
			});
		};
		this.getItemComponents().forEach((item: Item) => {
			forEach(item);
		});
	}
}

var  _Item = Item;
type _Item = Item;

export module TreeView {
	export class DragEvents {
		drag: (e: DragEvent, item: Item) => void;
		dragStart: (e: DragEvent, item: Item) => void;
		dragEnd: (e: DragEvent, item: Item) => void;
		dragEnter: (e: DragEvent, item: Item) => void;
		dragLeave: (e: DragEvent, item: Item) => void;
		dragOver: (e: DragEvent, item: Item) => void;
		drop: (e: DragEvent, item: Item) => void;

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

	export var  Item = _Item;
	export type Item = _Item;
}
