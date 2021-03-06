import * as Tea from "../Tea";

declare global {
	interface Window {
		AudioContext: any;
		webkitAudioContext: any;
	}
}

export class AppAudio {
	context: AudioContext;
	protected _app: Tea.App;
	protected _gainNode: GainNode;
	protected _pannerNode: StereoPannerNode;
	protected _isMuted: boolean;
	protected _mutedVolume: number;

	constructor(app: Tea.App) {
		this._app = app;
		var audioContext = window.AudioContext || window.webkitAudioContext;
		this.context = new audioContext();
		this._gainNode = this.context.createGain();
		this._pannerNode = this.createStereoPanner();
		if (this._pannerNode != null) {
			this._gainNode.connect(this._pannerNode);
			this._pannerNode.connect(this.context.destination);
		} else {
			this._gainNode.connect(this.context.destination);
		}
		this._isMuted = false;
		this._mutedVolume = 0.0;
		app.renderer.on("pause", () => {
			this.isMuted = true;
		})
		app.renderer.on("resume", () => {
			this.isMuted = false;
		})
	}

	get destination(): AudioNode {
		return this._gainNode;
	}

	get isMuted(): boolean {
		return this._isMuted;
	}
	set isMuted(value: boolean) {
		if (this._isMuted === value) {
			return;
		}
		this._isMuted = value;
		if (value) {
			this._mutedVolume = this.volume;
			this.volume = 0.0;
		} else {
			this.volume = this._mutedVolume;
		}
	}

	get volume(): number {
		return this._gainNode.gain.value;
	}
	set volume(value: number) {
		var gain = this._gainNode.gain;
		gain.value = Tea.Mathf.clamp01(value);
	}

	get pan(): number {
		if (this._pannerNode == null) {
			return 0;
		}
		return this._pannerNode.pan.value;
	}
	set pan(value: number) {
		if (this._pannerNode == null) {
			return;
		}
		var pan = this._pannerNode.pan;
		pan.value = Tea.Mathf.clamp01(value);
	}

	get currentTime(): number {
		return this.context.currentTime;
	}

	play(buffer: AudioBuffer, delay: number, offset: number = 0.0, playbackRate: number = 1.0): AudioBufferSourceNode {
		if (buffer == null) {
			return null;
		}
		if (this._app.isPaused) {
			return null;
		}
		var sourceNode = this.context.createBufferSource();
		sourceNode.buffer = buffer;
		sourceNode.playbackRate.value = playbackRate;
		sourceNode.connect(this._gainNode);
		sourceNode.start(delay, offset);
		return sourceNode;
	}

	playNode(sourceNode: AudioBufferSourceNode, delay: number, offset: number = 0.0): void {
		if (sourceNode == null) {
			return;
		}
		if (this._app.isPaused) {
			return;
		}
		sourceNode.connect(this._gainNode);
		sourceNode.start(delay, offset);
	}

	createBufferSource(): AudioBufferSourceNode {
		return this.context.createBufferSource();
	}

	decodeAudioData(audioData: ArrayBuffer, callback: (err: any, data: AudioBuffer) => void) {
		this.context.decodeAudioData(
			audioData,
			(decodedData: AudioBuffer) => {
				callback(null, decodedData);
			},
			(error: DOMException) => {
				console.error(error);
				callback(error, null);
			}
		);
	}

	protected createStereoPanner(): StereoPannerNode {
		if (this.context.createStereoPanner == null) {
			return null;
		}
		return this.context.createStereoPanner();
	}
}
