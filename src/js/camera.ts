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

import {game} from './game';
import {addClass} from './classes';

const SELECTORS = {
  CAMERA_ELEMENT: '.camera__element--js',
};

const CSS_CLASSES = {
  CAMERA_FRONT_FACING: 'camera-front-facing'
};

export const VIDEO_PIXELS = 224;

export class Camera {

  videoElement: HTMLVideoElement;
  aspectRatio: number;

  constructor() {
    this.videoElement =
      <HTMLVideoElement>document.querySelector(SELECTORS.CAMERA_ELEMENT);
  }

  setupCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {facingMode: 'environment'}
      });
      (<any>window).stream = stream;
      this.videoElement.srcObject = stream;
      return new Promise(resolve => {
        this.videoElement.onloadedmetadata = () => {
          resolve([this.videoElement.videoWidth,
              this.videoElement.videoHeight]);
        };
      });
    }

    return null;
  }

  setupVideoDimensions = (width: number, height: number) => {
    this.aspectRatio = width / height;

    if (width >= height) {
      this.videoElement.height = VIDEO_PIXELS;
      this.videoElement.width = this.aspectRatio * VIDEO_PIXELS;
    } else {
      this.videoElement.width = VIDEO_PIXELS;
      this.videoElement.height = VIDEO_PIXELS / this.aspectRatio;
    }
  }

  pauseCamera = () => {
    if (!game.cameraPaused) {
      this.videoElement.pause();
      game.cameraPaused = true;
    }
  }

  unPauseCamera = () => {
    if (game.cameraPaused) {
      this.videoElement.play();
      game.cameraPaused = false;
    }
  }

  setFrontFacingCamera = () => {
    addClass(this.videoElement, CSS_CLASSES.CAMERA_FRONT_FACING);
  }
}

export let camera = new Camera();
