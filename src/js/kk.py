import tornado.ioloop
import tornado.web
import os

class MainHandler(tornado.web.RequestHandler):
    SUPPORTED_METHODS = ("CONNECT", "GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
    def get99(self):
        city = self.get_argument("city")
        stop = self.get_argument("s")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        print city
        # print(check_on.value)
        response = 'test'
        self.write(response)
    def post(self):
        #print(self.get_argument('city'))
        #print(self.get_argument('s'))
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        print('hello')
        self.write('test')

def make_app():
    static_path = os.path.join(os.path.dirname(__file__),"static")
    return tornado.web.Application([
        (r"/api",MainHandler),
        (r"/(.*)",tornado.web.StaticFileHandler,{
            "path":static_path,
            "default_filename":"index.html"})
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(5050)
    tornado.ioloop.IOLoop.current().start()