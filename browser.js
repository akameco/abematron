'use strict';
const electron = require('electron');
const ipc = electron.ipcRenderer;

class Audio {
	constructor() {
		const audioContext = new window.AudioContext();
		this._gainNode = audioContext.createGain();
		this._gainNode.connect(audioContext.destination);
		this._gainNode.gain.value = 1.0;
	}

	get volume() {
		return this._gainNode.gain.value * 100;
	}

	set volume(value) {
		if (value >= 0 && value <= 100) {
			this._gainNode.gain.value = (value / 100);
		}
	}

	volumeUp() {
		this.volume += 10;
	}

	volumeDown() {
		this.volume -= 10;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const audio = new Audio();

	ipc.on('volume-up', () => {
		audio.volumeUp();
	});

	ipc.on('volume-down', () => {
		audio.volumeDown();
	});
});

