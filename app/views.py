from flask import render_template
from app import app
import os
import requests
import json
import datetime
from collections import OrderedDict

registry_path = "/var/lib/docker-registry/"

@app.route('/')
@app.route('/index')
def index():
    registry_path = app.reg_path
    repositories = set()
    images = {}
    repos_path = os.path.join(registry_path, 'repositories')
    for d in os.listdir(repos_path):
        
        imgs_arr = []
        for i in os.listdir(os.path.join(repos_path, d)):
            
            image_path = os.path.join(repos_path, d, i)
            tags = []
            latest = "None"
            date = None
            for t in os.listdir(image_path):
                if not t.startswith("tag_"):
                    continue
                id = None
                with open(os.path.join(image_path, t), 'r') as f:
                    id = f.read()

                if t[4:] == "latest":
                    latest = id
                tags.append({'name':t[4:], 'id': id, 'pull': app.reg_prefix+"/"+d+"/"+i+":"+t[4:]})

            path = os.path.join(image_path, "json")
            if os.path.exists(os.path.join(image_path, "taglatest_json")):
                path = os.path.join(image_path, "taglatest_json")
            if os.path.exists(path):
                with open(path, 'r') as f_latest:
                    js = json.load(f_latest)
                    value = datetime.datetime.fromtimestamp(js['last_update'])
                    date = value.strftime('%Y-%m-%d %H:%M:%S')
            if len(tags) == 0:
                continue

            imgs_arr.append({'name':i, 'latest': latest, 'short_id':latest[0:12],'last_update': date, 'tags': tags})
        if len(imgs_arr) > 0:
            repositories.add(d)
            images[d] = imgs_arr
    return render_template("index.html", data = OrderedDict(sorted(images.items())), repos = sorted(repositories), prefix = app.reg_prefix, title = "Registry Face")
