# -*- coding: utf-8 -*-
"""
    Simple sockjs-tornado chat application. By default will listen on port 8080.
"""
from tornado import web, ioloop
from CFdatabase import CFdatabase
from CFsession import CFsession
import sockjs.tornado
from sockjs.tornado import SockJSRouter, SockJSConnection

r = CFdatabase()
sessions = CFsession(r)

class CloseConnection(SockJSConnection):
    def on_open(self, info):
        self.close()

    def on_message(self, msg):
        pass

class ChatConnection(SockJSConnection):
    #"""Chat connection implementation"""
    # Class level variable
    participants = set()

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
        self.broadcast(self.participants, "Someone joined.")
        self.participants.add(self)

    def on_message(self, message):
        # Broadcast message
        self.broadcast(self.participants, message)

    def on_close(self):
        # Remove client from the clients list and broadcast leave message
        self.participants.remove(self)

        self.broadcast(self.participants, "Someone left.")

if __name__ == "__main__":
    import logging
    logging.getLogger().setLevel(logging.DEBUG)

    # 1. Create chat router
    ChatRouter = SockJSRouter(ChatConnection, '/chat', user_settings={'verify_ip': True}) #
    CloseRouter = SockJSRouter(CloseConnection, '/close')

    # 2. Create Tornado application
    app = web.Application(ChatRouter.urls + CloseRouter.urls)

    # 3. Make Tornado app listen on port 8080
    app.listen(8080)

    # 4. Start IOLoop
    ioloop.IOLoop.instance().start()
