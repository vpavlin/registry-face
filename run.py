#!/usr/bin/python3
from app import app
import argparse


parser = argparse.ArgumentParser()
parser.add_argument("-p", "--port", dest="port", default=5000)
parser.add_argument("-t", "--host", dest="host", default="127.0.0.1") 
parser.add_argument("-d", "--debug", dest="debug", action="store_true", default=False)
parser.add_argument("--prefix", dest="prefix", default="") 
parser.add_argument("--path", dest="path", default="/home/vpavlin/tmp/docker-registry") 

args = parser.parse_args()

app.reg_prefix = args.prefix
app.reg_path = args.path
app.run(host=args.host, port=args.port, debug=args.debug)
