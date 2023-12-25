# Text_Analyzer

## Install in local

### Install environment

```commandline
python.exe -m pip install --upgrade pip
pip install poetry
poetry install
```
### Download model
```commandline
python app/src/download_model.py
```

### Create and run rabbitmq image
```commandline
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
```

### Create queues
```commandline
python app/src/create_channels.py
```

### Do next parallel

#### Create file queue listener
```commandline
python app/src/rabbircosume.py -hostn localhost
```

#### Run tags getter from queue
```commandline
python app/src/get_tags_from_queue.py
```

## Install in docker
1. После установки Docker нужно открыть консоль и перейти в расположение проекта, создать образ (image)

```bash
docker build -t your_image_name .
```

2. You can change parameters:
    - 'version' - model_version in app/modelparams.yaml
    - 'Host IP' - --hostn in Dockerfile

3. Далее создаётся контейнер

```bash
docker run -d --name your_container_name -p your_port_number:80 your_image_name
```

## Работа

Для работы с RabbitMQ необходимо перейти по адресу в браузере:

- **http://localhost:15672/#/** на локальной машине,

- **http://your_local_IP:15672/#/** на другом компьютере в локальной сети,

- **http://global_IP:15672/#/** при хостинге.

Ввести логин и пароль:
   - Логин: guest
   - Пароль: guest