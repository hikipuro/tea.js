import * as Tea from "../Tea";

export class AppAudio {
	context: AudioContext;
	protected _app: Tea.App;
	protected _gainNode: GainNode;
	protected _pannerNode: StereoPannerNode;
	protected _isMuted: boolean;
	protected _mutedVolume: number;

	constructor(app: Tea.App) {
		this._app = app;
		this.context = new AudioContext();
		this._gainNode = this.context.createGain();
		this._pannerNode = this.context.createStereoPanner();
		this._gainNode.connect(this._pannerNode);
		this._pannerNode.connect(this.context.destination);
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
		var min = gain.minValue;
		var max = gain.maxValue;
		gain.value = Tea.Mathf.clamp(value, min, max);
	}

	get pan(): number {
		return this._pannerNode.pan.value;
	}
	set pan(value: number) {
		var pan = this._pannerNode.pan;
		var min = pan.minValue;
		var max = pan.maxValue;
		pan.value = Tea.Mathf.clamp(value, min, max);
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
}
