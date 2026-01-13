from twilio.rest import Client
from datetime import datetime
import logging
from config import (
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER,
    EMERGENCY_CONTACTS, ALERT_MESSAGES, SMS_ALERTS_ENABLED
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SMSAlertService:
    def __init__(self):
        """Initialize Twilio client"""
        try:
            if TWILIO_AUTH_TOKEN == '[AuthToken]':
                logger.warning("Twilio auth token not configured. SMS alerts will be disabled.")
                self.client = None
            else:
                self.client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                logger.info("Twilio SMS service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Twilio client: {e}")
            self.client = None
    
    def get_risk_level(self, probability: float) -> str:
        """Determine risk level based on probability"""
        if probability >= 0.75:
            return 'CRITICAL'
        elif probability >= 0.5:
            return 'HIGH'
        elif probability >= 0.25:
            return 'MODERATE'
        else:
            return 'LOW'
    
    def should_send_alert(self, probability: float) -> bool:
        """Check if SMS alert should be sent based on risk level"""
        risk_level = self.get_risk_level(probability)
        return risk_level in ['HIGH', 'CRITICAL']
    
    def format_alert_message(self, probability: float, location: str = "Unknown", 
                           additional_data: dict = None) -> tuple:
        """Format the alert message based on risk level"""
        risk_level = self.get_risk_level(probability)
        
        if risk_level not in ALERT_MESSAGES:
            return None, None
        
        # Get current timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Format the message with dynamic data
        message_template = ALERT_MESSAGES[risk_level]
        body = message_template['body'].format(
            probability=round(probability * 100, 1),
            location=location,
            timestamp=timestamp
        )
        
        # For trial accounts, keep messages very short
        # Skip additional data and footer to avoid length limits
        
        return body, message_template['subject']
    
    def send_sms_alert(self, probability: float, location: str = "Unknown", 
                       phone_numbers: list = None, additional_data: dict = None) -> dict:
        """Send SMS alerts to specified phone numbers or default emergency contacts"""
        
        # Check if SMS alerts are enabled and client is available
        if not SMS_ALERTS_ENABLED or not self.client:
            logger.warning("SMS alerts are disabled or Twilio client not available")
            return {
                'success': False, 
                'message': 'SMS service not available',
                'sent_count': 0,
                'failed_count': 0,
                'details': []
            }
        
        # Check if alert should be sent based on risk level
        if not self.should_send_alert(probability):
            logger.info(f"Risk level too low for SMS alert. Probability: {probability}")
            return {
                'success': True,
                'message': 'Risk level below SMS alert threshold',
                'sent_count': 0,
                'failed_count': 0,
                'details': []
            }
        
        # Use provided phone numbers or default emergency contacts
        recipients = phone_numbers or EMERGENCY_CONTACTS
        
        if not recipients:
            logger.warning("No phone numbers configured for SMS alerts")
            return {
                'success': False,
                'message': 'No phone numbers configured',
                'sent_count': 0,
                'failed_count': 0,
                'details': []
            }
        
        # Format the alert message
        message_body, subject = self.format_alert_message(probability, location, additional_data)
        
        if not message_body:
            logger.error("Failed to format alert message")
            return {
                'success': False,
                'message': 'Failed to format alert message',
                'sent_count': 0,
                'failed_count': 0,
                'details': []
            }
        
        # Send SMS to all recipients
        results = []
        sent_count = 0
        failed_count = 0
        
        for phone_number in recipients:
            try:
                message = self.client.messages.create(
                    from_=TWILIO_FROM_NUMBER,
                    body=message_body,
                    to=phone_number
                )
                
                sent_count += 1
                results.append({
                    'phone_number': phone_number,
                    'status': 'sent',
                    'message_sid': message.sid,
                    'error': None
                })
                
                logger.info(f"SMS alert sent successfully to {phone_number}. SID: {message.sid}")
                
            except Exception as e:
                failed_count += 1
                results.append({
                    'phone_number': phone_number,
                    'status': 'failed',
                    'message_sid': None,
                    'error': str(e)
                })
                
                logger.error(f"Failed to send SMS to {phone_number}: {e}")
        
        return {
            'success': sent_count > 0,
            'message': f'SMS alerts sent to {sent_count}/{len(recipients)} recipients',
            'sent_count': sent_count,
            'failed_count': failed_count,
            'details': results,
            'risk_level': self.get_risk_level(probability),
            'probability': round(probability * 100, 1)
        }

# Global SMS service instance
sms_service = SMSAlertService()