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

	def updateUsers(self):
		self.broadcast("..users %s" % self.getUsers());

	def add(self, person):
		self.broadcast("%s joined." % person.user) # take out soon
		self.broadcast("%s: ..joined %s" % (person.user,person.user)) 
		self.ppl.add(person)
		self.updateUsers()

	def remove(self, person):
		if not person in self.ppl: return
		self.ppl.remove(person)
		self.broadcast("%s left." % person.user) # take out soon
		self.broadcast("%s: ..left %s" % (person.user,person.user))
		self.updateUsers()

	def say(self, person, msg):
		self.conn.broadcast(self.ppl, "%s: %s" % (person.user, msg))

	def broadcast(self, msg):
		self.conn.broadcast(self.ppl, msg)