import os
import requests
import json
from datetime import datetime
from typing import Any, Dict

class SheetsService:
    """
    Service for integrating with Google Sheets via a web app script webhook.
    """

    def append_applicant(self, record: Dict[str, Any]) -> bool:
        """
        Sends a flattened applicant record to the Google Sheets webhook.
        Returns True if successful, False otherwise.
        """
        webhook_url = os.environ.get("GOOGLE_SHEETS_WEBHOOK_URL")
        
        if not webhook_url:
            print("Warning: GOOGLE_SHEETS_WEBHOOK_URL not set. Skipping Sheets integration.")
            return False

        try:
            # Send the record as JSON to the configured webhook
            response = requests.post(
                webhook_url,
                json=record,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            response.raise_for_status()
            return True
        except Exception as e:
            print(f"Error appending to Google Sheets: {str(e)}")
            return False
