# -*- coding: utf-8 -*-
"""
    Simple sockjs-tornado chat application. By default will listen on port 8080.
"""
from tornado import web, ioloop
from shared.CFdatabase import CFdatabase
from shared.CFsession import CFsession
from chat.Room import Room
import sockjs.tornado
import string
from sockjs.tornado import SockJSRouter, SockJSConnection, conn, session
from sockjs.tornado.transports import base

db = CFdatabase()
sessions = CFsession(db)

class ChatConnection(SockJSConnection):
    import logging
    #"""Chat connection implementation"""
    # Class level variable
    rooms = dict()

    def __init__(self, session):
        self.room = ""
        self.user = ""
        super(ChatConnection, self).__init__(session)

    def on_open(self, info):
        # Send that someone joined
        #logging.getLogger().debug(info.cookies)
        auth_token = info.cookies["auth_token"].value #.replace("Set-Cookie: ", "")
        name = info.cookies["name"].value
        if sessions.verify(name, auth_token)==False:
            logging.getLogger().debug("Invalid Token, closing connection for: %s" % name)
            self.close()
            return
        self.user = name
        logging.getLogger().debug("Authed user:%s" % (name))
        # Add client to the clients list
        self.getRoom("profile").setApp("profile", True)
        self.getRoom("apphelp").setApp("apphelp", True)
        self.join_room("lobby")
        #self.current().appLocked = True #default root

    def on_message(self, message):
        op = message[:7]
        if op=="..room ":
            self.current().remove(self)
            room_name = string.lower(message[7:])
            self.join_room(room_name)
            
        elif op=="..users":
            self.show_users()

        else: self.current().say(self, message)
       #parts = message.split(",", 1)
        #logging.getLogger().debug("%s %s" % (parts, len(parts)))
        #if len(parts) < 2: return
        #op, data = parts[0], parts[1]
        # Broadcast message

    def show_users(self):
        self.send("..users %s" % self.current().getUsers())

    def join_room(self, data):
        if not data or data == self.room: return
        self.leave_room();
        self.room = self.getRoom(data).name;
        
        self.current().add(self)
        logging.getLogger().debug("joinging room:%s" % self.room)
        db.roomInc(self.room)
        self.send("..room %s" % self.current().name)
        #self.show_users() # not needed now
        return self.current()

    def getRoom(self, room):
        if not room in self.rooms: self.rooms[room] = Room(room, self)
        return self.rooms[room]

    def leave_room(self):
        if not self.room in self.rooms: return
        db.roomDec(self.room)
        roomName = self.room
        if self.room and self.current(): self.current().remove(self)
        room = self.rooms[roomName]
        if len(room.ppl) == 0 and not room.appLocked: 
            self.rooms[roomName] = None
            del self.rooms[roomName]

    def on_close(self):
        self.leave_room();
        # Remove client from the clients list and broadcast leave message

    def current(self):
        return self.rooms[self.room]

if __name__ == "__main__":
    import logging
    logging.getLogger().setLevel(logging.DEBUG)

    # 1. Create chat router
    ChatRouter = SockJSRouter(ChatConnection, '/chat', user_settings={'verify_ip': True}) #
    #CloseRouter = SockJSRouter(CloseConnection, '/close')

    # 2. Create Tornado application
    app = web.Application(ChatRouter.urls)

    # 3. Make Tornado app listen on port 8080
    app.listen(8080)

    # 4. Start IOLoop
    ioloop.IOLoop.instance().start()
