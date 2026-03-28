export class AudioEngine {
	private ctx: AudioContext | null = null;
	private nodes: Map<string, { source: AudioBufferSourceNode, gain: GainNode }> = new Map();

	private init() {
		if (!this.ctx) {
			const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			this.ctx = new AudioContextClass();
		}
	}

	private createNoiseBuffer(type: 'white' | 'pink' | 'brown') {
		this.init();
		const bufferSize = (this.ctx as AudioContext).sampleRate * 2;
		const buffer = (this.ctx as AudioContext).createBuffer(1, bufferSize, (this.ctx as AudioContext).sampleRate);
		const output = buffer.getChannelData(0);
		let lastOut = 0.0;

		for (let i = 0; i < bufferSize; i++) {
			const white = Math.random() * 2 - 1;
			if (type === 'white') {
				output[i] = white;
			} else if (type === 'pink') {
				output[i] = (lastOut + (0.02 * white)) / 1.02;
				lastOut = output[i];
				output[i] *= 3.5;
			} else if (type === 'brown') {
				output[i] = (lastOut + (0.01 * white)) / 1.01;
				lastOut = output[i];
				output[i] *= 4.0;
			}
		}
		return buffer;
	}

	public setVolume(id: string, volume: number) {
		this.init();
		if (!this.ctx) return;

		if (volume === 0) {
			this.stop(id);
			return;
		}

		if (!this.nodes.has(id)) {
			this.play(id);
		}

		const node = this.nodes.get(id);
		if (node) {
			node.gain.gain.setTargetAtTime(volume / 100, this.ctx.currentTime, 0.1);
		}
	}

	public async toggleMaster() {
		this.init();
		if (!this.ctx) return;
		if (this.ctx.state === 'running') {
			await this.ctx.suspend();
		} else {
			await this.ctx.resume();
		}
	}

	public get isMuted() {
		return this.ctx?.state !== 'running';
	}

	private play(id: string) {
		this.init();
		if (!this.ctx || this.nodes.has(id)) return;

		const source = this.ctx.createBufferSource();
		const gain = this.ctx.createGain();
		
		let buffer: AudioBuffer;
		let filter: BiquadFilterNode | null = null;

		if (id === 'rain') {
			buffer = this.createNoiseBuffer('pink');
			filter = this.ctx.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.value = 1200;
		} else if (id === 'forest') {
			buffer = this.createNoiseBuffer('brown');
			filter = this.ctx.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.value = 400;
		} else if (id === 'white') {
			buffer = this.createNoiseBuffer('white');
		} else if (id === 'cafe') {
			// Cafe is pink noise with a low rumble and "chatter" frequency
			buffer = this.createNoiseBuffer('pink');
			filter = this.ctx.createBiquadFilter();
			filter.type = 'bandpass';
			filter.frequency.value = 800;
			filter.Q.value = 0.5;
		} else {
			buffer = this.createNoiseBuffer('white');
		}

		source.buffer = buffer;
		source.loop = true;
		
		if (filter) {
			source.connect(filter);
			filter.connect(gain);
		} else {
			source.connect(gain);
		}
		
		gain.connect(this.ctx.destination);
		gain.gain.value = 0;
		source.start();

		this.nodes.set(id, { source, gain });
	}

	private stop(id: string) {
		const node = this.nodes.get(id);
		if (node) {
			node.source.stop();
			node.source.disconnect();
			this.nodes.delete(id);
		}
	}
}

export const audioEngine = new AudioEngine();
