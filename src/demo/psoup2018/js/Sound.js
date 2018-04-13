/**
  // Example
  var AC = new AudioContext();

  function playSound(context, frequency, seconds, type) {
    var sound = new Sound(context);
    sound.play(frequency, seconds, type);
  }
*/

class Sound {
  constructor(context) {
    this.context = context;
  }

  init() {
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
  }

  play(frequency, seconds = 1, type = 'sine') {
    this.init();

    this.oscillator.type = type;
    this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);
            
    this.oscillator.start(this.context.currentTime);
    this.stop(seconds);
  }

  stop(seconds = 1) {
    this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + seconds);
    this.oscillator.stop(this.context.currentTime + seconds + .01);
  }
}