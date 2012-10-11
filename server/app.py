#def application(environ, start_response):
#    start_response("200 OK", [("Content-Type", "text/plain")])
#    return ["Hello World!"]

#import bottle
from bottle import app, route, run, default_app, request
import redis
from passlib.hash import sha256_crypt

r = redis.StrictRedis(host='localhost', port=6379, db=0)

@route('/api/save/<name>')
def save_name(name):
	r.set(name, 'created value')
	return 'Saved %s!' % name
	# sha256_crypt.encrypt("toomanysecrets")

@route('/api/get/<name>', method='POST') #, method='POST'
def get_name(name):
	pwd = request.forms.pwd
	correct = pwd=="test"
	val = r.get(name)
	resp = {"name":name, "note":val, "pwdIsCorrect":correct}
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
