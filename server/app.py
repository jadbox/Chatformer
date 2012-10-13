#def application(environ, start_response):
#    start_response("200 OK", [("Content-Type", "text/plain")])
#    return ["Hello World!"]

#import bottle
from bottle import app, route, run, default_app, request
import json
from CFdatabase import CFdatabase
from CFsession import CFsession
from passlib.hash import sha256_crypt
from datetime import date

import string
import logging

db = CFdatabase()
sessions = CFsession(db)

@route('/api/logout/<name>', method='POST')
def logout(name):
	token = request.forms.auth_token
	if sessions.verify(name, token): sessions.delete(name)
	return {'status':'success'}

@route('/api/save/<name>', method='POST')
def save_name(name):
	#cap_validate = validate(request)
	#if cap_validate!=-1: 
#		return {'status':'captcha '+ cap_validate}
	name = string.lower(name)
	pwd = request.forms.pwd or ''
	if pwd.__len__() > 24 or pwd.__len__() < 1:
		return {'status':'Password size error.'}
	if name.__len__() > 24 or name.__len__() < 1:
		return {'status':'Name size error.'}
	if request.forms.pwdc != pwd:
		return {'status':'password confirmation does not match.'}
	if db.userExists(name)==True:
		return {'status':'exists'}
	pwd_crypt = sha256_crypt.encrypt(pwd)
	data = {"pwd":pwd_crypt, "created":"%s"%date.today()}
	data["ip"] = request['REMOTE_ADDR']
	db.userSave(name, data)
	return {'status':'success'}

@route('/api/get/<name>', method='POST')
def get_name(name):
	name = string.lower(name)
	pwd = request.forms.pwd
	if db.userExists(name)==False: return {"status":"invalid"}

	data = db.userGet(name)
	correct = sha256_crypt.verify(pwd, data["pwd"])
	if correct==False: return {"status":"invalid"}
	resp = {"status":"success", "name":name, "created":data["created"], "auth_token":sessions.make(name)}

	#logging.getLogger().debug("Fetched user: %s" % name)
	return resp

@route('/api')
def root():
    return "sup"

application = app()
logging.getLogger().setLevel(logging.DEBUG)
