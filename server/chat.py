# -*- coding: utf-8 -*-
"""
    Simple sockjs-tornado chat application. By default will listen on port 8080.
"""
from tornado import web, ioloop
from shared.CFdatabase import CFdatabase
from shared.CFsession import CFsession
from chat.Room import Room
import sockjs.tornado
from sockjs.tornado import SockJSRouter, SockJSConnection, conn, session
from sockjs.tornado.transports import base

r = CFdatabase()
sessions = CFsession(r)

class ChatConnection(SockJSConnection):
    import logging
    #"""Chat connection implementation"""
    # Class level variable
    participants = dict()

    def __init__(self, session):
        self.room = ""
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
        logging.getLogger().debug("Authed user:%s" % (name))
        # Add client to the clients list
        self.join_room("root") #default root

    def on_message(self, message):
        op = message[:6]
        if op=="#room ":
            self.current().remove(self)
            self.join_room(message[6:])
        else: self.current().broadcast(message)
       #parts = message.split(",", 1)
        #logging.getLogger().debug("%s %s" % (parts, len(parts)))
        #if len(parts) < 2: return
        #op, data = parts[0], parts[1]
        # Broadcast message

    def join_room(self, data):
        if not data or data == self.room: return
        self.room = data
        if not self.room in self.participants: self.participants[self.room] = Room(data, self)
        self.current().add(self)
        logging.getLogger().debug("joinging room:%s" % self.room)

    def on_close(self):
        if not self.room in self.participants: return
        # Remove client from the clients list and broadcast leave message
        self.current().remove(self)

    def current(self):
        return self.participants[self.room]

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
