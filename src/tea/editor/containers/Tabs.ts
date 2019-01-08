import Vue, { VNode } from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<li @click="onClick">{{ name }}</li>
	`,
	props: {
		/*name: {
			type: String,
			default: ""
		},*/
		index: {
			type: Number,
			default: -1
		}
	},
	data: () => {
		return {
			name: ""
		}
	}
})
export class TabBarItem extends Vue {
	name: string;
	index: number;

	select(): void {
		this.$el.classList.add("selected");
	}

	unselect(): void {
		this.$el.classList.remove("selected");
	}

	protected onClick(): void {
		this.$emit("select", this);
	}
}

@Component({
	template: `
		<ul
			class="TabBar"
			@focus="onFocus"
			@blur="onBlur"
			@keydown="onKeyDown">
			<TabBarItem
				v-for="(name, index) in names"
				ref="items"
				:key="index"
				:index="index"
				@select="onSelect"></TabBarItem>
		</ul>
	`,
	data: () => {
		return {
			names: [],
			selectedIndex: -1
		}
	},
	components: {
		TabBarItem: TabBarItem
	}
})
export class TabBar extends Vue {
	names: Array<string>;
	selectedIndex: number;

	select(index: number): void {
		var item = this.$children[index] as TabBarItem;
		if (item == null) {
			return;
		}
		this.unselectAllItems();
		item.select();
		if (this.hasFocus()) {
			item.$el.classList.add("focus");
		}
		this.selectedIndex = index;
	}

	hasFocus(): boolean {
		return document.activeElement === this.$el;
	}

	getItems(): Array<TabBarItem> {
		return this.$refs.items as Array<TabBarItem>;
	}

	getSelectedItem(): TabBarItem {
		var index = this.selectedIndex;
		return this.$children[index] as TabBarItem;
	}

	protected updated(): void {
		var items = this.getItems();
		items.forEach((item: TabBarItem, index: number) => {
			item.name = this.names[index];
		});
	}

	protected unselectAllItems(): void {
		this.$children.forEach((child: TabBarItem) => {
			child.unselect();
			child.$el.classList.remove("focus");
		});
	}

	protected onSelect(item: TabBarItem): void {
		if (this.selectedIndex === item.index) {
			return;
		}
		this.unselectAllItems();
		item.select();
		if (this.hasFocus()) {
			item.$el.classList.add("focus");
		}
		this.selectedIndex = item.index;
		this.$emit("select", item.index);
	}

	protected onFocus(): void {
		var item = this.getSelectedItem();
		item.$el.classList.add("focus");
	}

	protected onBlur(): void {
		var item = this.getSelectedItem();
		item.$el.classList.remove("focus");
	}

	protected onKeyDown(e: KeyboardEvent): void {
		var target = e.target as HTMLElement;
		if (target.classList.contains("TabBar") === false) {
			return;
		}
		var count = this.names.length;
		var index = this.selectedIndex;
		switch (e.key) {
			case "ArrowLeft":
				if (index > 0) {
					index--;
					this.select(index);
					this.$emit("select", index);
				}
				break;
			case "ArrowRight":
				if (index + 1 < count) {
					index++;
					this.select(index);
					this.$emit("select", index);
				}
				break;
		}
	}
}

@Component({
	template: `
		<div class="TabItem">
			<slot></slot>
		</div>
	`,
	props: {
		tabId: {
			type: String,
			default: ""
		},
		name: {
			type: String,
			default: ""
		}
	},
	data: () => {
		return {
		}
	}
})
export class TabItem extends Vue {
	tabId: string;
	name: string;

	show(): void {
		var el = this.$el as HTMLElement;
		el.style.display = null;
	}

	hide(): void {
		var el = this.$el as HTMLElement;
		el.style.display = "none";
	}
}

@Component({
	template: `
		<div class="Tabs">
			<TabBar
				ref="bar"
				:tabindex="tabindex"
				@select="onSelect"></TabBar>
			<slot></slot>
		</div>
	`,
	props: {
		tabindex: {
			type: Number,
			default: null
		}
	},
	components: {
		TabBar: TabBar
	}
})
export class Tabs extends Vue {
	select(index: number): void {
		//console.log("select", index);
		var item = this.getItem(index);
		if (item == null) {
			return;
		}
		var defaultSlot = this.$slots.default;
		defaultSlot.forEach((node: VNode) => {
			var child = node.componentInstance;
			if (child instanceof TabItem) {
				child.hide();
			}
		});
		item.show();
	}

	protected updated(): void {
		var bar = this.$refs.bar as TabBar;
		var items = bar.getItems();
		var defaultSlot = this.$slots.default;
		var index = 0;
		defaultSlot.forEach((node: VNode) => {
			var child = node.componentInstance as TabItem;
			if ((child instanceof TabItem) === false) {
				return;
			}
			var name = this.getName(child.name, index);
			items[index].name = name;
			index++;
		});
	}

	protected mounted(): void {
		var bar = this.$refs.bar as TabBar;
		var firstTab = true;
		var defaultSlot = this.$slots.default;
		var index = 0;
		defaultSlot.forEach((node: VNode) => {
			var child = node.componentInstance as TabItem;
			if ((child instanceof TabItem) === false) {
				return;
			}
			if (firstTab === false) {
				child.hide();
			}
			firstTab = false;
			var name = this.getName(child.name, index++);
			bar.names.push(name);
		});
		this.$nextTick(() => {
			bar.select(0);
		});
	}

	protected getName(name: string, index: number): string {
		if (name != null && name !== "") {
			return name;
		}
		return "Tab " + index;
	}

	protected getItem(index: number): TabItem {
		if (index < 0) {
			return null;
		}
		var item: TabItem = null;
		var count = 0;
		var defaultSlot = this.$slots.default;
		defaultSlot.some((node: VNode): boolean => {
			var child = node.componentInstance as TabItem;
			if ((child instanceof TabItem) === false) {
				return;
			}
			if (count == index) {
				item = child;
				return true;
			}
			count++;
			return false;
		});
		return item;
	}

	protected onSelect(index: number): void {
		if (index < 0) {
			return;
		}
		this.select(index);
		var item = this.getItem(index);
		if (item != null) {
			this.$emit("select", item);
		}
	}
}
