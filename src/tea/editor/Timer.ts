export class Timer {
	interval: number;
	handle: any;
	snoozeHandle: any;
	onUpdate: () => void;

	constructor(interval: number = 100) {
		this.interval = interval;
		this.handle = null;
		this.snoozeHandle = null;
	}

	start(): void {
		if (this.handle != null) {
			this.stop();
		}
		this.handle = setInterval(
			this.onUpdate, this.interval
		);
	}

	stop(): void {
		if (this.handle == null) {
			return;
		}
		if (this.snoozeHandle != null) {
			clearTimeout(this.snoozeHandle);
			this.snoozeHandle = null;
		}
		clearInterval(this.handle);
		this.handle = null;
	}

	snooze(wait: number): void {
		if (this.handle == null) {
			if (this.snoozeHandle != null) {
				clearTimeout(this.snoozeHandle);
				this.snoozeHandle = setTimeout(() => {
					this.snoozeHandle = null;
					this.start();
				}, wait);
			}
			return;
		}
		clearInterval(this.handle);
		this.handle = null;
		this.snoozeHandle = setTimeout(() => {
			this.snoozeHandle = null;
			this.start();
		}, wait);
	}
}
