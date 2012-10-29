from bottle import app, route, run, default_app, request
import json
from shared.CFdatabase import CFdatabase
from shared.CFsession import CFsession
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
	name = string.lower(name) or ''
	pwd = request.forms.pwd or ''
	if pwd.__len__() > 24 or pwd.__len__() < 6:
		return {'status':'err1'}
	if name.__len__() > 24 or name.__len__() < 1 or " " in name or "." in name or ":" in name or "!" in name or "#" in name:
		return {'status':'err2'}
	if request.forms.pwdc != pwd:
		return {'status':'err4'}
	if db.userExists(name)==True:
		return {'status':'err3'}
	pwd_crypt = sha256_crypt.encrypt(pwd)
	data = {"pwd":pwd_crypt, "created":"%s"%date.today()}
	data["ip"] = request['REMOTE_ADDR']


	if "@" in request.forms.email and "." in request.forms.email and request.forms.email.__len__() > 4:
		data["email"] = request.forms.email
	else:
		return {'status':'err5'}

	data["credits"] = 10 # add def credits
	db.userSave(name, data)
	return {'status':'0'}

@route('/api/get/<name>', method='POST')
def get_name(name):
	name = string.lower(name)
	pwd = request.forms.pwd
	if db.userExists(name)==False: return {"status":"err6"}

	data = db.userGet(name)
	correct = sha256_crypt.verify(pwd, data["pwd"])
	if correct==False: return {"status":"err6"}
	resp = {"status":"0", "name":name, "created":data["created"], "auth_token":sessions.make(name)}

	#logging.getLogger().debug("Fetched user: %s" % name)
	return resp

@route('/api/rooms')
def get_rooms():
	return db.getRooms()

@route('/api')
def root():
    return "sup"

application = app()
logging.getLogger().setLevel(logging.DEBUG)
