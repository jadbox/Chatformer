class Room():
	def __init__(self, name, conn):
		self.name = name
		self.ppl = set()
		self.conn = conn
	
	def getUsers(self):
		pplList = []
		for person in self.ppl:
			pplList.append("%s " % person.user)
		return ''.join(pplList)

	def numUsers(self):
		return len(self.ppl)

	def add(self, person):
		self.broadcast("%s joined." % person.user)
		self.ppl.add(person)

	def remove(self, person):
		self.ppl.remove(person)
		self.broadcast("%s left." % person.user)

	def say(self, person, msg):
		self.conn.broadcast(self.ppl, "%s: %s" % (person.user, msg))

	def broadcast(self, msg):
		self.conn.broadcast(self.ppl, msg)