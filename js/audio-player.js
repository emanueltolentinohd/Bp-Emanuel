/**
 * MOTOR DE ÁUDIO SACRO E NARRADOR BÍBLICO (TTS + SINTETIZADOR AMBIENTE)
 * Plataforma Bp. Emanuel
 */

class AudioAmbienceEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.gainNodes = [];
    this.masterGain = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleAmbience() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  play() {
    this.init();
    this.stop(); // Garante limpeza anterior

    const ctx = this.audioCtx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
    this.masterGain.connect(ctx.destination);

    // Frequências suaves para atmosfera de oração/meditação (Acorde Fá Maior com 9ª etéreo)
    const frequencies = [87.31, 130.81, 174.61, 261.63, 329.63, 392.00];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Leve desafinação analógica para calor acústico
      osc.detune.setValueAtTime((idx - 2.5) * 4, ctx.currentTime);

      // Filtro passa-baixa aveludado
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + (idx * 60), ctx.currentTime);

      gain.gain.setValueAtTime(0.025 / frequencies.length, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });

    this.isPlaying = true;
  }

  stop() {
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        this.oscillators = [];
        this.gainNodes = [];
        this.isPlaying = false;
      }, 1200);
    } else {
      this.isPlaying = false;
    }
  }
}

class BibleSpeechNarrator {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.isNarrating = false;
    this.rate = 1.0;
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }

  speak(text, onStart, onEnd) {
    if (!this.isSupported()) {
      alert("Seu navegador não suporta narração por voz (SpeechSynthesis).");
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = this.rate;
    utterance.pitch = 1.0;

    // Tenta encontrar uma voz em português brasileiro natural
    const voices = this.synth.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR') || v.lang.startsWith('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      this.isNarrating = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isNarrating = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isNarrating = false;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isNarrating = false;
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }
}

const audioAmbience = new AudioAmbienceEngine();
const bibleSpeech = new BibleSpeechNarrator();
