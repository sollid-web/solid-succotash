"""Optional Resend smoke test.

Skipped unless RUN_RESEND_TEST=1 is set. Uses the verified mail.wolvcapital.com domain.
"""

import os

import pytest
import resend

if os.environ.get("RUN_RESEND_TEST") != "1":
    pytest.skip("Resend smoke test skipped; set RUN_RESEND_TEST=1 to run", allow_module_level=True)

api_key = os.environ.get("RESEND_API_KEY")
if not api_key:
    pytest.skip("RESEND_API_KEY not set; skipping", allow_module_level=True)

resend.api_key = api_key


def test_resend_smoke():
    response = resend.Emails.send(
        {
            "from": "WolvCapital <noreply@mail.wolvcapital.com>",
            "to": [os.environ.get("RESEND_TEST_TO", "devnull@example.com")],
            "subject": "Resend activated",
            "html": "<p>Resend is live.</p>",
        }
    )

    assert response is not None
