import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<li>
			<div
				class="item"
				ref="item"
				:class="{ selected: isSelected }"
				:style="{ paddingLeft: (depth * 1.3) + 'em' }"
				:title="model.title"
				:draggable="draggable"
				@click.stop="onClick"
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
					:key="index"
					:model="model"
					:depth="depth + 1"
					@create="onCreate"
					@select="onSelect">
				</item>
			</ul>
		</li>
	`,
	props: {
		model: Object,
		depth: Number
	},
	data: () => { return {
		isOpen: false,
		isSelected: false,
		title: null,
		openIcon: "📂",
		closeIcon: "📁",
		draggable: false,
	}},
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

	get text(): string {
		return this.model.text;
	}

	get tag(): any {
		return this.model.tag;
	}

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

	get index(): number {
		return this.$parent.$children.indexOf(this);
	}

	get folderIcon(): string {
		if (this.isFolder === false) {
			return "";
		}
		if (this.isOpen) {
			return this.openIcon;
		}
		return this.closeIcon;
	}

	get firstChild(): Item {
		return this.$children[0] as Item;
	}

	get lastChild(): Item {
		var length = this.$children.length;
		return this.$children[length - 1] as Item;
	}

	get nextSibling(): Item {
		var parent = this.$parent;
		var index = parent.$children.indexOf(this);
		return parent.$children[index + 1] as Item;
	}

	get prevSibling(): Item {
		var parent = this.$parent;
		var index = parent.$children.indexOf(this);
		return parent.$children[index - 1] as Item;
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

	protected findTreeView(): TreeView {
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

	protected onClick(): void {
		this.$emit("select", this);
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
			@contextmenu="onContextMenu">
			<slot name="before"></slot>
			<ul ref="root">
				<item
					v-for="(item, index) in items"
					:key="index"
					:model="item"
					:depth="0"
					@create="onCreateItem"
					@select="onSelectItem">
				</item>
			</ul>
			<slot></slot>
			<slot name="after"></slot>
		</div>
	`,
	data: () => { return {
		items: []
	}},
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
	draggable: boolean = false;
	dragEvents: TreeView.DragEvents;
	tag: any;

	get childCount(): number {
		return this.$children.length;
	}

	expandAll(): void {
		var expand = (item: Item) => {
			item.expand();
			item.$children.forEach((item: Item) => {
				expand(item);
			});
		};
		this.$children.forEach((item: Item) => {
			if (item instanceof Item === false) {
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
			if (item instanceof Item === false) {
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
			return;
		}
		//this.onSelectItem(item);
		this.forEachChild((item: Item) => {
			item.select(false);
		});
		item.select();
		this.selectedItem = item;
		this.$emit("select", item);
	}

	unselect(): void {
		this.forEachChild((item: Item) => {
			item.select(false);
		});
		this.selectedItem = null;
		this.$emit("select", null);
	}

	selectNext(): void {
		if (this.selectedItem == null) {
			this.onSelectItem(this.$children[0] as Item);
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
			if (next.nextSibling == null) {
				next = next.$parent as Item;
				if (next == null) {
					break;
				}
				continue;
			}
			next = next.nextSibling;
			break;
		}
		this.onSelectItem(next);
	}

	selectPrev(): void {
		if (this.selectedItem == null) {
			var length = this.$children.length;
			var item = this.$children[length - 1] as Item;
			for (var i = 0; i < TreeView.maxDepth; i++) {
				if (item.isFolder && item.isOpen) {
					item = item.lastChild;
					continue;
				}
				break;
			}
			this.onSelectItem(item);
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

	protected created(): void {
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

	protected onContextMenu(e: MouseEvent): void {
		this.$emit("menu", e);
	}

	protected onKeyDown(e: KeyboardEvent): void {
		var isArrow = false;
		switch (e.key) {
			case "Escape":
				if (this.selectedItem != null) {
					this.forEachChild((item: Item) => {
						item.select(false);
					});
					this.selectedItem = null;
					this.$emit("select", null);
				}
				break;
			case "ArrowUp":
				isArrow = true;
				this.selectPrev();
				break;
			case "ArrowDown":
				isArrow = true;
				this.selectNext();
				break;
			case "ArrowLeft":
				isArrow = true;
				this.collapse();
				break;
			case "ArrowRight":
				isArrow = true;
				this.expand();
				break;
		}

		if (isArrow) {
			e.preventDefault();
			var item = this.selectedItem;
			if (item == null) {
				return;
			}
			var el = this.$el as HTMLElement;
			var itemEl = item.$el as HTMLElement;
			var itemChildEl = itemEl.querySelector(".item") as HTMLElement;

			var top = el.scrollTop;
			var itemTop = itemEl.offsetTop;
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
		this.$emit("select", item);
	}

	protected forEachChild(callback: (item: Item) => void) {
		var forEach = (item: Item) => {
			if (item instanceof Item === false) {
				return;
			}
			callback(item);
			item.$children.forEach((item: Item) => {
				forEach(item);
			});
		};
		this.$children.forEach((item: Item) => {
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
