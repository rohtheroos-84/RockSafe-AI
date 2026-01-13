import os
from dotenv import load_dotenv

load_dotenv()

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', 'your_account_sid')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', 'your_auth_token')
TWILIO_FROM_NUMBER = os.getenv('TWILIO_FROM_NUMBER', '+1234567890')

# Emergency Contact Phone Numbers (consider moving to database)
EMERGENCY_CONTACTS = [
    '+918940142540',  
    '+918456023876',  
    '+917718032710', 
]

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