import * as Tea from "../Tea";

export class AudioClip {
	buffer: AudioBuffer;
	protected _audio: Tea.AppAudio;

	constructor(app: Tea.App) {
		this._audio = app.audio;
		this.buffer = null;
	}

	get channels(): number {
		if (this.buffer == null) {
			return 0;
		}
		return this.buffer.numberOfChannels;
	}

	get frequency(): number {
		if (this.buffer == null) {
			return 0;
		}
		return this.buffer.sampleRate;
	}

	get length(): number {
		if (this.buffer == null) {
			return 0;
		}
		return this.buffer.duration;
	}

	get samples(): number {
		if (this.buffer == null) {
			return 0;
		}
		return this.buffer.length;
	}

	destroy(): void {
	}

	load(url: string, callback: (err: any) => void): void {
		Tea.File.readArrayBuffer(url, (err, data) => {
			if (err) {
				callback(err);
				return;
			}
			this._audio.decodeAudioData(data, (err, data) => {
				if (err) {
					callback(err);
					return;
				}
				this.buffer = data;
				callback(null);
			});
		});
	}

	getData(channel: number): Float32Array {
		if (this.buffer == null) {
			return null;
		}
		return this.buffer.getChannelData(channel);
	}
}
