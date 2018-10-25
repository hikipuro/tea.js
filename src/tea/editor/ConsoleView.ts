import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="item" :class="model.type">
			<div class="icon">{{ getIcon(model.type) }}</div>
			<div class="time">[{{ model.time }}]</div>
			<div class="text">{{ model.text }}</div>
		</div>
	`,
	props: {
		model: {
			type: Object,
			default: null
		}
	}
})
export class Item extends Vue {
	getIcon(type: string): string {
		switch (type) {
			case "log":
				return "💬";
			case "info":
				return "ℹ️";
			case "warn":
				return "⚠️";
			case "error":
				return "🚫";
		}
		return "";
	}
}

@Component({
	template: `
		<div class="ConsoleView">
			<item
				v-for="(i, index) in items"
				:key="index"
				:model="i"></item>
		</div>
	`,
	data: () => {
		return {
			items: []
		}
	},
	components: {
		item: Item
	}
})
export class ConsoleView extends Vue {
	maxCount: number = 1000;
	items: Array<any>;

	log(message: any, ...optionalParams: any[]): void {
		var item = this.createItem("log", message, optionalParams);
		this.items.push(item);
		if (this.items.length > this.maxCount) {
			this.items.shift();
		}
		this.$nextTick(() => {
			var el = this.$el;
			el.scrollTop = el.scrollHeight;
		});
	}

	info(message: any, ...optionalParams: any[]): void {
		var item = this.createItem("info", message, optionalParams);
		this.items.push(item);
		if (this.items.length > this.maxCount) {
			this.items.shift();
		}
		this.$nextTick(() => {
			var el = this.$el;
			el.scrollTop = el.scrollHeight;
		});
	}

	warn(message: any, ...optionalParams: any[]): void {
		var item = this.createItem("warn", message, optionalParams);
		this.items.push(item);
		if (this.items.length > this.maxCount) {
			this.items.shift();
		}
		this.$nextTick(() => {
			var el = this.$el;
			el.scrollTop = el.scrollHeight;
		});
	}

	error(message: any, ...optionalParams: any[]): void {
		var item = this.createItem("error", message, optionalParams);
		this.items.push(item);
		if (this.items.length > this.maxCount) {
			this.items.shift();
		}
		this.$nextTick(() => {
			var el = this.$el;
			el.scrollTop = el.scrollHeight;
		});
	}

	clear(): void {
		this.items.splice(0, this.items.length);
	}

	protected createItem(type: string, message: any, ...optionalParams: any[]): any {
		return {
			type: type,
			time: this.getTime(),
			text: this.getText(message, optionalParams)
		};
	}

	protected getText(message: any, ...optionalParams: any[]): string {
		var text = `${message}`;
		var length = optionalParams.length;
		for (var i = 0; i < length; i++) {
			var param = optionalParams[i];
			text += `\t${param}`;
		}
		return text;
	}

	protected getTime(): string {
		var date = new Date();
		return date.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "numeric",
			minute: "numeric",
			second: "numeric"
		});
	}
}
