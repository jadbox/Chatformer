#def application(environ, start_response):
#    start_response("200 OK", [("Content-Type", "text/plain")])
#    return ["Hello World!"]

#import bottle
from bottle import app, route, run, default_app, request
import redis
import json
from passlib.hash import sha256_crypt
from datetime import date
import string
r = redis.StrictRedis(host='localhost', port=6379, db=0)

@route('/api/save/<name>', method='POST')
def save_name(name):
	name = string.lower(name)
	pwd = request.forms.pwd
	pwd_crypt = sha256_crypt.encrypt(pwd)
	data = {"pwd":pwd_crypt, "created":"%s"%date.today()}
	r.delete(name)
	r.hmset(name, data)
	#r.pipeline().hmset(name, data).execute()
	#r.set(name, json.dumps(data))
	return {'status':'success'}

@route('/api/get/<name>', method='POST') #, method='POST'
def get_name(name):
	name = string.lower(name)
	pwd = request.forms.pwd
	if r.exists(name)==False: return {"status":"invalid"}
	#rdata = r.get(name)

	data = r.hgetall(name)
	#json.loads()
	correct = sha256_crypt.verify(pwd, data["pwd"])
	if correct==False: return {"status":"invalid"}
	resp = {"status":"success", "name":name, "created":data["created"]}
	return resp
	# sha256_crypt.verify("toomanysecrets", hash)

@route('/api/gettt/<name>')
def get_name(name):
	val = r.get(name)
	resp = {"name":name, "note":val}
	return resp

@route('/api')
def root():
    return "Hello World at root!"

application = app()
