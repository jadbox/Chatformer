import redis
class CFdatabase():
	def __init__(self):
		self.db = redis.StrictRedis(host='localhost', port=6379, db=0)

	def userSave(self, name, data):
		if name=="sessions": return False
		self.db.hmset(name, data)
		self.db.save()
		return True

	def userGet(self, name):
		return self.db.hgetall(name)

	def userExists(self, name):
		return self.db.exists(name)

	def deleteUser(self, name):
		if name=="sessions": return false
		self.db.delete(name)

	def saveSession(self, name, key):
		self.db.hset("sessions", name, key)

	def hasSession(self, name, key):
		return self.db.hget("sessions", name) == key

	def deleteSession(self, name):
		self.db.hdel("sessions", name)

	#def makeRoom(self, room):
