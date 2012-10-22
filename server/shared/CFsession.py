import uuid
from shared.CFdatabase import CFdatabase

class CFsession():

	def __init__(self, db):
		self.db = db

	def verify(self, name, token):
		return self.db.hasSession(name, token)

	def delete(self, name):
		self.db.deleteSession(name)

	def	make(self, name):
		token = str(uuid.uuid4());
		self.db.saveSession(name, token)
		return token