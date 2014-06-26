from flask import render_template
from app import app
import os
import requests
import json
import datetime

#registry_path = "/var/lib/docker-registry/"
registry_path = "/home/vpavlin/tmp/docker-registry"

@app.route('/')
@app.route('/index')
def index():
#    response = requests.get('http://docker-registry.usersys.redhat.com/v1/search')
#    data = response.json()
    repositories = set()
    images = {}
#    for image in data['results']:
#        repo = image["name"].split('/')
#        repo_name = "No namespace"
#        if repo[0] != image["name"]:
#            repo_name = repo[0]
#        repositories.add(repo_name)
#        r = requests.get('http://docker-registry.usersys.redhat.com/v1/repositories/'+image['name']+'/tags/latest')
#        image['id'] = r.text
#        if repo_name in images:
#            images[repo_name].append(image)
#        else:
#            images[repo_name] = [image]

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
                tags.append({'name':t[4:], 'id': id, 'pull': "docker-registry.usersys.redhat.com/"+d+"/"+i+":"+t[4:]})

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
    return render_template("index.html", data = images, repos = sorted(repositories), title = "Registry Face")
