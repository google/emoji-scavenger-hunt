# 👾 Emoji Scavenger Hunt 👾

Emoji Scavenger Hunt is an experimental web based game that makes use of TensorFlow.js to identify objects seen by your webcam or mobile camera in the browser. We show you emojis 🍌 ⏰ ☕️ 📱 and you have to find those objects in the real world before your timer runs out 🏆 👍.

Learn more about the experiment and try it for yourself at [g.co/emojiscavengerhunt](http://g.co/emojiscavengerhunt)


## Development

```sh
yarn prep
```

Running `yarn prep` will use yarn to get the right packages and setup the right folders. If you don't have [yarn](https://yarnpkg.com/lang/en/docs/install/) you can install it via homebrew (for Mac). If you’re already running node/npm with nvm (our recommendation) you can install yarn without node using `brew install yarn --without-node`.

In order to start local development we also require the installation of the [Google Cloud SDK](https://cloud.google.com/sdk/downloads) and associated [App Engine Components](https://cloud.google.com/appengine/docs/standard/python/download). These are used for the local webserver and pushing to app engine for static site hosting.

Once you have both installed you can run the local development server with:

```sh
yarn dev
```

This task uses `watchify` to continually watch for changes to JS and SASS files and recompiles them if any changes are detected. You can access the local development server at `http://localhost:3000/`

When building assets for production use:

```sh
yarn build
```

This will minify SASS and JS for serving in production.

## License

Copyright 2018 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Credits

This is an experiment and collaboration between Google Brand Studio and the [PAIR](https://ai.google/pair/) teams at Google.

## Final Thoughts

This is not an official Google product. We will do our best to support and maintain this experiment but your mileage may vary.

We encourage open sourcing projects as a way of learning from each other. Please respect our and other creators’ rights, including copyright and trademark rights when present, when sharing these works and creating derivative work.

If you want more info on Google's policy, you can find that [here](https://policies.google.com/)