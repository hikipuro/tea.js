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
				@click.stop="onClick">
				<div
					class="folder"
					@click.stop="toggle">
					{{ isFolder ? isOpen ? "⏏️" : "▶️" : "" }}
				</div>
				<div class="text">{{ model.text }}</div>
			</div>
			<ul v-show="isOpen" v-if="isFolder">
				<item
					v-for="(model, index) in model.children"
					:key="index"
					:model="model"
					:depth="depth + 1"
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
		title: null
	}},
	computed: {
		/*
		isFolder: function (): boolean {
			var item = this as Item;
			return item.isFolder;
		}
		*/
	},
})
export class Item extends Vue {
	model: any;
	isOpen: boolean;
	isSelected: boolean;
	title: string;
	tag: any;

	get text(): string {
		return this.model.text;
	}

	get isFolder(): boolean {
		return this.model.children &&
			this.model.children.length;
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

	protected onSelect(item: Item): void {
		this.$emit("select", item);
	}
}

@Component({
	template: `
		<ul
			class="TreeView"
			@keydown="onKeyDown"
			@click="onClick"
			@contextmenu="onContextMenu">
			<item
				v-for="(item, index) in items"
				:key="index"
				:model="item"
				:depth="0"
				@select="onSelectItem">
			</item>
		</ul>
	`,
	data: () => { return {
		items: []
	}},
	components: {
		item: Item
	}
})
export class TreeView extends Vue {
	items: Array<any>;
	selectedItem: Item;
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

	selectNext(): void {
		if (this.selectedItem == null) {
			this.onSelectItem(this.$children[0] as Item);
			return;
		}
		var index = this.$children.indexOf(this.selectedItem);
		this.onSelectItem(this.$children[index + 1] as Item);
	}

	selectPrev(): void {
		if (this.selectedItem == null) {
			this.onSelectItem(this.$children[this.$children.length - 1] as Item);
			return;
		}
		var index = this.$children.indexOf(this.selectedItem);
		this.onSelectItem(this.$children[index - 1] as Item);
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

	protected onKeyDown = (e: KeyboardEvent): void => {
		console.log("onKeyDown", e.key, document.activeElement);
		switch (e.key) {
			case "ArrowUp":
				this.selectPrev();
				break;
			case "ArrowDown":
				this.selectNext();
				break;
			case "ArrowLeft":
				this.collapse();
				break;
			case "ArrowRight":
				this.expand();
				break;
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
