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
	}},
	computed: {
		/*
		isFolder: function (): boolean {
			var item = this as Item;
			return item.isFolder;
		}
		*/
	},
	created: function () {
		var item = this as Item;
		item.$emit("create", item);
	}
})
export class Item extends Vue {
	model: any;
	depth: number;
	isOpen: boolean;
	isSelected: boolean;
	title: string;
	openIcon: string;
	closeIcon: string;

	get text(): string {
		return this.model.text;
	}

	get tag(): any {
		return this.model.tag;
	}

	get isFolder(): boolean {
		var children = this.model.children;
		return children != null
			&& children.length > 0;
	}

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
		this.isOpen = true;
	}

	collapse(): void {
		if (this.isFolder === false) {
			return;
		}
		this.isOpen = false;
	}

	toggle(): void {
		if (this.isFolder === false) {
			return;
		}
		this.isOpen = !this.isOpen;
	}

	select(value: boolean = true): void {
		this.isSelected = value;
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
	}

	protected onSelect(item: Item): void {
		this.$emit("select", item);
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
		return this.$children.find((item: Item) => {
			if (item instanceof Item === false) {
				return false;
			}
			return item.tag == tag;
		}) as Item;
	}

	select(item: Item): void {
		this.onSelectItem(item);
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
			for (var i = 0; i < TreeView.maxDepth; i++) {
				if (prev.isFolder && prev.isOpen) {
					prev = prev.lastChild;
					continue;
				}
				break;
			}
		}
		this.onSelectItem(prev);
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
			callback(item);
			item.$children.forEach((item: Item) => {
				forEach(item);
			});
		};
		this.$children.forEach((item: Item) => {
			if (item instanceof Item === false) {
				return;
			}
			forEach(item);
		});
	}
}

var  _Item = Item;
type _Item = Item;
export module TreeView {
	export var  Item = _Item;
	export type Item = _Item;
}
