from recaptcha.client import captcha

def get_client_address(environ):
	#self.environ.get(
    try:
        return environ['HTTP_X_FORWARDED_FOR'].split(',')[-1].strip()
    except KeyError:
    	try:
    		if environ['X-Real-IP']: return environ['X-Real-IP']
    	except KeyError:
        	return environ['REMOTE_ADDR']

def validate(request):
		recaptcha_challenge_field  = request.forms.recaptcha_challenge_field
		recaptcha_response_field  = request.forms.recaptcha_response_field
		#ip = "76.14.68.131" 
		ip = get_client_address(request)
			
		# response is just the RecaptchaResponse container class. You'll need 
		# to check is_valid and error_code
		response = captcha.submit(
			recaptcha_challenge_field,
			recaptcha_response_field,
			"6LfFiNcSAAAAAJlAWlGG2Tmmg9TfISe3DsQ_MKzy",
			ip)

		if response.is_valid:
			#redirect to where ever we want to go on success
			return -1;

		if response.error_code:
			# this tacks on the error to the redirect, so you can let the
			# user knowwhy their submission failed (not handled above,
			# but you are smart :-) )
			#raise cherrypy.HTTPRedirect(
			#    "display_recaptcha?error=%s"%response.error_code)
			return "%s %s %s" % (recaptcha_challenge_field, recaptcha_response_field, ip)
			#return response.error_code;

