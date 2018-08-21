type EventListener = {
	(...args: any[]): void;
}

class EventListenerItem {
	listener: EventListener;
	isOnce: boolean;

	constructor(listener: EventListener, isOnce: boolean) {
		this.listener = listener;
		this.isOnce = isOnce;
	}
}

export class EventDispatcher {
	static readonly defaultMaxListeners: number = 10;
	protected _listeners: {[key: string]: Array<EventListenerItem>};
	protected _maxListeners: number;

	constructor() {
		this._listeners = {};
		this._maxListeners = EventDispatcher.defaultMaxListeners;
	}

	getMaxListeners(): number {
		return this._maxListeners;
	}

	setMaxListeners(n: number): EventDispatcher {
		this._maxListeners = n;
		return this;
	}

	on(eventName: string, listener: EventListener): EventDispatcher {
		if (listener == null) {
			return this;
		}
		if (this.hasName(eventName) === false) {
			this._listeners[eventName] = [];
		}
		if (this.isValidListenerCount(eventName) === false) {
			this.printMaxListenerWarning();
			return this;
		}
		var item = new EventListenerItem(listener, false);
		this._listeners[eventName].push(item);
		return this;
	}

	once(eventName: string, listener: EventListener): EventDispatcher {
		if (listener == null) {
			return this;
		}
		if (this.hasName(eventName) === false) {
			this._listeners[eventName] = [];
		}
		if (this.isValidListenerCount(eventName) === false) {
			this.printMaxListenerWarning();
			return this;
		}
		var item = new EventListenerItem(listener, true);
		this._listeners[eventName].push(item);
		return this;
	}

	emit(eventName: string, ...args: any[]): boolean {
		if (this.hasName(eventName) === false) {
			return false;
		}
		var listeners = this._listeners[eventName];
		if (listeners.length <= 0) {
			return false;
		}
		var methods: Array<EventListener> = [];
		for (var i = listeners.length - 1; i >= 0; i--) {
			var item = listeners[i];
			methods.push(item.listener);
			if (item.isOnce) {
				listeners.splice(i, 1);
			}
		}
		if (listeners.length <= 0) {
			delete this._listeners[eventName];
		}
		for (var i = methods.length - 1; i >= 0; i--) {
			var listener = methods[i];
			listener.apply(listener, args);
		}
		return true;
	}

	off(eventName: string, listener: EventListener): EventDispatcher {
		if (this.hasName(eventName) === false) {
			return this;
		}
		var listeners = this._listeners[eventName];
		for (var i = listeners.length - 1; i >= 0; i--) {
			var item = listeners[i];
			if (item.listener === listener) {
				listeners.splice(i, 1);
			}
		}
		if (listeners.length <= 0) {
			delete this._listeners[eventName];
		}
		return this;
	}

	prependListener(eventName: string, listener: EventListener): EventDispatcher {
		if (listener == null) {
			return this;
		}
		if (this.hasName(eventName) === false) {
			this._listeners[eventName] = [];
		}
		if (this.isValidListenerCount(eventName) === false) {
			this.printMaxListenerWarning();
			return this;
		}
		var item = new EventListenerItem(listener, false);
		this._listeners[eventName].unshift(item);
		return this;
	}

	prependOnceListener(eventName: string, listener: EventListener): EventDispatcher {
		if (listener == null) {
			return this;
		}
		if (this.hasName(eventName) === false) {
			this._listeners[eventName] = [];
		}
		if (this.isValidListenerCount(eventName) === false) {
			this.printMaxListenerWarning();
			return this;
		}
		var item = new EventListenerItem(listener, true);
		this._listeners[eventName].unshift(item);
		return this;
	}

	addListener(eventName: string, listener: EventListener): EventDispatcher {
		return this.on(eventName, listener);
	}

	removeListener(eventName: string, listener: EventListener): EventDispatcher {
		return this.off(eventName, listener);
	}

	removeAllListeners(eventName: string): EventDispatcher {
		if (this.hasName(eventName) === false) {
			return this;
		}
		delete this._listeners[eventName];
		return this;
	}

	eventNames(): Array<string> {
		return Object.keys(this._listeners);
	}

	listenerCount(eventName: string): number {
		if (this.hasName(eventName) === false) {
			return 0;
		}
		return this._listeners[eventName].length;
	}

	listeners(eventName: string): Array<Function> {
		if (this.hasName(eventName) === false) {
			return [];
		}
		var methods: Array<EventListener> = [];
		var listeners = this._listeners[eventName];
		for (var i = listeners.length - 1; i >= 0; i--) {
			var item = listeners[i];
			methods.push(item.listener);
		}
		return methods;
	}

	protected hasName(eventName: string): boolean {
		if (eventName == null || eventName === "") {
			return false;
		}
		return this._listeners.hasOwnProperty(eventName);
	}

	protected isValidListenerCount(eventName: string): boolean {
		if (this._maxListeners <= 0) {
			return true;
		}
		var listeners = this._listeners[eventName];
		return listeners.length < this._maxListeners;
	}

	protected printMaxListenerWarning(): void {
		console.warn("Maximum listener count of " + this._maxListeners + " has been exceeded.");
	}
}
