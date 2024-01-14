import pandas as pd
import re
import nltk
from pymorphy3 import MorphAnalyzer
from tqdm import tqdm
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import accuracy_score
from sklearn.metrics import f1_score

nltk.download('stopwords')
nltk.download('punkt')

with open('corp0.txt', encoding='utf-8') as f:
    lines = f.readlines()

data_don = pd.DataFrame(columns=['text', 'topic'])

# убираем посторонние пробелы и разделители
textl = []
topicl = []
for i in lines:
    topic = i.split(' ')[0][1:]
    text = ' '.join(i.split(' ')[1:])[:-1]
    textl.append(text)
    topicl.append(topic)

data_don['text'] = textl
data_don['topic'] = topicl

# чистимся от всех посторонних символов
patterns = "[A-Za-z0-9!#$%&'()*+,./:;<=>?@[\]^_`{|}~—\"\-]+"
stopwords_ru = stopwords.words("russian")
morph = MorphAnalyzer()

texts = data_don['text'].tolist()
all_tokens = []
for i in tqdm(range(len(texts))):
    text = re.sub(patterns, ' ', texts[i])
    tokens = []
    for token in text.split():
        if token and token not in stopwords_ru:
            token = morph.normal_forms(token)[0]
            tokens.append(token)
    all_tokens.append(' '.join(tokens))

data_ready = pd.DataFrame()
data_ready['text'] = all_tokens
data_ready['topic'] = data_don['topic'].tolist()

# делим выборку на трейн и тест и загоняем в tf-idf
X_train, X_test, y_train, y_test = train_test_split(data_ready['text'], data_ready['topic'], test_size=0.20, random_state=42)

vectorizer = TfidfVectorizer(max_features=200)
tfidf_model = vectorizer.fit_transform(X_train)

pol = []
pro = []
spo = []
cul = []
tech = []
eco = []
auto = []
sci = []
heal = []
country = []
fam = []
hous = []
ad = []

y = y_train.tolist()
for i in tqdm(range(len(X_train))):
    vec = np.array(tfidf_model[i].todense())
    if y[i] == 'политика':
        pol.append(vec)
    elif y[i] == 'происшествия':
        pro.append(vec)
    elif y[i] == 'спорт':
        spo.append(vec)
    elif y[i] == 'культура':
        cul.append(vec)
    elif y[i] == 'техника':
        tech.append(vec)
    elif y[i] == 'экономика':
        eco.append(vec)
    elif y[i] == 'автомобили':
        auto.append(vec)
    elif y[i] == 'наука':
        sci.append(vec)
    elif y[i] == 'здоровье':
        heal.append(vec)
    elif y[i] == 'страна':
        country.append(vec)
    elif y[i] == 'семья':
        fam.append(vec)
    elif y[i] == 'недвижимость':
        hous.append(vec)
    elif y[i] == 'реклама':
        ad.append(vec)

# находим медианну по классам
pol_median = np.median(np.array(pol), axis=0)
pro_median = np.median(np.array(pro), axis=0)
spo_median = np.median(np.array(spo), axis=0)
cul_median = np.median(np.array(cul), axis=0)
tech_median = np.median(np.array(tech), axis=0)
eco_median = np.median(np.array(eco), axis=0)
auto_median = np.median(np.array(auto), axis=0)
sci_median = np.median(np.array(sci), axis=0)
heal_median = np.median(np.array(heal), axis=0)
country_median = np.median(np.array(country), axis=0)
fam_median = np.median(np.array(fam), axis=0)
hous_median = np.median(np.array(hous), axis=0)
ad_median = np.median(np.array(ad), axis=0)

# прогоняем тестовые данные
test_data = vectorizer.transform(X_test)

pred = []
for i in tqdm(range(len(X_test))):
    mat_pred = np.array(test_data[i].todense())
    pol_cos = cosine_similarity(pol_median, mat_pred)
    pro_cos = cosine_similarity(pro_median, mat_pred)
    spo_cos = cosine_similarity(spo_median, mat_pred)
    cul_cos = cosine_similarity(cul_median, mat_pred)
    tech_cos = cosine_similarity(tech_median, mat_pred)
    eco_cos = cosine_similarity(eco_median, mat_pred)
    auto_cos = cosine_similarity(auto_median, mat_pred)
    sci_cos = cosine_similarity(sci_median, mat_pred)
    heal_cos = cosine_similarity(heal_median, mat_pred)
    country_cos = cosine_similarity(country_median, mat_pred)
    fam_cos = cosine_similarity(fam_median, mat_pred)
    hous_cos = cosine_similarity(hous_median, mat_pred)
    ad_cos = cosine_similarity(ad_median, mat_pred)

    best = np.argmax([pol_cos,
                      pro_cos,
                      spo_cos,
                      cul_cos,
                      tech_cos,
                      eco_cos,
                      auto_cos,
                      sci_cos,
                      heal_cos,
                      country_cos,
                      fam_cos,
                      hous_cos,
                      ad_cos])

    if best == 0:
        pred.append('политика')
    elif best == 1:
        pred.append('происшествия')
    elif best == 2:
        pred.append('спорт')
    elif best == 3:
        pred.append('культура')
    elif best == 4:
        pred.append('техника')
    elif best == 5:
        pred.append('экономика')
    elif best == 6:
        pred.append('автомобили')
    elif best == 7:
        pred.append('наука')
    elif best == 8:
        pred.append('здоровье')
    elif best == 9:
        pred.append('страна')
    elif best == 10:
        pred.append('семья')
    elif best == 11:
        pred.append('недвижимость')
    elif best == 12:
        pred.append('реклама')

print(f1_score(y_test, pred, average='weighted'))