import Vue from "vue";
import Component from "vue-class-component";
import { ContextMenuItem } from "./ContextMenuItem";

export class Model {
	text: string;
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
				<ContextMenuItem
					v-for="(model, index) in items"
					:key="index"
					:model="model"
					:depth="0"
					@beforeSelect="onBeforeSelect"
					@select="onSelect">
				</ContextMenuItem>
			</div>
		</transition>
	`,
	data: () => {
		return {
			x: 0,
			y: 0,
			isVisible: false,
			items: []
		}
	},
	components: {
		ContextMenuItem: ContextMenuItem
	}
})
export class ContextMenu extends Vue {
	x: number;
	y: number;
	isVisible: boolean;
	state: string;
	items: Array<Model>;
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

	protected onBeforeSelect(item: ContextMenuItem): void {
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

	protected onSelect(item: ContextMenuItem): void {
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

	protected forEachChild(callback: (item: ContextMenuItem) => void) {
		var forEach = (item: ContextMenuItem) => {
			callback(item);
			item.$children.forEach((item: ContextMenuItem) => {
				forEach(item);
			});
		};
		this.$children.forEach((item: ContextMenuItem) => {
			forEach(item);
		});
	}
}

var  _Model = Model;
type _Model = Model;

export module ContextMenu {
	export var  Model = _Model;
	export type Model = _Model;
}
