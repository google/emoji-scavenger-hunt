FROM tensorflow/tensorflow:1.13.1-py3
# Replace this line with `tensorflow/tensorflow:1.13.1-gpu-py3`
# and run with `docker --gpus` when you use GPUs.

LABEL maintainer="Shuhei Iitsuka <tushuhei@google.com>"

RUN apt update

RUN apt install -y curl

RUN pip3 install -U pip

RUN pip3 install keras==2.2.2 tensorflow_hub==0.1.1 h5py==2.8.0

RUN pip3 install --no-deps tensorflowjs==0.8.6

WORKDIR /

RUN curl -O https://raw.githubusercontent.com/tensorflow/tensorflow/v1.7.1/tensorflow/examples/image_retraining/retrain.py

CMD python3 /retrain.py \
        --image_dir /data/images \
        --how_many_training_steps=4000 \
        --eval_step_interval=100 \
        --architecture mobilenet_0.25_224 \
        --output_graph /data/graph.pb \
        --summaries_dir /data/summaries \
        --output_labels /data/output_labels.txt \
        --bottleneck_dir /data/bottleneck/ \
        --intermediate_store_frequency 1000 \
        --intermediate_output_graphs_dir /data/intermediate \
        --saved_model_dir /data/saved_model && \
    echo 'export const SCAVENGER_CLASSES: {[key: number]: string} = {' > /data/scavenger_classes.ts && \
    awk '{print NR-1  ": '\''" $0 "'\'',"}' /data/output_labels.txt >> /data/scavenger_classes.ts && \
    echo '}' >> /data/scavenger_classes.ts && \
    python3 -m tensorflowjs.converters.converter \
        --input_format=tf_saved_model \
        --output_node_names='final_result' \
        --saved_model_tags=serve \
        /data/saved_model/ \
        /data/saved_model_web/
