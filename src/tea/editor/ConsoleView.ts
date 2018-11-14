import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="item" :class="model.type">
			<div class="icon">{{ getIcon(model.type) }}</div>
			<div class="time">[{{ model.time }}]</div>
			<div class="toggle" v-html="getToggleIcon()" @click="onClickOpen"></div>
			<div class="message">
				<div class="text">{{ model.text }}</div>
				<div class="stack" v-if="isOpen">{{ model.stack }}</div>
			</div>
		</div>
	`,
	props: {
		model: {
			type: Object,
			default: null
		}
	},
	data: () => {
		return {
			isOpen: false,
			openIcon: "<img src='images/folder-open.svg' />",
			closeIcon: "<img src='images/folder-close.svg' />"
		}
	}
})
export class Item extends Vue {
	isOpen: boolean;
	openIcon: string;
	closeIcon: string;

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

	getToggleIcon(): string {
		if (this.isOpen) {
			return this.openIcon;
		}
		return this.closeIcon;
	}

	protected onClickOpen(): void {
		this.isOpen = !this.isOpen;
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
			var el = this.$el.parentElement;
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
			var el = this.$el.parentElement;
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
			var el = this.$el.parentElement;
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
			var el = this.$el.parentElement;
			el.scrollTop = el.scrollHeight;
		});
	}

	clear(): void {
		this.items.splice(0, this.items.length);
	}

	protected createItem(type: string, message: any, optionalParams: any[]): any {
		return {
			type: type,
			time: this.getTime(),
			text: this.getText(message, optionalParams),
			stack: this.getCallStack()
			//location: this.getLocation(optionalParams[0], optionalParams[1])
		};
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

	protected getText(message: any, ...optionalParams: any[]): string {
		var text = "";
		try {
			text += `${message}`;
		} catch (err) {
		}
		var length = optionalParams.length;
		for (var i = 0; i < length; i++) {
			var param = optionalParams[i];
			try {
				text += `\t${param}`;
			} catch (err) {
			}
		}
		return text;
	}

	protected getCallStack(): string {
		var text = "";
		var callStack = new Error().stack;
		if (callStack == null || callStack === "") {
			return text;
		}
		var stacks = callStack.split("\n");
		var outputFlag = false;
		var regex = /^\s+at console[.].+[.]optionalParams/;
		var length = stacks.length;
		for (var i = 0; i < length; i++) {
			var stack = stacks[i];
			if (outputFlag) {
				if (text != "") {
					text += "\n";
				}
				text += stack;
				continue;
			}
			if (stack.match(regex)) {
				outputFlag = true;
			}
		}
		return text;
	}

	protected getLocation(line: number, sourceId: string): string {
		return sourceId + ":" + line;
	}
}
