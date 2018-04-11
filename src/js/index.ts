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

import {ui} from './ui';

/**
 * Ensures no media stream tracks are active and initializes our UI.
 *
 * @async
 */
async function init() {
  if ((<any>window).stream) {
    let trackArr = (<any>window).stream.getTracks();
    for (const track of trackArr) {
      track.stop();
    }
  }

  ui.init();
}

init();
