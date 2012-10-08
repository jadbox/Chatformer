#def application(environ, start_response):
#    start_response("200 OK", [("Content-Type", "text/plain")])
#    return ["Hello World!"]

#import bottle
from bottle import app, route, run, default_app
import redis

r = redis.StrictRedis(host='localhost', port=6379, db=0)

@route('/api/save/<name>')
def save_name(name):
	r.set(name, 'created value')
	return 'Saved %s!' % name

@route('/api/get/<name>')
def get_name(name):
	val = r.get(name)
	resp = {}
	resp[name] = val
	return resp

@route('/api')
def root():
    return "Hello World at root!"

application = app()
