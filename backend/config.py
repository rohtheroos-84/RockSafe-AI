import os
from dotenv import load_dotenv

load_dotenv()

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', 'your_account_sid').strip()
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', 'your_auth_token').strip()
TWILIO_FROM_NUMBER = (
    os.getenv('TWILIO_FROM_NUMBER')
    or os.getenv('TWILIO_PHONE_NUMBER')
    or '+1234567890'
).strip()

# Emergency Contact Phone Numbers (comma separated list in env var)
emergency_contacts_env = os.getenv('EMERGENCY_CONTACTS', '').strip()
EMERGENCY_CONTACTS = [
    contact.strip()
    for contact in emergency_contacts_env.split(',')
    if contact.strip()
]

# Helper used by status endpoints and startup checks.
TWILIO_CONFIGURED = (
    TWILIO_ACCOUNT_SID not in ('', 'your_account_sid')
    and TWILIO_AUTH_TOKEN not in ('', 'your_auth_token', '[AuthToken]')
    and TWILIO_FROM_NUMBER not in ('', '+1234567890')
)

# SMS Alert Messages
ALERT_MESSAGES = {
    'CRITICAL': {
        'body': '🚨 CRITICAL ROCKFALL ALERT!\nIMMEDIATE EVACUATION REQUIRED!- RockSafe AI',
        'subject': 'CRITICAL ROCKFALL ALERT - EVACUATE NOW!'
    },
    'HIGH': {
        'body': '⚠️ HIGH ROCKFALL RISK\nUrgent assessment needed!- RockSafe AI',
        'subject': 'HIGH RISK ROCKFALL ALERT - URGENT ACTION REQUIRED'
    }
}

# SMS Feature Toggle
SMS_ALERTS_ENABLED = os.getenv('SMS_ALERTS_ENABLED', 'true').lower() == 'true'