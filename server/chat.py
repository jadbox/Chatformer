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
        self.join_room("lobby") #default root

    def on_message(self, message):
        if message[:7]=="..room ":
            self.current().remove(self)
            room_name = string.lower(message[7:])
            self.join_room(room_name)
            self.send("..room %s" % room_name)
        elif message[:7]=="..users":
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
        self.room = data
        if not self.room in self.rooms: self.rooms[self.room] = Room(data, self)
        self.current().add(self)
        logging.getLogger().debug("joinging room:%s" % self.room)
        db.roomInc(self.room)
        self.show_users()

    def leave_room(self):
        if self.room != "": db.roomDec(self.room)

    def on_close(self):
        if not self.room in self.rooms: return
        self.leave_room();
        # Remove client from the clients list and broadcast leave message
        self.current().remove(self)

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
