import requests
import urllib
import json

import yaml
from yaml.loader import SafeLoader

PARAMS_PATH = 'app/model_params.yaml'

def download_file(file_name, target_folder):
    url = ('https://cloud-api.yandex.net/v1/disk/public/resources/download' +
           '?public_key=' + urllib.parse.quote(
           folder_url) + '&path=/' + urllib.parse.quote(file_name))
    r = requests.get(url)
    h = json.loads(r.text)['href']
    urllib.request.urlretrieve(h, target_folder)

with open(PARAMS_PATH, 'r') as f:
    paryaml = yaml.load(f, Loader=SafeLoader)

folder_url = paryaml['public_folder_url']
folder_path = str(paryaml['version']) + '/'
model_file = folder_path + 'model.pkl'
tags_embs = folder_path + 'tags_embs.npy'
tags_names = folder_path + 'tags_names.txt'

download_file(model_file, 'app/model/model.pkl')
download_file(tags_embs, 'app/model/tags_embs.npy')
download_file(tags_names, 'app/model/tags_names.txt')
