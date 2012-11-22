class Room():
	def __init__(self, name, conn):
		self.name = name
		self.app = "setup"
		self.owner = None
		self.ppl = set()
		self.conn = conn
		self.appLocked = False
	
	def getUsers(self):
		pplList = []
		for person in self.ppl:
			pplList.append("%s " % person.user)
		return ''.join(pplList)

	def numUsers(self):
		return len(self.ppl)

	def updateUsers(self):
		self.broadcast("..users %s" % self.getUsers())

	def updateApp(self, app):
		if not self.appLocked and not app == self.app: 
			self.app = app
			self.changeApp(self.broadcast)
		#print "%s app" % app

	def changeApp(self, send=None):
		send("..app %s" % self.app)
		send("loading app... %s" % self.app)

	def add(self, person):
		#person.send("..app %s" % self.app)
		self.changeApp(person.send)
		self.broadcast("%s joined." % person.user) # take out soon
		self.broadcast("%s: ..joined %s" % (person.user,person.user)) 
		self.ppl.add(person)
		self.updateUsers()
		if self.numUsers()==1: 
			self.owner = person
			self.tellOwner()

	def tellOwner(self):
		self.owner.send("you are room owner.")
		self.owner.send("..owner")

	def remove(self, person):
		if not person in self.ppl: return
		self.ppl.remove(person)
		self.broadcast("%s left." % person.user) # take out soon
		self.broadcast("%s: ..left %s" % (person.user,person.user))
		self.updateUsers()
		if self.numUsers()==1: 
			for e in self.ppl:
				self.owner = e # lone user is now owner
				self.tellOwner()

	def replace(self, spliceTo, msg):
		import re
		msg=re.sub(r".*(?=%s)" % msg, '', msg)
		return msg.replace("..app ", "")

	def say(self, person, msg):
		if person==self.owner: 
			if "..app" in msg: 
				self.updateApp(self.replace("..app ", msg))
				return
		self.conn.broadcast(self.ppl, "%s: %s" % (person.user, msg))

	def broadcast(self, msg):
		self.conn.broadcast(self.ppl, msg)