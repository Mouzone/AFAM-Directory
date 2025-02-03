GET http://127.0.0.1:5001/afam-directory/us-central1/getCollection?type="students"
HTTP 200
# Capture the CSRF token value from html body.
[Captures]
csrf_token: xpath "normalize-space(//meta[@name='_csrf_token']/@content)"