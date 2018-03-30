/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {MobileNet} from './mobilenet';
import {camera, VIDEO_PIXELS} from './camera';
import {VIEWS, ui, GAME_STRINGS} from './ui';
import {share} from './share';
import {getQueryParam} from './utils';
import {shuffle} from 'lodash';
import * as tfc from '@tensorflow/tfjs-core';

export const GAME_START_TIME = 20;
export const GAME_EXTEND_TIME = 10;
export const GAME_MAX_ITEMS = 10;
const SPEAKING_DELAY = 2500; // 2.5 seconds
const GAME_TIMER_DELAY = 1000; // 1 second

export interface EmojiItem {
  [index: string]: string;
}

export interface EmojiLevelsLookup {
  [index: string]: Array<EmojiItem>;
}

interface CameraDimentions {
  [index: number]: number;
}

const EMOJIS_LVL_1: Array<EmojiItem> = [
  {
    'name': 'hand',
    'emoji': '✋',
    'path': '/img/emojis/game/hand.svg'
  },
  {
    'name': 'mouse',
    'emoji': '🖱',
    'path': '/img/emojis/game/mouse.svg'
  },
  {
    'name': 'plug',
    'emoji': '🔌',
    'path': '/img/emojis/game/plug.svg'
  },
  {
    'name': 'light bulb',
    'emoji': '💡',
    'path': '/img/emojis/game/light bulb.svg'
  },
  {
    'name': 'book',
    'emoji': '📚',
    'path': '/img/emojis/game/book.svg'
  },
  {
    'name': 'cellphone',
    'emoji': '📱',
    'path': '/img/emojis/game/cellphone.svg'
  },
  {
    'name': 'keyboard',
    'emoji': '⌨️',
    'path': '/img/emojis/game/keyboard.svg'
  },
  {
    'name': 'tv',
    'emoji': '📺',
    'path': '/img/emojis/game/tv.svg'
  },
  {
    'name': 'laptop',
    'emoji': '💻',
    'path': '/img/emojis/game/laptop.svg'
  },
  {
    'name': 'shirt',
    'emoji': '👕',
    'path': '/img/emojis/game/shirt.svg'
  },
  {
    'name': 'pants',
    'emoji': '👖',
    'path': '/img/emojis/game/pants.svg'
  },
  {
    'name': 'shoe',
    'emoji': '👞',
    'path': '/img/emojis/game/shoe.svg'
  }
];

const EMOJIS_LVL_2: Array<EmojiItem> = [
  {
    'name': 'key',
    'emoji': '🔑',
    'path': '/img/emojis/game/key.svg'
  },
  {
    'name': 'newspaper',
    'emoji': '📰',
    'path': '/img/emojis/game/newspaper.svg'
  },
  {
    'name': 'plate',
    'emoji': '🍽',
    'path': '/img/emojis/game/plate.svg'
  },
  {
    'name': 'sock',
    'emoji': '🧦',
    'path': '/img/emojis/game/sock.svg'
  },
  {
    'name': 'coat',
    'emoji': '🧥',
    'path': '/img/emojis/game/coat.svg'
  },
  {
    'name': 'wallet',
    'emoji': '👛',
    'path': '/img/emojis/game/wallet.svg'
  },
  {
    'name': 'bed',
    'emoji': '🛏',
    'path': '/img/emojis/game/bed.svg'
  },
  {
    'name': 'cup',
    'emoji': '☕',
    'path': '/img/emojis/game/cup.svg'
  },
  {
    'name': 'watch',
    'emoji': '⌚',
    'path': '/img/emojis/game/watch.svg'
  },
  {
    'name': 'trash can',
    'emoji': '🗑',
    'path': '/img/emojis/game/trash can.svg'
  },
  {
    'name': 'envelope',
    'emoji': '✉️',
    'path': '/img/emojis/game/envelope.svg'
  },
  {
    'name': 'sunglasses',
    'emoji': '🕶',
    'path': '/img/emojis/game/sunglasses.svg'
  },
  {
    'name': 'toilet',
    'emoji': '🚽',
    'path': '/img/emojis/game/toilet.svg'
  },
  {
    'name': 'clock',
    'emoji': '🕑',
    'path': '/img/emojis/game/clock.svg'
  },
  {
    'name': 'hat',
    'emoji': '🧢',
    'path': '/img/emojis/game/hat.svg'
  },
  {
    'name': 'backpack',
    'emoji': '🎒',
    'path': '/img/emojis/game/backpack.svg'
  },
  {
    'name': 'headphones',
    'emoji': '🎧',
    'path': '/img/emojis/game/headphones.svg'
  },
  {
    'name': 'display',
    'emoji': '🖥',
    'path': '/img/emojis/game/display.svg'
  },
  {
    'name': 'spoon',
    'emoji': '🥄',
    'path': '/img/emojis/game/spoon.svg'
  },
  {
    'name': 'bowl',
    'emoji': '🥣',
    'path': '/img/emojis/game/bowl.svg'
  }
];

const EMOJIS_LVL_3: Array<EmojiItem> = [
  {
    'name': 'scarf',
    'emoji': '🧣',
    'path': '/img/emojis/game/scarf.svg'
  },
  {
    'name': 'scissors',
    'emoji': '✂️',
    'path': '/img/emojis/game/scissors.svg'
  },
  {
    'name': 'cabinet',
    'emoji': '🗄',
    'path': '/img/emojis/game/cabinet.svg'
  },
  {
    'name': 'tree',
    'emoji': '🌲',
    'path': '/img/emojis/game/tree.svg'
  },
  {
    'name': 'beer',
    'emoji': '🍺',
    'path': '/img/emojis/game/beer.svg'
  },
  {
    'name': 'sofa',
    'emoji': '🛋',
    'path': '/img/emojis/game/sofa.svg'
  },
  {
    'name': 'house',
    'emoji': '🏠',
    'path': '/img/emojis/game/house.svg'
  },
  {
    'name': 'building',
    'emoji': '🏢',
    'path': '/img/emojis/game/building.svg'
  },
  {
    'name': 'bicycle',
    'emoji': '🚲',
    'path': '/img/emojis/game/bicycle.svg'
  },
  {
    'name': 'frying pan',
    'emoji': '🍳',
    'path': '/img/emojis/game/frying pan.svg'
  },
  {
    'name': 'wine',
    'emoji': '🍷',
    'path': '/img/emojis/game/wine.svg'
  },
  {
    'name': 'bread',
    'emoji': '🍞',
    'path': '/img/emojis/game/bread.svg'
  },
  {
    'name': 'printer',
    'emoji': '🖨',
    'path': '/img/emojis/game/printer.svg'
  },
  {
    'name': 'banana',
    'emoji': '🍌',
    'path': '/img/emojis/game/banana.svg'
  },
  {
    'name': 'car',
    'emoji': '🚗',
    'path': '/img/emojis/game/car.svg'
  },
  {
    'name': 'flower',
    'emoji': '🌼',
    'path': '/img/emojis/game/flower.svg'
  },
  {
    'name': 'glove',
    'emoji': '🧤',
    'path': '/img/emojis/game/glove.svg'
  },
  {
    'name': 'umbrella',
    'emoji': '☂️',
    'path': '/img/emojis/game/umbrella.svg'
  },
  {
    'name': 'bathtub',
    'emoji': '🛁',
    'path': '/img/emojis/game/bathtub.svg'
  },
  {
    'name': 'camera',
    'emoji': '📷',
    'path': '/img/emojis/game/camera.svg'
  }
];

const EMOJIS_LVL_4: Array<EmojiItem> = [
  {
    'name': 'cat',
    'emoji': '🐱',
    'path': '/img/emojis/game/cat.svg'
  },
  {
    'name': 'guitar',
    'emoji': '🎸',
    'path': '/img/emojis/game/guitar.svg'
  },
  {
    'name': 'dog',
    'emoji': '🐶',
    'path': '/img/emojis/game/dog.svg'
  },
  {
    'name': 'orange',
    'emoji': '🍊',
    'path': '/img/emojis/game/orange.svg'
  },
  {
    'name': 'strawberry',
    'emoji': '🍓',
    'path': '/img/emojis/game/strawberry.svg'
  },
  {
    'name': 'piano',
    'emoji': '🎹',
    'path': '/img/emojis/game/piano.svg'
  },
  {
    'name': 'hammer',
    'emoji': '🔨',
    'path': '/img/emojis/game/hammer.svg'
  },
  {
    'name': 'microphone',
    'emoji': '🎤',
    'path': '/img/emojis/game/microphone.svg'
  },
  {
    'name': 'broccoli',
    'emoji': '🥦',
    'path': '/img/emojis/game/broccoli.svg'
  },
  {
    'name': 'lipstick',
    'emoji': '💄',
    'path': '/img/emojis/game/lipstick.svg'
  },
  {
    'name': 'lock',
    'emoji': '🔒',
    'path': '/img/emojis/game/lock.svg'
  },
  {
    'name': 'mailbox',
    'emoji': '📪',
    'path': '/img/emojis/game/mailbox.svg'
  },
  {
    'name': 'soccer ball',
    'emoji': '⚽',
    'path': '/img/emojis/game/soccer ball.svg'
  },
  {
    'name': 'mushroom',
    'emoji': '🍄',
    'path': '/img/emojis/game/mushroom.svg'
  },
  {
    'name': 'lemon',
    'emoji': '🍋',
    'path': '/img/emojis/game/lemon.svg'
  },
  {
    'name': 'baseball',
    'emoji': '⚾',
    'path': '/img/emojis/game/baseball.svg'
  },
  {
    'name': 'basketball',
    'emoji': '🏀',
    'path': '/img/emojis/game/basketball.svg'
  },
  {
    'name': 'flashlight',
    'emoji': '🔦',
    'path': '/img/emojis/game/flashlight.svg'
  },
  {
    'name': 'candle',
    'emoji': '🕯',
    'path': '/img/emojis/game/candle.svg'
  },
  {
    'name': 'radio',
    'emoji': '📻',
    'path': '/img/emojis/game/radio.svg'
  }
];

const EMOJIS_LVL_5: Array<EmojiItem> = [
  {
    'name': 'fish',
    'emoji': '🐟',
    'path': '/img/emojis/game/fish.svg'
  },
  {
    'name': 'icecream',
    'emoji': '🍨',
    'path': '/img/emojis/game/icecream.svg'
  },
  {
    'name': 'pizza',
    'emoji': '🍕',
    'path': '/img/emojis/game/pizza.svg'
  },
  {
    'name': 'bird',
    'emoji': '🐦',
    'path': '/img/emojis/game/bird.svg'
  },
  {
    'name': 'cassette',
    'emoji': '📼',
    'path': '/img/emojis/game/cassette.svg'
  },
  {
    'name': 'hamburger',
    'emoji': '🍔',
    'path': '/img/emojis/game/hamburger.svg'
  },
  {
    'name': 'hotdog',
    'emoji': '🌭',
    'path': '/img/emojis/game/hotdog.svg'
  },
  {
    'name': 'fries',
    'emoji': '🍟',
    'path': '/img/emojis/game/fries.svg'
  },
  {
    'name': 'ramen',
    'emoji': '🍜',
    'path': '/img/emojis/game/ramen.svg'
  },
  {
    'name': 'donut',
    'emoji': '🍩',
    'path': '/img/emojis/game/donut.svg'
  },
  {
    'name': 'sushi',
    'emoji': '🍣',
    'path': '/img/emojis/game/sushi.svg'
  },
  {
    'name': 'taco',
    'emoji': '🌮',
    'path': '/img/emojis/game/taco.svg'
  },
  {
    'name': 'burrito',
    'emoji': '🌯',
    'path': '/img/emojis/game/burrito.svg'
  },
  {
    'name': 'traffic light',
    'emoji': '🚦',
    'path': '/img/emojis/game/traffic light.svg'
  },
  {
    'name': 'bus',
    'emoji': '🚎',
    'path': '/img/emojis/game/bus.svg'
  },
  {
    'name': 'truck',
    'emoji': '🚚',
    'path': '/img/emojis/game/truck.svg'
  },
  {
    'name': 'screw',
    'emoji': '🔩',
    'path': '/img/emojis/game/screw.svg'
  },
  {
    'name': 'sax',
    'emoji': '🎷',
    'path': '/img/emojis/game/sax.svg'
  },
  {
    'name': 'baby bottle',
    'emoji': '🍼',
    'path': '/img/emojis/game/baby bottle.svg'
  },
  {
    'name': 'motor scooter',
    'emoji': '🛵',
    'path': '/img/emojis/game/motor scooter.svg'
  },
  {
    'name': 'magnifying glass',
    'emoji': '🔎',
    'path': '/img/emojis/game/magnifying glass.svg'
  },
  {
    'name': 'jack o lantern',
    'emoji': '🎃',
    'path': '/img/emojis/game/jack o lantern.svg'
  }
];

const EMOJIS_LVL_DEMO: Array<EmojiItem> = [
  {
    'name': 'watch',
    'emoji': '⌚',
    'path': '/img/emojis/game/watch.svg'
  },
  {
    'name': 'shoe',
    'emoji': '👞',
    'path': '/img/emojis/game/shoe.svg'
  },
  {
    'name': 'banana',
    'emoji': '🍌',
    'path': '/img/emojis/game/banana.svg'
  },
  {
    'name': 'beer',
    'emoji': '🍺',
    'path': '/img/emojis/game/beer.svg'
  },
  {
    'name': 'jack o lantern',
    'emoji': '🎃',
    'path': '/img/emojis/game/jack o lantern.svg'
  }
];

export interface Sleuths {
  [index: string]: string;
}

export interface SleuthVoices {
  [index: string]: SpeechSynthesisVoice|null;
}

const SLEUTHS: Array<Sleuths> = [
  {
    'nonGoogleVoice': 'Samantha',
    'googleVoice': 'Google US English',
    'emoji': '/img/emojis/ui/sleuth.svg',
  }
];

export interface AudioSources {
  [index: string]: HTMLAudioElement;
}

export const AUDIO = {
  GAME_LOOP: 'gameloop',
  TIME_RUNNING_LOW: 'timerunningout',
  COUNTDOWN: 'countdown',
  FAIL: 'fail',
  FOUND_IT: 'foundit',
  WIN: 'win',
  END: 'endofgame',
  TIMER_INCREASE: 'timerincrease'
};

export class Game {

  emojiScavengerMobileNet: MobileNet;
  isRunning: boolean;
  cameraPaused: boolean;
  score: number;
  timer: number;
  timerAtStartOfRound: number;
  timerInterval: number;
  speakInterval: number;
  emojiLvl1: Array<EmojiItem>;
  emojiLvl2: Array<EmojiItem>;
  emojiLvl3: Array<EmojiItem>;
  emojiLvl4: Array<EmojiItem>;
  emojiLvl5: Array<EmojiItem>;
  emojiLvlDemo: Array<EmojiItem>;
  emojiLvlLookup: EmojiLevelsLookup;
  emojisFound: Array<EmojiItem>;
  maxEmojis: number;
  gameDifficulty: string;
  currentEmoji: EmojiItem;
  currentLvlIndex: number;
  topItemGuess: string;
  audioSources: AudioSources;
  sleuth: Sleuths;
  sleuthVoice: SleuthVoices;
  demoMode = false;
  debugMode = false;
  gameIsPaused = false;
  firstRun = true;
  firstSpeak = true;

  constructor() {
    this.emojiScavengerMobileNet = new MobileNet();
    this.isRunning = false;
    this.cameraPaused = false;
    this.score = 0;
    this.timer = GAME_START_TIME;
    this.emojisFound = [];
    this.maxEmojis = GAME_MAX_ITEMS;
    this.topItemGuess = null;
    this.sleuth = shuffle(SLEUTHS)[0];
    this.sleuthVoice = {
      'nonGoogleVoice': null,
      'googleVoice': null,
      'activeVoice': null
    };

    this.emojiLvl1 = shuffle(EMOJIS_LVL_1);
    this.emojiLvl2 = shuffle(EMOJIS_LVL_2);
    this.emojiLvl3 = shuffle(EMOJIS_LVL_3);
    this.emojiLvl4 = shuffle(EMOJIS_LVL_4);
    this.emojiLvl5 = shuffle(EMOJIS_LVL_5);
    this.emojiLvlDemo = Array.from(EMOJIS_LVL_DEMO);

    this.emojiLvlLookup = {
      '1': this.emojiLvl1,
      '2': this.emojiLvl2,
      '3': this.emojiLvl3,
      '4': this.emojiLvl4,
      '5': this.emojiLvl5,
      '#': this.emojiLvlDemo
    };

    this.gameDifficulty = '1121222345';
    this.currentLvlIndex = 0;

    this.audioSources = {
      [AUDIO.GAME_LOOP]: new Audio('/audio/game-loop.mp4'),
      [AUDIO.TIME_RUNNING_LOW]: new Audio('/audio/time-running-out.mp4'),
      [AUDIO.COUNTDOWN]: new Audio('/audio/countdown.mp4'),
      [AUDIO.FAIL]: new Audio('/audio/fail.mp4'),
      [AUDIO.FOUND_IT]: new Audio('/audio/foundit.mp4'),
      [AUDIO.WIN]: new Audio('/audio/win.mp4'),
      [AUDIO.END]: new Audio('/audio/end-of-game.mp4'),
      [AUDIO.TIMER_INCREASE]: new Audio('/audio/timer-increase.mp4')
    };

    if (getQueryParam('demo') === 'true') {
      this.setupDemoMode();
      this.demoMode = true;
    }

    if (getQueryParam('debug') === 'true') {
      this.debugMode = true;
    }

    this.setupSpeakVoice();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = this.setupSpeakVoice;
    }

    share.initShareElements();

  }

  setupDemoMode = () => {
    // Sets the game emojis to use the demo emojis from EMOJIS_LVL_DEMO.
    // This set is also not shuffled and always appear in the same order.
    this.gameDifficulty = '#';
  }

  setupSpeakVoice = () => {
    let gameClass = this;

    window.speechSynthesis.getVoices().filter(function(voice) {
      if (voice.name === gameClass.sleuth.nonGoogleVoice) {
        gameClass.sleuthVoice['nonGoogleVoice'] = voice;
      }

      if (voice.name === gameClass.sleuth.googleVoice) {
        gameClass.sleuthVoice['googleVoice'] = voice;
      }
    });

    if (this.sleuthVoice['googleVoice']) {
      this.sleuthVoice['activeVoice'] = this.sleuthVoice['googleVoice'];
    } else {
      this.sleuthVoice['activeVoice'] = this.sleuthVoice['nonGoogleVoice'];
    }
  }

  setupAudioSources = () => {
    /* We need to start and pause the audio sources when the game is
       initialized since we can't play audio sources from JS on mobile
       when not inititaited from a user action (like a click event) */
    for (let item in this.audioSources) {
      if (this.audioSources.hasOwnProperty(item)) {
        this.audioSources[item].muted = true;
        let playPromise = this.audioSources[item].play();
        if (playPromise !== undefined) {
          playPromise.then(_ => {
            this.audioSources[item].pause();
            this.audioSources[item].muted = false;
          })
          .catch(error => {
            console.log('Error with play promise');
          });
        }
      }
    }
  }

  resetAudioSources = () => {
    for (let item in this.audioSources) {
      if (this.audioSources.hasOwnProperty(item)) {
        this.pauseAudio(item);
      }
    }
  }

  playAudio = (audio: string, loop = false) => {
    if (loop) {
      this.audioSources[audio].loop = true;
    }
    if (!this.audioIsPlaying(audio)) {
      this.audioSources[audio].currentTime = 0;
      let playPromise = this.audioSources[audio].play();

      if (playPromise !== undefined) {
        playPromise.catch(function(error) {
          console.log('Error in playAudio: ' + error);
        });
      }
    }
  }

  pauseAudio = (audio: string) => {
    this.audioSources[audio].pause();
    this.audioSources[audio].currentTime = 0;
  }

  audioIsPlaying = (audio: string) => {
    return !this.audioSources[audio].paused;
  }

  warmUpModel = () => {
    this.emojiScavengerMobileNet.predict(
        tfc.zeros([VIDEO_PIXELS, VIDEO_PIXELS, 3]));
  }

  predict = async () => {
    if (this.isRunning) {
      const result = tfc.tidy(() => {

        const pixels = tfc.fromPixels(camera.videoElement);
        const centerHeight = pixels.shape[0] / 2;
        const beginHeight = centerHeight - (VIDEO_PIXELS / 2);
        const centerWidth = pixels.shape[1] / 2;
        const beginWidth = centerWidth - (VIDEO_PIXELS / 2);
        const pixelsCropped =
              pixels.slice([beginHeight, beginWidth, 0],
                           [VIDEO_PIXELS, VIDEO_PIXELS, 3]);

        return this.emojiScavengerMobileNet.predict(pixelsCropped);
      });
      const topK =
          await this.emojiScavengerMobileNet.getTopKClasses(result, 10);

      this.checkEmojiMatch(topK[0].label, topK[1].label);

      if (this.debugMode) {
        ui.predictionResultsEl.style.display = 'block';
        ui.predictionResultsEl.innerText = '';

        topK.forEach(item => {
          ui.predictionResultsEl.innerText +=
                `${item.value.toFixed(5)}: ${item.label}\n`;
        });
      }
    }
    requestAnimationFrame(() => this.predict());
  }

  initGame = () => {
    if (this.firstRun) {
      ui.showView(VIEWS.LOADING);
      Promise.all([
        this.emojiScavengerMobileNet.load().then(() => this.warmUpModel()),
        camera.setupCamera().then((value: CameraDimentions) => {
          camera.setupVideoDimensions(value[0], value[1]);
        }),
      ]).then(values => {
        // Both the MobileNet and the camera has been loaded.
        // We can start the game by starting the predict engine and showing the
        // game countdown.
        // NOTE the predict engine will only do calculations if game.isRunning
        // is set to true. We trigger that inside our countdown Promise.
        this.firstRun = false;
        this.nextEmoji();
        this.predict();
        ui.showCountdown();
      }).catch(error => {
        if (error.name === 'NotAllowedError') {
          if (ui.activeView === VIEWS.LOADING) {
            ui.hideView(VIEWS.LOADING);
            ui.setLandingInfoMsg(GAME_STRINGS.CAMERA_NO_ACCESS);
          }
        }
      });
    } else {
      ui.showCountdown();
    }
  }

  startGame = () => {
    camera.unPauseCamera();
    this.isRunning = true;

    this.pauseAudio(AUDIO.COUNTDOWN);
    this.playAudio(AUDIO.GAME_LOOP, true);

    this.timerAtStartOfRound = this.timer;
    this.timerInterval = window.setInterval(() => {
      this.handleGameTimerCountdown();
    }, GAME_TIMER_DELAY);

    this.speakInterval = window.setInterval(() => {
      let msg = ui.sleuthSpeakingSeeingMsg;
      ui.setSleuthSpeakerText(msg);
      this.speak(msg);
    }, SPEAKING_DELAY);
  }

  restartGame = () => {

    if (ui.activeView === VIEWS.FOUND_ALL_ITEMS) {
      ui.resetCameraAfterFlash();
    }

    this.resetGame();
    ui.showCountdown();
  }

  resetGame = () => {

    this.resetAudioSources();

    this.currentLvlIndex = 0;
    if (this.demoMode) {
      this.reShuffleLevelEmojis('#');
    }
    this.nextEmoji();

    this.score = 0;
    this.timer = GAME_START_TIME;
    this.timerAtStartOfRound = this.timer;
    this.emojisFound = [];
    this.firstSpeak = true;
    this.topItemGuess = null;

    ui.updateScore();
    ui.updateTimer(GAME_START_TIME);

    ui.resetSleuthSpeakerText();
    ui.hideSleuthSpeakerText();
  }

  pauseGame = () => {
    this.gameIsPaused = true;

    this.isRunning = false;
    this.pauseAudio(AUDIO.GAME_LOOP);
    this.pauseAudio(AUDIO.TIME_RUNNING_LOW);

    camera.pauseCamera();
    window.clearInterval(this.timerInterval);
    window.clearInterval(this.speakInterval);
  }

  resumeGame = () => {
    if (this.gameIsPaused) {
      this.startGame();
    }
  }

  getMobileNet = () => {
    return this.emojiScavengerMobileNet;
  }

  speak = (msg: string) => {
    if (this.topItemGuess) {
      if ('speechSynthesis' in window) {
        let msgSpeak = new SpeechSynthesisUtterance();
        msgSpeak.voice = this.sleuthVoice['activeVoice'];
        msgSpeak.text = msg;

        speechSynthesis.speak(msgSpeak);
      }
    }
  }

  handleGameTimerCountdown = () => {

    if (this.timer === 0) {
      this.pauseAudio(AUDIO.GAME_LOOP);
      this.pauseAudio(AUDIO.TIME_RUNNING_LOW);
      window.clearInterval(this.timerInterval);
      window.clearInterval(this.speakInterval);

      (<any>window).gtag('event', 'Failure', {
        'event_category': 'Emoji',
        'event_label': `${this.currentEmoji.emoji} - ${this.currentEmoji.name}`
      });

      if (this.score === 0) {
        ui.showNoItemsFoundView();
      }
      else {
        ui.showXItemsFoundView();
      }
    } else if (this.timer === 5) {
      this.playAudio(AUDIO.TIME_RUNNING_LOW);
    }

    ui.updateTimer(this.timer);
    this.timer--;

  }

  checkEmojiMatch = (emojiNameTop1: string, emojiNameTop2: string) => {

    // If our top guess is different from when we last checked update the
    // top guess.
    if (this.topItemGuess !== emojiNameTop1) {
      this.topItemGuess = emojiNameTop1;

      /* As soon as we have a top guess available try to speak so the game
         and prediction feels snappy instead of waiting for the 2.5second
         speak delay to speak the initial guess */
      if (this.firstSpeak) {
        let msg = ui.sleuthSpeakingSeeingMsg;
        ui.setSleuthSpeakerText(msg);
        this.speak(msg);
        this.firstSpeak = false;
      }
    }

    if (this.currentEmoji.name === emojiNameTop1 ||
        this.currentEmoji.name === emojiNameTop2)  {
      this.emojiFound();
    }
  }

  nextEmoji = () => {

    if (this.currentLvlIndex === this.gameDifficulty.length) {
      this.currentLvlIndex = 0;
    }

    let curLvl = this.gameDifficulty[this.currentLvlIndex];
    let lvlArray = this.emojiLvlLookup[curLvl];
    let nextEmoji = lvlArray.shift();

    if (nextEmoji === undefined) {
      this.reShuffleLevelEmojis(curLvl);
      lvlArray = this.emojiLvlLookup[curLvl];
      nextEmoji = lvlArray.shift();
    }

    this.currentLvlIndex++;
    this.currentEmoji = nextEmoji;

    ui.setActiveEmoji(this.currentEmoji.path);

    (<any>window).gtag('event', 'Find', {
      'event_category': 'Emoji',
      'event_label': `${this.currentEmoji.emoji} - ${this.currentEmoji.name}`
    });
  }

  reShuffleLevelEmojis = (level: string) => {
    switch (level) {
      case '1':
        this.emojiLvlLookup[level] = shuffle(EMOJIS_LVL_1);
        break;
      case '2':
        this.emojiLvlLookup[level] = shuffle(EMOJIS_LVL_2);
        break;
      case '3':
        this.emojiLvlLookup[level] = shuffle(EMOJIS_LVL_3);
        break;
      case '4':
        this.emojiLvlLookup[level] = shuffle(EMOJIS_LVL_4);
        break;
      case '5':
        this.emojiLvlLookup[level] = shuffle(EMOJIS_LVL_5);
        break;
      case '#':
        this.emojiLvlLookup[level] = Array.from(EMOJIS_LVL_DEMO);
        break;
      default:
        throw 'Error: expected ' + level + ' level string in the level ' +
              'EmojiLevelsLookup';
    }
  }

  emojiFound = () => {
    this.pauseGame();

    this.firstSpeak = true;
    this.score++;
    this.emojisFound.push(this.currentEmoji);
    this.playAudio(AUDIO.FOUND_IT);

    ui.cameraFlash();

    let timeToFind = this.timerAtStartOfRound - this.timer;
    (<any>window).gtag('event', 'Success', {
      'event_category': 'Emoji',
      'event_label': `${this.currentEmoji.emoji} - ${this.currentEmoji.name}`,
      'value': timeToFind
    });

    if (this.maxEmojis === this.score) {
      ui.showAllItemsFoundView();
    } else {
      setTimeout( () => {
        ui.showItemFoundView();
        ui.setSleuthSpeakerText(ui.sleuthSpeakingFoundItMsg, true);
        this.speak(ui.sleuthSpeakingFoundItMsgEmojiName);
      }, 1000);
    }
  }
}

export let game = new Game();
