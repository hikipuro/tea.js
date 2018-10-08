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
			this.$emit("select", this);
		}, 100);
	}
}

@Component({
	template: `
		<transition
			name="fadeout"
			@after-leave="onFadeoutComplete">
			<div
				class="ContextMenu"
				v-if="isVisible"
				:style="{
					left: x + 'px',
					top: y + 'px'
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
		</transition>
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
	state: string;
	items: Array<any>;
	protected _isSelectStart: boolean = false;

	move(x: number, y: number): void {
		if (this._isSelectStart) {
			return;
		}
		this.x = x;
		this.y = y;
	}

	show(state: string = null): void {
		if (this._isSelectStart) {
			return;
		}
		this.state = state;
		this.isVisible = true;
		this.$nextTick(() => {
			var screenWidth = document.body.clientWidth;
			var screenHeight = document.body.clientHeight;
			var width = this.$el.clientWidth;
			var height = this.$el.clientHeight;
			var xMax = this.x + width;
			var yMax = this.y + height;
			if (xMax > screenWidth) {
				this.x = screenWidth - width;
			}
			if (yMax > screenHeight) {
				this.y = screenHeight - height;
			}
		});
	}

	hide(): void {
		if (this._isSelectStart) {
			return;
		}
		this.isVisible = false;
	}

	protected onBeforeSelect(item: Item): void {
		if (this._isSelectStart) {
			return;
		}
		this._isSelectStart = true;
		this.forEachChild((i) => {
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
		this.forEachChild((item) => {
			item.isUnselected = false;
		});
		this.isVisible = false;
		this.$emit("select", this.state, item);
	}

	protected onFadeoutComplete(): void {
		this._isSelectStart = false;
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
export module ContextMenu {
	export var  Item = _Item;
	export type Item = _Item;
}
