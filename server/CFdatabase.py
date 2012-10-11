import redis

class CFdatabase():
	def __init__(self):
		self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

	def userGet(self, name):
		return self.r.hgetall(name)

	def userSave(self, name, data):
		self.userDelete(name)
		self.r.hmset(name, data)
		return True

	def userDelete(self, name):
		self.r.delete(name)
		return True

	def userExists(self, name):
		return self.r.exists(name)==True

	def sessionSave(self, name, token):
		self.r.hset("sessions", name, token)

	def sessionVerify(self, name, hash):
		return self.r.hget("sessions", name)==hash

	def sessionDelete(self, name):
		self.r.hdel("sessions", name)