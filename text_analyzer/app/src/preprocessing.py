import re
import nltk
from pymorphy3 import MorphAnalyzer
from nltk.corpus import stopwords
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)

class Pipeline:
    def __init__(self):
        with open('app/model/tags_names.txt', encoding='utf8') as f:
            self.tags_names = f.read().split(',')
        self.patterns = "[A-Za-z0-9!#$%&'()*+,./:;<=>?@[\]^_`{|}~—\"\-]+"
        self.stopwords_ru = stopwords.words("russian")
        self.morph = MorphAnalyzer()
        self.model = pickle.load(open("app/model/model.pkl", "rb"))
        self.tags_embs = np.load('app/model/tags_embs.npy')
        self.tags = ''
        self.text = ''

    def _softmax(self, l):
        summ = l.sum()
        if summ != 0:
            l_to_return = [i/summ for i in l]
            return l_to_return
        return l

    def _preprocess_text(self):
        self.text = re.sub(self.patterns, ' ', self.text)
        tokens = []
        for token in self.text.split():
            if token and token not in self.stopwords_ru:
                token = self.morph.normal_forms(token)[0]
                tokens.append(token)
        self.text = ' '.join(tokens)

    def _get_predictions(self):
        text_emb = self.model.transform([self.text])
        cosine_sim = np.array([cosine_similarity(tag_emb, text_emb)[0][0] for tag_emb in self.tags_embs])
        softmax_result = self._softmax(cosine_sim)
        tags = dict([(key, value) for i, (key, value) in enumerate(zip(self.tags_names, softmax_result))])
        if max(tags.values()) == 0:
            self.tags = tags
        tags = dict(sorted(tags.items(), key=lambda item: item[1]))
        
        self.tags = {k:tags[k] for k in list(tags.keys())[-6:] if tags[k]!=0}

    def process(self):
        self._preprocess_text()
        self._get_predictions()

    def set_text(self, text):
        self.text = text

    def get_tags(self):
        return self.tags
