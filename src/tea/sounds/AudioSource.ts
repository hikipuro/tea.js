import * as Tea from "../Tea";
import { Component } from "../components/Component";

export class AudioSource extends Component {
	static editorView = Tea.Editor.AudioSource;
	clip: Tea.AudioClip;
	protected _audio: Tea.AppAudio;
	protected _gainNode: GainNode;
	protected _sourceNode: AudioBufferSourceNode;
	protected _startTime: number;
	protected _pausedTime: number;
	protected _isPlaying: boolean;
	protected _isPaused: boolean;

	constructor(app: Tea.App) {
		super(app);
		this._audio = app.audio;
		this.clip = null;
		this._gainNode = this._audio.context.createGain();
		this._gainNode.connect(this._audio.destination);
		this._sourceNode = null;
		this._startTime = 0.0;
		this._pausedTime = 0.0;
		this._isPlaying = false;
		this._isPaused = false;
	}

	get time(): number {
		if (this._sourceNode == null) {
			return 0.0;
		}
		return this._audio.currentTime - this._startTime;
	}

	get volume(): number {
		return this._gainNode.gain.value;
	}
	set volume(value: number) {
		var gain = this._gainNode.gain;
		gain.value = Tea.Mathf.clamp01(value);
	}

	destroy(): void {
		if (this.clip != null) {
			this.clip.destroy();
			this.clip = undefined;
		}
		if (this._gainNode != null) {
			this._gainNode.disconnect();
			this._gainNode = undefined;
		}
		if (this._sourceNode != null) {
			this._sourceNode.disconnect();
			this._sourceNode = undefined;
		}
		this._audio = undefined;
	}
	
	play(delay: number = 0.0): void {
		if (this.isPlayable() === false) {
			return;
		}
		this._startTime = this._audio.currentTime;
		this._pausedTime = 0.0;
		this._sourceNode = this.createSourceNode(this.clip.buffer);
		if (this._sourceNode != null) {
			this._sourceNode.addEventListener(
				"ended", this.onEnded
			);
			this._sourceNode.start(delay);
		}
	}

	stop(): void {
		if (this._sourceNode == null) {
			return;
		}
		this._sourceNode.disconnect();
		this._sourceNode.stop(0.0);
		this.onEnded(null);
	}

	pause(): void {
		if (this._sourceNode == null) {
			return;
		}
		this._isPaused = true;
		this._pausedTime = this._audio.currentTime - this._startTime;
		this._sourceNode.disconnect();
		this._sourceNode.stop(0.0);
		this.onEnded(null);
	}

	unPause(): void {
		if (this._isPaused === false) {
			this.play();
			return;
		}
		if (this.isPlayable() === false) {
			return;
		}
		this._isPaused = false;
		this._startTime = this._audio.currentTime - this._pausedTime;
		this._sourceNode = this.createSourceNode(this.clip.buffer);
		if (this._sourceNode != null) {
			this._sourceNode.addEventListener(
				"ended", this.onEnded
			);
			this._sourceNode.start(0.0, this._pausedTime);
		}
	}

	protected isPlayable(): boolean {
		if (this.clip == null) {
			return false;
		}
		return true;
	}

	protected createSourceNode(buffer: AudioBuffer): AudioBufferSourceNode {
		if (buffer == null) {
			return;
		}
		var sourceNode = this._audio.createBufferSource();
		sourceNode.buffer = buffer;
		sourceNode.connect(this._gainNode);
		return sourceNode;
	}

	protected onEnded = (e: Event): any => {
		if (this._sourceNode == null) {
			return;
		}
		this._sourceNode.removeEventListener("ended", this.onEnded);
		this._sourceNode.disconnect();
		this._sourceNode = null;
	}
}
