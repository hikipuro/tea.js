import { EventDispatcher } from "./EventDispatcher";

export class SequentialLoader extends EventDispatcher {
	useWait: boolean;
	protected _length: number;
	protected _count: number;
	protected _completeArgs: Array<any>;

	constructor(length: number, ...completeArgs: Array<any>) {
		super();
		this.useWait = false;
		this._length = length;
		this._count = 0;
		this._completeArgs = completeArgs;
	}

	start(): void {
		this._count = 0;
		this.loadNext();
	}

	next(): void {
		if (this.useWait) {
			setTimeout(() => {
				this.loadNext();
			}, 0);
			return;
		}
		this.loadNext();
	}

	protected loadNext(): void {
		var length = this._length;
		var count = this._count++;
		if (count >= length) {
			this.emit("complete", ...this._completeArgs);
			this.removeAllListeners("load");
			this.removeAllListeners("complete");
			return;
		}
		this.emit("load", count, length, this);
	}
}
