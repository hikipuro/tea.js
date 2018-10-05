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
					{{ isFolder ? isOpen ? "[-]" : "[+]" : "" }}
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
			@click="onClick">
			<item
				v-for="(model, index) in items"
				:key="index"
				:model="model"
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

	protected onClick(): void {
		if (this.selectedItem == null) {
			return;
		}
		this.forEachChildren((item: Item) => {
			item.select(false);
		});
		this.selectedItem = null;
		this.$emit("select", null);
	}

	protected onSelectItem(item: Item): void {
		if (this.selectedItem == item) {
			return;
		}
		this.forEachChildren((item: Item) => {
			item.select(false);
		});
		item.select();
		this.selectedItem = item;
		this.$emit("select", item);
	}

	protected forEachChildren(callback: (item: Item) => void) {
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
