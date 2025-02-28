/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import { isLangJa } from './utils';

const ROOT_PATH = isLangJa() ? '../' : '';

export interface EmojiItem {
  [index: string]: string;
}

export const EMOJIS_LVL_1: Array<EmojiItem> = [
  {
    'name': 'hand',
    'emoji': '✋',
    'path': ROOT_PATH + 'img/emojis/game/hand.svg'
  },
  {
    'name': 'mouse',
    'emoji': '🖱',
    'path': ROOT_PATH + 'img/emojis/game/mouse.svg'
  },
  {
    'name': 'plug',
    'emoji': '🔌',
    'path': ROOT_PATH + 'img/emojis/game/plug.svg'
  },
  {
    'name': 'light bulb',
    'emoji': '💡',
    'path': ROOT_PATH + 'img/emojis/game/light-bulb.svg'
  },
  {
    'name': 'book',
    'emoji': '📚',
    'path': ROOT_PATH + 'img/emojis/game/book.svg'
  },
  {
    'name': 'cellphone',
    'emoji': '📱',
    'path': ROOT_PATH + 'img/emojis/game/cellphone.svg'
  },
  {
    'name': 'keyboard',
    'emoji': '⌨️',
    'path': ROOT_PATH + 'img/emojis/game/keyboard.svg'
  },
  {
    'name': 'tv',
    'emoji': '📺',
    'path': ROOT_PATH + 'img/emojis/game/tv.svg'
  },
  {
    'name': 'laptop',
    'emoji': '💻',
    'path': ROOT_PATH + 'img/emojis/game/laptop.svg'
  },
  {
    'name': 'shirt',
    'emoji': '👕',
    'path': ROOT_PATH + 'img/emojis/game/shirt.svg'
  },
  {
    'name': 'pants',
    'emoji': '👖',
    'path': ROOT_PATH + 'img/emojis/game/pants.svg'
  },
  {
    'name': 'shoe',
    'emoji': '👞',
    'path': ROOT_PATH + 'img/emojis/game/shoe.svg'
  }
];

export const EMOJIS_LVL_2: Array<EmojiItem> = [
  {
    'name': 'key',
    'emoji': '🔑',
    'path': ROOT_PATH + 'img/emojis/game/key.svg'
  },
  {
    'name': 'newspaper',
    'emoji': '📰',
    'path': ROOT_PATH + 'img/emojis/game/newspaper.svg'
  },
  {
    'name': 'plate',
    'emoji': '🍽',
    'path': ROOT_PATH + 'img/emojis/game/plate.svg'
  },
  {
    'name': 'sock',
    'emoji': '🧦',
    'path': ROOT_PATH + 'img/emojis/game/sock.svg'
  },
  {
    'name': 'coat',
    'emoji': '🧥',
    'path': ROOT_PATH + 'img/emojis/game/coat.svg'
  },
  {
    'name': 'wallet',
    'emoji': '👛',
    'path': ROOT_PATH + 'img/emojis/game/wallet.svg'
  },
  {
    'name': 'bed',
    'emoji': '🛏',
    'path': ROOT_PATH + 'img/emojis/game/bed.svg'
  },
  {
    'name': 'cup',
    'emoji': '☕',
    'path': ROOT_PATH + 'img/emojis/game/cup.svg'
  },
  {
    'name': 'watch',
    'emoji': '⌚',
    'path': ROOT_PATH + 'img/emojis/game/watch.svg'
  },
  {
    'name': 'trash can',
    'emoji': '🗑',
    'path': ROOT_PATH + 'img/emojis/game/trash-can.svg'
  },
  {
    'name': 'envelope',
    'emoji': '✉️',
    'path': ROOT_PATH + 'img/emojis/game/envelope.svg'
  },
  {
    'name': 'sunglasses',
    'emoji': '🕶',
    'path': ROOT_PATH + 'img/emojis/game/sunglasses.svg'
  },
  {
    'name': 'toilet',
    'emoji': '🚽',
    'path': ROOT_PATH + 'img/emojis/game/toilet.svg'
  },
  {
    'name': 'clock',
    'emoji': '🕑',
    'path': ROOT_PATH + 'img/emojis/game/clock.svg'
  },
  {
    'name': 'hat',
    'emoji': '🧢',
    'path': ROOT_PATH + 'img/emojis/game/hat.svg'
  },
  {
    'name': 'backpack',
    'emoji': '🎒',
    'path': ROOT_PATH + 'img/emojis/game/backpack.svg'
  },
  {
    'name': 'headphones',
    'emoji': '🎧',
    'path': ROOT_PATH + 'img/emojis/game/headphones.svg'
  },
  {
    'name': 'display',
    'emoji': '🖥',
    'path': ROOT_PATH + 'img/emojis/game/display.svg'
  },
  {
    'name': 'spoon',
    'emoji': '🥄',
    'path': ROOT_PATH + 'img/emojis/game/spoon.svg'
  },
  {
    'name': 'bowl',
    'emoji': '🥣',
    'path': ROOT_PATH + 'img/emojis/game/bowl.svg'
  }
];

export const EMOJIS_LVL_3: Array<EmojiItem> = [
  {
    'name': 'scarf',
    'emoji': '🧣',
    'path': ROOT_PATH + 'img/emojis/game/scarf.svg'
  },
  {
    'name': 'scissors',
    'emoji': '✂️',
    'path': ROOT_PATH + 'img/emojis/game/scissors.svg'
  },
  {
    'name': 'cabinet',
    'emoji': '🗄',
    'path': ROOT_PATH + 'img/emojis/game/cabinet.svg'
  },
  {
    'name': 'tree',
    'emoji': '🌲',
    'path': ROOT_PATH + 'img/emojis/game/tree.svg'
  },
  {
    'name': 'beer',
    'emoji': '🍺',
    'path': ROOT_PATH + 'img/emojis/game/beer.svg'
  },
  {
    'name': 'sofa',
    'emoji': '🛋',
    'path': ROOT_PATH + 'img/emojis/game/sofa.svg'
  },
  {
    'name': 'house',
    'emoji': '🏠',
    'path': ROOT_PATH + 'img/emojis/game/house.svg'
  },
  {
    'name': 'building',
    'emoji': '🏢',
    'path': ROOT_PATH + 'img/emojis/game/building.svg'
  },
  {
    'name': 'bicycle',
    'emoji': '🚲',
    'path': ROOT_PATH + 'img/emojis/game/bicycle.svg'
  },
  {
    'name': 'frying pan',
    'emoji': '🍳',
    'path': ROOT_PATH + 'img/emojis/game/frying-pan.svg'
  },
  {
    'name': 'wine',
    'emoji': '🍷',
    'path': ROOT_PATH + 'img/emojis/game/wine.svg'
  },
  {
    'name': 'bread',
    'emoji': '🍞',
    'path': ROOT_PATH + 'img/emojis/game/bread.svg'
  },
  {
    'name': 'printer',
    'emoji': '🖨',
    'path': ROOT_PATH + 'img/emojis/game/printer.svg'
  },
  {
    'name': 'banana',
    'emoji': '🍌',
    'path': ROOT_PATH + 'img/emojis/game/banana.svg'
  },
  {
    'name': 'car',
    'emoji': '🚗',
    'path': ROOT_PATH + 'img/emojis/game/car.svg'
  },
  {
    'name': 'flower',
    'emoji': '🌼',
    'path': ROOT_PATH + 'img/emojis/game/flower.svg'
  },
  {
    'name': 'glove',
    'emoji': '🧤',
    'path': ROOT_PATH + 'img/emojis/game/glove.svg'
  },
  {
    'name': 'umbrella',
    'emoji': '☂️',
    'path': ROOT_PATH + 'img/emojis/game/umbrella.svg'
  },
  {
    'name': 'bathtub',
    'emoji': '🛁',
    'path': ROOT_PATH + 'img/emojis/game/bathtub.svg'
  },
  {
    'name': 'camera',
    'emoji': '📷',
    'path': ROOT_PATH + 'img/emojis/game/camera.svg'
  }
];

export const EMOJIS_LVL_4: Array<EmojiItem> = [
  {
    'name': 'cat',
    'emoji': '🐱',
    'path': ROOT_PATH + 'img/emojis/game/cat.svg'
  },
  {
    'name': 'guitar',
    'emoji': '🎸',
    'path': ROOT_PATH + 'img/emojis/game/guitar.svg'
  },
  {
    'name': 'dog',
    'emoji': '🐶',
    'path': ROOT_PATH + 'img/emojis/game/dog.svg'
  },
  {
    'name': 'orange',
    'emoji': '🍊',
    'path': ROOT_PATH + 'img/emojis/game/orange.svg'
  },
  {
    'name': 'strawberry',
    'emoji': '🍓',
    'path': ROOT_PATH + 'img/emojis/game/strawberry.svg'
  },
  {
    'name': 'piano',
    'emoji': '🎹',
    'path': ROOT_PATH + 'img/emojis/game/piano.svg'
  },
  {
    'name': 'hammer',
    'emoji': '🔨',
    'path': ROOT_PATH + 'img/emojis/game/hammer.svg'
  },
  {
    'name': 'microphone',
    'emoji': '🎤',
    'path': ROOT_PATH + 'img/emojis/game/microphone.svg'
  },
  {
    'name': 'broccoli',
    'emoji': '🥦',
    'path': ROOT_PATH + 'img/emojis/game/broccoli.svg'
  },
  {
    'name': 'lipstick',
    'emoji': '💄',
    'path': ROOT_PATH + 'img/emojis/game/lipstick.svg'
  },
  {
    'name': 'lock',
    'emoji': '🔒',
    'path': ROOT_PATH + 'img/emojis/game/lock.svg'
  },
  {
    'name': 'mailbox',
    'emoji': '📪',
    'path': ROOT_PATH + 'img/emojis/game/mailbox.svg'
  },
  {
    'name': 'soccer ball',
    'emoji': '⚽',
    'path': ROOT_PATH + 'img/emojis/game/soccer-ball.svg'
  },
  {
    'name': 'mushroom',
    'emoji': '🍄',
    'path': ROOT_PATH + 'img/emojis/game/mushroom.svg'
  },
  {
    'name': 'lemon',
    'emoji': '🍋',
    'path': ROOT_PATH + 'img/emojis/game/lemon.svg'
  },
  {
    'name': 'baseball',
    'emoji': '⚾',
    'path': ROOT_PATH + 'img/emojis/game/baseball.svg'
  },
  {
    'name': 'basketball',
    'emoji': '🏀',
    'path': ROOT_PATH + 'img/emojis/game/basketball.svg'
  },
  {
    'name': 'flashlight',
    'emoji': '🔦',
    'path': ROOT_PATH + 'img/emojis/game/flashlight.svg'
  },
  {
    'name': 'candle',
    'emoji': '🕯',
    'path': ROOT_PATH + 'img/emojis/game/candle.svg'
  },
  {
    'name': 'radio',
    'emoji': '📻',
    'path': ROOT_PATH + 'img/emojis/game/radio.svg'
  }
];

export const EMOJIS_LVL_5: Array<EmojiItem> = [
  {
    'name': 'fish',
    'emoji': '🐟',
    'path': ROOT_PATH + 'img/emojis/game/fish.svg'
  },
  {
    'name': 'icecream',
    'emoji': '🍨',
    'path': ROOT_PATH + 'img/emojis/game/icecream.svg'
  },
  {
    'name': 'pizza',
    'emoji': '🍕',
    'path': ROOT_PATH + 'img/emojis/game/pizza.svg'
  },
  {
    'name': 'bird',
    'emoji': '🐦',
    'path': ROOT_PATH + 'img/emojis/game/bird.svg'
  },
  {
    'name': 'cassette',
    'emoji': '📼',
    'path': ROOT_PATH + 'img/emojis/game/cassette.svg'
  },
  {
    'name': 'hamburger',
    'emoji': '🍔',
    'path': ROOT_PATH + 'img/emojis/game/hamburger.svg'
  },
  {
    'name': 'hotdog',
    'emoji': '🌭',
    'path': ROOT_PATH + 'img/emojis/game/hotdog.svg'
  },
  {
    'name': 'fries',
    'emoji': '🍟',
    'path': ROOT_PATH + 'img/emojis/game/fries.svg'
  },
  {
    'name': 'ramen',
    'emoji': '🍜',
    'path': ROOT_PATH + 'img/emojis/game/ramen.svg'
  },
  {
    'name': 'donut',
    'emoji': '🍩',
    'path': ROOT_PATH + 'img/emojis/game/donut.svg'
  },
  {
    'name': 'sushi',
    'emoji': '🍣',
    'path': ROOT_PATH + 'img/emojis/game/sushi.svg'
  },
  {
    'name': 'taco',
    'emoji': '🌮',
    'path': ROOT_PATH + 'img/emojis/game/taco.svg'
  },
  {
    'name': 'burrito',
    'emoji': '🌯',
    'path': ROOT_PATH + 'img/emojis/game/burrito.svg'
  },
  {
    'name': 'traffic light',
    'emoji': '🚦',
    'path': ROOT_PATH + 'img/emojis/game/traffic-light.svg'
  },
  {
    'name': 'bus',
    'emoji': '🚎',
    'path': ROOT_PATH + 'img/emojis/game/bus.svg'
  },
  {
    'name': 'truck',
    'emoji': '🚚',
    'path': ROOT_PATH + 'img/emojis/game/truck.svg'
  },
  {
    'name': 'screw',
    'emoji': '🔩',
    'path': ROOT_PATH + 'img/emojis/game/screw.svg'
  },
  {
    'name': 'sax',
    'emoji': '🎷',
    'path': ROOT_PATH + 'img/emojis/game/sax.svg'
  },
  {
    'name': 'baby bottle',
    'emoji': '🍼',
    'path': ROOT_PATH + 'img/emojis/game/baby-bottle.svg'
  },
  {
    'name': 'motor scooter',
    'emoji': '🛵',
    'path': ROOT_PATH + 'img/emojis/game/motor-scooter.svg'
  },
  {
    'name': 'magnifying glass',
    'emoji': '🔎',
    'path': ROOT_PATH + 'img/emojis/game/magnifying-glass.svg'
  },
  {
    'name': 'jack o lantern',
    'emoji': '🎃',
    'path': ROOT_PATH + 'img/emojis/game/jack-o-lantern.svg'
  }
];

// Items for the demo are always selected in the same order as they are defined
// here.
export const EMOJIS_LVL_DEMO: Array<EmojiItem> = [
  {
    'name': 'watch',
    'emoji': '⌚',
    'path': ROOT_PATH + 'img/emojis/game/watch.svg'
  },
  {
    'name': 'shoe',
    'emoji': '👞',
    'path': ROOT_PATH + 'img/emojis/game/shoe.svg'
  },
  {
    'name': 'banana',
    'emoji': '🍌',
    'path': ROOT_PATH + 'img/emojis/game/banana.svg'
  },
  {
    'name': 'beer',
    'emoji': '🍺',
    'path': ROOT_PATH + 'img/emojis/game/beer.svg'
  },
  {
    'name': 'jack o lantern',
    'emoji': '🎃',
    'path': ROOT_PATH + 'img/emojis/game/jack-o-lantern.svg'
  }
];
