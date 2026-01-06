import resend
import os

resend.api_key = os.environ.get("RESEND_API_KEY")

response = resend.Emails.send({
    "from": "WolvCapital <noreply@wolvcapital.com>",
    "to": ["your@email.com"],
    "subject": "Resend activated",
    "html": "<p>Resend is live.</p>",
})

print(response)
