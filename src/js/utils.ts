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

const isIOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

const isMobile = () => {
  return isIOS() || isAndroid();
};

const isChrome = () => {
  return navigator.userAgent.indexOf('Chrome') !== -1;
};

const isChromeIOS = () => {
  return isIOS() && /CriOS/i.test(navigator.userAgent);
};

const getQueryParam = (query: string) => {
  if ('URLSearchParams' in (<any>window)) {
    let params = (new URL(document.URL)).searchParams;
    return params.get(query);
  } else {
    if (!(<any>window).location.search) {
      return undefined;
    }
    let m = new RegExp(query +
        '=([^&]*)').exec((<any>window).location.search.substring(1));
    if (!m) {
      return undefined;
    }
    return decodeURIComponent(m[1]);
  }
};

export {getQueryParam, isMobile, isIOS, isAndroid, isChrome, isChromeIOS};

