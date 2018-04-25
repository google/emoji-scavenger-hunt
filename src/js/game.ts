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

import 'babel-polyfill';
import {MobileNet} from './mobilenet';
import {camera, VIDEO_PIXELS} from './camera';
import {VIEWS, ui, GAME_STRINGS} from './ui';
import {share} from './share';
import {getQueryParam, isIOS} from './utils';
import {shuffle} from 'lodash';
import * as tfc from '@tensorflow/tfjs-core';
import {SPEECH_SPRITE_TIMESTAMPS} from './speech_sprite_timestamps';
import {EmojiItem, EMOJIS_LVL_1, EMOJIS_LVL_2, EMOJIS_LVL_3, EMOJIS_LVL_4,
     EMOJIS_LVL_5, EMOJIS_LVL_DEMO} from './game_levels';

export const GAME_START_TIME = 20;
export const GAME_EXTEND_TIME = 10;
export const GAME_MAX_ITEMS = 10;
const SPEAKING_DELAY = 2500; // 2.5 seconds
const GAME_TIMER_DELAY = 1000; // 1 second

export interface EmojiLevelsLookup {
  [index: string]: Array<EmojiItem>;
}

interface CameraDimentions {
  [index: number]: number;
}

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
  TIMER_INCREASE: 'timerincrease',
  IOS_SPEECH_SPRITE: 'iosspeechsprite'
};

/** Manages game state and various tasks related to game events. */
export class Game {
  /** Our MobileNet instance and how we get access to our trained model. */
  emojiScavengerMobileNet: MobileNet;
  isRunning: boolean;
  cameraPaused: boolean;
  /** The current score for the user based on how many emoji they have found. */
  score: number;
  /** The available time to find the emoji (in seconds). */
  timer: number;
  timerAtStartOfRound: number;
  /** Timer interval so we can continually update the timer. */
  timerInterval: number;
  /** Speak interval for reading out objects from the camera every x seconds. */
  speakInterval: number;
  emojiLvl1: Array<EmojiItem>;
  emojiLvl2: Array<EmojiItem>;
  emojiLvl3: Array<EmojiItem>;
  emojiLvl4: Array<EmojiItem>;
  emojiLvl5: Array<EmojiItem>;
  emojiLvlDemo: Array<EmojiItem>;
  /**
   * A lookup containing references to each level of emoji which can be used
   * to find the next emoji from that particular level.
   */
  emojiLvlLookup: EmojiLevelsLookup;
  /** Array of emoji items the user has found during this game instance. */
  emojisFound: Array<EmojiItem>;
  /**
   * A string containing the order of emojis levels we will pick randomly from
   * for each game instance. E.g '1123445' would pick one item from level 1
   * followed by another from level 1, then one from level 2 etc.
   */
  gameDifficulty: string;
  /** The current emoji to find. */
  currentEmoji: EmojiItem;
  currentLvlIndex: number;
  /**
   * The current top ranked item the model has predicted and identified from
   * the camera.
   */
  topItemGuess: string;
  audioSources: AudioSources;
  sleuth: Sleuths;
  sleuthVoice: SleuthVoices;
  /** An array of snapshots taken when the model finds an emoji. */
  endGamePhotos: Array<HTMLImageElement>;
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
    this.endGamePhotos = [];
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

    if (isIOS()) {
      this.audioSources[AUDIO.IOS_SPEECH_SPRITE] =
          new Audio('/audio/ios-speech-sprite.m4a');
    }

    if (getQueryParam('demo') === 'true') {
      this.setupDemoMode();
      this.demoMode = true;
    }

    if (getQueryParam('debug') === 'true') {
      this.debugMode = true;
    }

    // Calls to window.speechSynthesis.getVoices() are async hence we call our
    // function that sets speaking voices from within the onvoiceschanged event
    // again to ensure we have all voices loaded before setting them.
    if (window.speechSynthesis) {
      this.setupSpeakVoice();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = this.setupSpeakVoice.bind(this);
      }
    }

    share.initShareElements();

  }

  setupDemoMode() {
    // Sets the game emojis to use the demo emojis from EMOJIS_LVL_DEMO.
    // This set is also not shuffled and always appear in the same order.
    this.gameDifficulty = '#';
  }

  /**
   * Gets a list of supported speechSynthesis voices on the current platform
   * and checks support for our selected voices. If the Google US English voice
   * is available use that, else set to our back up voice selection.
   */
  setupSpeakVoice() {
    window.speechSynthesis.getVoices().filter(voice => {
      if (voice.name === this.sleuth.nonGoogleVoice) {
        this.sleuthVoice['nonGoogleVoice'] = voice;
      }

      if (voice.name === this.sleuth.googleVoice) {
        this.sleuthVoice['googleVoice'] = voice;
      }
    });

    if (this.sleuthVoice['googleVoice']) {
      this.sleuthVoice['activeVoice'] = this.sleuthVoice['googleVoice'];
    } else {
      this.sleuthVoice['activeVoice'] = this.sleuthVoice['nonGoogleVoice'];
    }
  }

  /**
   * Cycles audio sources for the game and plays them and immediately pausing
   * them after. This ensures they are ready for play later on during the game
   * lifecycle and can be played from JavaScript functions.
   */
  setupAudioSources() {
    // We need to start and pause the audio sources when the game is
    // initialized since we can't play audio sources from JS on mobile
    // when not initiated from a user action (like a click event).
    for (const item of Object.keys(this.audioSources)) {
      this.audioSources[item].muted = true;
      let playPromise = this.audioSources[item].play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.audioSources[item].pause();
          this.audioSources[item].muted = false;
        })
        .catch(error => {
          console.log('Error with play promise');
        });
      }
    }
  }

  /**
   * Resets all audio sources.
   */
  resetAudioSources() {
    for (const item of Object.keys(this.audioSources)) {
      this.pauseAudio(item);
    }
  }

  /**
   * Plays a provided audio file.
   * @param audio The audio file to play.
   * @param loop Indicates if the audio file should loop.
   */
  playAudio(audio: string, loop = false, startTime = 0,
      endTime:number = undefined) {
    let audioElement = this.audioSources[audio];
    if (loop) {
      audioElement.loop = true;
    }
    if (!this.audioIsPlaying(audio)) {
      audioElement.currentTime = startTime;
      let playPromise = audioElement.play();

      if (endTime !== undefined) {
        const timeUpdate = (e: Event) => {
          if (audioElement.currentTime >= endTime) {
            audioElement.pause();
            audioElement.removeEventListener('timeupdate', timeUpdate);
          }
        };

        audioElement.addEventListener('timeupdate', timeUpdate);
      }

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Error in playAudio: ' + error);
        });
      }
    }
  }

  /**
   * Pauses an audio file.
   * @param audio The audio file to pause.
   */
  pauseAudio(audio: string) {
    this.audioSources[audio].pause();
    this.audioSources[audio].currentTime = 0;
  }

  /**
   * Checks if the provided audio file is currently playing.
   * @param audio The audio file to test against.
   * @returns true if the audio is playing, false if not.
   */
  audioIsPlaying(audio: string) {
    return !this.audioSources[audio].paused;
  }

  /**
   * Plays a snippet of an audio sprite based on timestamps in
   * SPEECH_SPRITE_TIMESTAMPS.
   * @param key The key to look up in the sprite timestamps.
   */
  spriteSpeak(key: string) {
    if (SPEECH_SPRITE_TIMESTAMPS.hasOwnProperty(key)) {
      this.playAudio(AUDIO.IOS_SPEECH_SPRITE,
          false, SPEECH_SPRITE_TIMESTAMPS[key][0],
          SPEECH_SPRITE_TIMESTAMPS[key][1] + .25);
    }
  }

  /**
   * Ensures the MobileNet prediction model in tensorflow.js is ready to
   * accept data when we need it by triggering a predict call with zeros to
   * preempt the predict tensor setups.
   */
  warmUpModel() {
    this.emojiScavengerMobileNet.predict(
        tfc.zeros([VIDEO_PIXELS, VIDEO_PIXELS, 3]));
  }

  /**
   * The game MobileNet predict call used to identify content from the camera
   * and make predictons about what it is seeing.
   * @async
   */
  async predict() {

    // Only do predictions if the game is running, ensures performant view
    // transitions and saves battery life when the game isn't in running mode.
    if (this.isRunning) {
      // Run the tensorflow predict logic inside a tfc.tidy call which helps
      // to clean up memory from tensorflow calls once they are done.
      const result = tfc.tidy(() => {

        // For UX reasons we spread the video element to 100% of the screen
        // but our traning data is trained against 244px images. Before we
        // send image data from the camera to the predict engine we slice a
        // 244 pixel area out of the center of the camera screen to ensure
        // better matching against our model.
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

      // This call retrieves the topK matches from our MobileNet for the
      // provided image data.
      const topK =
          await this.emojiScavengerMobileNet.getTopKClasses(result, 10);

      // Match the top 2 matches against our current active emoji.
      this.checkEmojiMatch(topK[0].label, topK[1].label);

      // if ?debug=true is passed in as a query param show the topK classes
      // on screen to help with debugging.
      if (this.debugMode) {
        ui.predictionResultsEl.style.display = 'block';
        ui.predictionResultsEl.innerText = '';

        for (const item of topK) {
          ui.predictionResultsEl.innerText +=
                `${item.value.toFixed(5)}: ${item.label}\n`;
        }
      }
    }

    // To ensure better page responsiveness we call our predict function via
    // requestAnimationFrame - see goo.gl/1d9cJa
    requestAnimationFrame(() => this.predict());
  }

  /**
   * Initializes the game and sets up camera and MobileNet access. Once ready
   * shows the countdown to start the game.
   */
  initGame() {
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
        ui.startGameBtn.style.display = 'none';
        ui.ageDisclaimerMsgEl.style.display = 'none';
        ui.hideView(VIEWS.LOADING);

        // iOS does not provide access to mediaDevices.getUserMedia via
        // UiWebviews in iOS 11.2 - This causes a TypeError to be returned
        // which we handle to display a relevant message to encourage the user
        // to open the game in the standard Safari app.
        if (error.name === 'TypeError' && isIOS()) {
          ui.setLandingInfoMsg(GAME_STRINGS.SAFARI_WEBVIEW);
        } else if (error.name === 'NotAllowedError') {
          // Users that explicitly deny camera access get a message that
          // encourages them to enable camera access.
          ui.setLandingInfoMsg(GAME_STRINGS.CAMERA_NO_ACCESS);
        } else {
          // General error message for issues getting camera access via
          // mediaDevices.getUserMedia.
          ui.setLandingInfoMsg(GAME_STRINGS.CAMERA_GENERAL_ERROR);
        }
      });
    } else {
      ui.showCountdown();
    }
  }

  /**
   * Starts the game by setting the game to running, playing audio and
   * registering the game timer and speech intervals.
   */
  startGame() {
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

  /**
   * Restarts the game.
   */
  restartGame() {
    if (ui.activeView === VIEWS.FOUND_ALL_ITEMS) {
      ui.resetCameraAfterFlash();
    }

    this.resetGame();
    ui.showCountdown();
  }

  /**
   * Resets all game variables and UI so we can start a new game instance.
   */
  resetGame() {

    ui.resetScrollPositions();

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
    this.endGamePhotos = [];
    this.firstSpeak = true;
    this.topItemGuess = null;

    ui.updateScore();
    ui.updateTimer(GAME_START_TIME);

    ui.resetSleuthSpeakerText();
    ui.hideSleuthSpeakerText();
  }

  /**
   * Pauses the game.
   */
  pauseGame() {
    this.gameIsPaused = true;

    this.isRunning = false;
    this.pauseAudio(AUDIO.GAME_LOOP);
    this.pauseAudio(AUDIO.TIME_RUNNING_LOW);

    camera.pauseCamera();
    window.clearInterval(this.timerInterval);
    window.clearInterval(this.speakInterval);
  }

  /**
   * Resumes the game.
   */
  resumeGame() {
    if (this.gameIsPaused) {
      this.startGame();
    }
  }

  /**
   * Uses the speechSynthesis API to speak out strings from the game.
   * Used for things like what the model is seeing in the real world, and
   * giving the user an audio notification when they found an item or the game
   * is over.
   * @param msg
   */
  speak(msg: string) {
    if (this.topItemGuess) {
      if ('speechSynthesis' in window) {
        let msgSpeak = new SpeechSynthesisUtterance();
        msgSpeak.voice = this.sleuthVoice['activeVoice'];
        msgSpeak.text = msg;

        speechSynthesis.speak(msgSpeak);
      }
    }
  }

  /**
   * Handles the game timer logic that is executed at every GAME_TIMER_DELAY
   * (currently every second)
   */
  handleGameTimerCountdown() {

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
        ui.showXItemsFoundView(this.endGamePhotos);
      }
    } else if (this.timer <= 5) {
      if (this.timer === 5) {
        this.playAudio(AUDIO.TIME_RUNNING_LOW);
      }

      ui.updateTimer(this.timer, false, true);
    } else {
      ui.updateTimer(this.timer);
    }

    this.timer--;
  }

  /**
   * Determines if our top 2 matches from the MobileNet is the emoji we are
   * currently looking to find.
   * @param emojiNameTop1 Top guess emoji name.
   * @param emojiNameTop2 Second place guess emoji name.
   */
  checkEmojiMatch(emojiNameTop1: string, emojiNameTop2: string) {

    // If our top guess is different from when we last checked update the
    // top guess.
    if (this.topItemGuess !== emojiNameTop1) {
      this.topItemGuess = emojiNameTop1;

      // As soon as we have a top guess available try to speak so the game
      // and prediction feels snappy instead of waiting for the 2.5 second
      // speak delay to speak out the initial guess.
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

  /**
   * Determines the next emoji that the user will be asked to find using the
   * gameDifficulty levels to request a level based on how far the user has
   * progressed in the game.
   */
  nextEmoji() {

    if (this.currentLvlIndex === this.gameDifficulty.length) {
      this.currentLvlIndex = 0;
    }

    let curLvl = this.gameDifficulty[this.currentLvlIndex];
    let lvlArray = this.emojiLvlLookup[curLvl];
    let nextEmoji = lvlArray.shift();

    // If we have selected all possible emojis from a particular level,
    // reshuffle the list of possible emoji for that level and request a new
    // next emoji.
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

  /**
   * Ensures that the possible list of emoji for each level is shuffled once we
   * end up selecting all items from a level. This can happen in cases where
   * we use a large levelDifficulty string that has more items than what we
   * have for each level or if the game win number is increased beyond the
   * current 10. Meaning a user can be asked to find a lot more emojis.
   * @param level The level that we wish to re-shuffle
   */
  reShuffleLevelEmojis(level: string) {
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
        // NOTE: the Demo list is not shuffled since we always request them in
        // same order for demo purposes.
        this.emojiLvlLookup[level] = Array.from(EMOJIS_LVL_DEMO);
        break;
      default:
        throw new Error('Error: expected ' + level + ' level string in the ' +
            'level EmojiLevelsLookup');
    }
  }

  /**
   * Triggers the camera flash and updates the score when we find an emoji.
   */
  emojiFound() {
    this.pauseGame();

    this.firstSpeak = true;
    this.score++;
    this.emojisFound.push(this.currentEmoji);
    this.endGamePhotos.push(camera.snapshot());
    this.playAudio(AUDIO.FOUND_IT);

    ui.cameraFlash();

    let timeToFind = this.timerAtStartOfRound - this.timer;
    (<any>window).gtag('event', 'Success', {
      'event_category': 'Emoji',
      'event_label': `${this.currentEmoji.emoji} - ${this.currentEmoji.name}`,
      'value': timeToFind
    });

    if (GAME_MAX_ITEMS === this.score) {
      ui.showAllItemsFoundView(this.endGamePhotos);
    } else {
      setTimeout(() => {
        ui.showItemFoundView();
        ui.setSleuthSpeakerText(ui.sleuthSpeakingFoundItMsg, true);
        if (isIOS()) {
          this.spriteSpeak(this.currentEmoji.name);
        } else {
          this.speak(ui.sleuthSpeakingFoundItMsgEmojiName);
        }
      }, 1000);
    }
  }
}

export let game = new Game();
