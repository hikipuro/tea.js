import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div
			class="item"
			ref="item"
			:class="{
				separator: isSeparator,
				selected: isSelected,
				'selected-after': isSelectedAfter,
				unselected: isUnselected
			}"
			@click.stop="onClick">
			{{ isSeparator ? "" : model.text }}
		</div>
	`,
	props: {
		model: Object,
		depth: Number
	},
	data: () => { return {
		isSelected: false,
		isSelectedAfter: false,
		isUnselected: false
	}}
})
export class Item extends Vue {
	model: any;
	tag: any;
	protected isSelected: boolean;
	protected isSelectedAfter: boolean;
	isUnselected: boolean;

	get text(): string {
		return this.model.text;
	}

	get isSeparator(): boolean {
		return this.model.text === "-";
	}

	protected onClick(): void {
		if (this.isSeparator) {
			return;
		}
		this.$emit("beforeSelect", this);
		this.isSelected = true;
		setTimeout(() => {
			this.isSelected = false;
			this.isSelectedAfter = true;
		}, 50);
		setTimeout(() => {
			this.isSelectedAfter = false;
		}, 100);
		setTimeout(() => {
			this.$emit("select", this);
		}, 150);
	}
}

@Component({
	template: `
		<div
			class="ContextMenu"
			:style="{
				left: x + 'px',
				top: y + 'px',
				display: isVisible ? 'block' : 'none'
			}">
			<item
				v-for="(model, index) in items"
				:key="index"
				:model="model"
				:depth="0"
				@beforeSelect="onBeforeSelect"
				@select="onSelect">
			</item>
		</div>
	`,
	data: () => { return {
		x: 0,
		y: 0,
		isVisible: false,
		items: []
	}},
	components: {
		item: Item
	}
})
export class ContextMenu extends Vue {
	x: number;
	y: number;
	isVisible: boolean;
	items: Array<any>;
	protected _isSelectStart: boolean = false;

	move(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	show(): void {
		this.isVisible = true;
	}

	hide(): void {
		this.isVisible = false;
	}

	protected onClick(): void {
		console.log("onClick", this);
	}

	protected onBeforeSelect(item: Item): void {
		if (this._isSelectStart) {
			return;
		}
		this._isSelectStart = true;
		this.forEachChildren((i) => {
			if (i == item) {
				return;
			}
			i.isUnselected = true;
		});
	}

	protected onSelect(item: Item): void {
		if (this._isSelectStart === false) {
			return;
		}
		this.hide();
		this._isSelectStart = false;
		this.forEachChildren((item) => {
			item.isUnselected = false;
		});
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
