import uuid
class CFsession():
	def __init__(self, cfserver):
		self.cfserver = cfserver

	def make(self, name):
		hash = str(uuid.uuid4())
		self.cfserver.sessionSave(name, hash)
		return hash

	def verify(self, name, auth_token):
		return self.cfserver.sessionVerify(name, auth_token)

	def delete(self, name):
		self.cfserver.sessionDelete(name)
