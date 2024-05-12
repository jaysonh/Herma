import logging, sys
import cgi
import urllib.parse
import base64
#import cv2
import subprocess

def cgiFieldStorageToDict(fieldStorage):
   """ Get a plain dictionary rather than the '.value' system used by the 
   cgi module's native fieldStorage class. """
   params = {}
   for key in fieldStorage.keys(  ):
      params[key] = fieldStorage[key].value
   return params

def application(environ, start_response):
    handler = logging.StreamHandler(stream=sys.stderr)
    log = logging.getLogger(__name__)
    log.setLevel(logging.INFO)
    log.addHandler(handler)


    if environ['REQUEST_METHOD'] == 'POST':
        post_env = environ.copy()
        post_env['QUERY_STRING'] = ''

        post = cgi.FieldStorage(
            fp=environ['wsgi.input'],
            environ=post_env,
            keep_blank_values=False
        )
        log.info("\n\n")
        dict = cgiFieldStorageToDict(post)
        #log.info(f"dict is {dict['json']}")
        image_data = dict['json']

        
        
        png_recovered = base64.b64decode (image_data)

        with open("/var/www/html/images/image.png", 'wb') as f:
            f.write(png_recovered)   

        #result_img = cv2.bitwise_not(image)
        #cv2.imwrite("/var/www/html/image.png",result_img)
    else:
        log.info("not POST")

    log.info(f"python version: {sys.version}")

    sys.stderr.write("running on server")
    print( 'running python script on server')
    status = '200 OK'
    output = b'Hello World from python!\n'
    response_headers = [('Content-type', 'text/plain'), ('Content-Length', str(len(output)))]
    start_response(status, response_headers)
    return [output]


