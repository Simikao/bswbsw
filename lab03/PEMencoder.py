import requests
import json


def convert_public_key(text):
    line_length = 64
    lines = []
    for i in range(0, len(text), line_length):
        lines.append('"' + text[i : i + line_length] + '\\n"' + " +" "\n")
    return (
        '"-----BEGIN PUBLIC KEY-----\\n" +\n'
        + "".join(lines)
        + '"-----END PUBLIC KEY-----\\n"\n'
    )


REALM_URL = "http://localhost:8080/realms/master"
response = requests.get(REALM_URL)
data = json.loads(response.content.decode("utf-8"))
print(convert_public_key(data["public_key"]))
