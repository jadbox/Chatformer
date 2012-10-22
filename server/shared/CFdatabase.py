import redis
class CFdatabase():
	def __init__(self):
		self.db = redis.StrictRedis(host='localhost', port=6379, db=0)

	def userSave(self, name, data):
		self.db.hmset("users", name, data)

	def userGet(self, name):
		return self.db.hmget("users", name)

	def userExists(self, name):
		return self.db.hexists("users", name)

	def deleteUser(self, name):
		self.db.hdel("users", name)

	def saveSession(self, name, key):
		self.db.hset("sessions", name, key)

	def hasSession(self, name, key):
		return self.db.hget("sessions", name) == key

	def deleteSession(self, name):
		self.db.hdel("sessions", name)
