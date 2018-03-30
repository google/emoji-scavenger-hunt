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

## Build your own model
You can build your own image recognition model by running a Docker container.
Dockerfiles are in `training` directory.

Prepare images for training by dividing them into directories for each label
name that you want to train.
For example: the directory structure for training *cat* and *dog* will look as
follows assuming image data is stored under `data/images`.

```
data
└── images
    ├── cat
    │   ├── cat1.jpg
    │   ├── cat2.jpg
    │   └── ...
    └── dog
        ├── dog1.jpg
        ├── dog2.jpg
        └── ...
```

Once the sample images are ready, you can kickstart the training by building and
running the Docker container.

```
$ cd training
$ docker build -t model-builder .
$ docker run -v /path/to/data:/data -it model-builder
```

After the training is completed, you'll see three files in the
`data/saved_model_web` directory:

- web_model.pb (the dataflow graph)
- weights_manifest.json (weight manifest file)
- group1-shard\*of\* (collection of binary weight files)

They are SavedModel files in a web-friendly format converted by the
[TensorFlow.js converter](https://github.com/tensorflow/tfjs-converter).
You can build your own game using your own custom image recognition model by replacing
the corresponding files under the `dist/model/` directory with the newly generated ones.

You also need to update `src/js/scavenger_classes.ts` in order to update the
label outputs from the custom model with human-readable strings.
Update the game logic in `src/js/game.ts` if needed.

### Using GPU
You can boost the training speed by utilizing your GPU.
If you want to use the GPU for training, install
[nvidia-docker](https://github.com/NVIDIA/nvidia-docker) and run:
```
$ cd training
$ nvidia-docker build -f Dockerfile.gpu model-builder
$ nvidia-docker run -v /path/to/data:/data -it model-builder
```

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
