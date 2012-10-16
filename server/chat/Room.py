class Room():
	def __init__(self, name, conn):
		self.name = name
		self.ppl = set()
		self.conn = conn

	def add(self, person):
		self.broadcast("Someone joined.")
		self.ppl.add(person)

	def remove(self, person):
		self.ppl.remove(person)
		self.broadcast("Someone left.")

	def broadcast(self, msg):
		self.conn.broadcast(self.ppl, msg)