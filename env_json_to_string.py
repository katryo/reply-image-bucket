import os
import base64

with open('.env.local.json') as f:
  s = ''.join(f.read().splitlines())
  message_bytes = s.encode('utf-8');
  encoded = base64.b64encode(message_bytes)
  encoded_string = encoded.decode('utf-8')
  print(encoded_string)

  encoded_encoded = encoded_string.encode('utf-8')
  decoded = base64.b64decode(encoded_encoded);
  output = decoded.decode('utf-8')