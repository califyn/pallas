import base64
from email.mime.text import MIMEText

import google.auth
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ['https://mail.google.com/', 'https://www.googleapis.com/auth/gmail.send']
SERVICE_ACCOUNT_FILE = '/home/califyn/secrets/gmail_key.json'

credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)

delegated_credentials = credentials.with_subject('ali.cy@athemath.org')

def gmail_send_message():
    """Create and send an email message
    Print the returned  message id
    Returns: Message object, including message id

    Load pre-authorized user credentials from the environment.
    TODO(developer) - See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.
    """
    #try:
    service = build('gmail', 'v1', credentials=delegated_credentials)
    message = MIMEText('This is automated draft mail')
    message['To'] = 'califynic@gmail.com'
    message['From'] = 'ali.cy@athemath.org'
    message['Subject'] = 'Automated draft'
    # encoded message
    encoded_message = base64.urlsafe_b64encode(message.as_bytes()) \
        .decode()

    send_message = (service.users().messages().send
                    (userId="me", body={ 'raw': encoded_message }).execute())
    print(F'Message Id: {send_message["id"]}')
    return send_message


if __name__ == '__main__':
    gmail_send_message()
