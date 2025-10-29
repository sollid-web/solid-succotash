"""
Security test for HTML escaping in email templates
"""
from django.test import TestCase
from django.template import Context, Template
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailSecurityTests(TestCase):
    """Test security aspects of email templates"""
    
    def _render_base_template(self, context):
        """Helper method to load and render the base email template"""
        with open('templates/emails/base_email.html', 'r') as f:
            template_content = f.read()
        
        template = Template(template_content)
        return template.render(Context(context))
        
    def test_brand_name_html_escaping(self):
        """Test that brand_name is properly HTML escaped in templates"""
        # Test with potentially malicious brand name
        malicious_brand_name = '<script>alert("XSS")</script>WolvCapital'
        
        # Mock the context with malicious brand name
        context = {
            'brand_name': malicious_brand_name,
            'brand_config': {},
            'current_year': 2025,
            'site_url': 'https://wolvcapital.com'
        }
        
        # Load and render the base template
        rendered = self._render_base_template(context)
        
        # Check that the script tag is escaped
        self.assertNotIn('<script>alert("XSS")</script>', rendered)
        self.assertIn('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;WolvCapital', rendered)
        
        # Verify the brand name appears in multiple escaped locations
        escaped_locations = rendered.count('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;WolvCapital')
        self.assertGreaterEqual(escaped_locations, 3)  # title, header, footer
        
    def test_tagline_html_escaping(self):
        """Test that brand tagline is properly HTML escaped"""
        # Test with potentially malicious tagline
        malicious_tagline = '<img src=x onerror="alert(\'XSS\')">'
        
        context = {
            'brand_name': 'WolvCapital',
            'brand_config': {'tagline': malicious_tagline},
            'current_year': 2025,
            'site_url': 'https://wolvcapital.com'
        }
        
        # Load and render the base template
        rendered = self._render_base_template(context)
        
        # Check that the img tag is escaped
        self.assertNotIn('<img src=x onerror="alert(\'XSS\')">', rendered)
        self.assertIn('&lt;img src=x onerror=&quot;alert(&#x27;XSS&#x27;)&quot;&gt;', rendered)
        
    def test_user_email_escaping_in_footer(self):
        """Test that user email is properly handled in footer"""
        # Mock user with potentially problematic email
        class MockUser:
            email = 'test+<script>alert("XSS")</script>@example.com'
        
        context = {
            'user': MockUser(),
            'brand_name': 'WolvCapital',
            'brand_config': {},
            'current_year': 2025,
            'site_url': 'https://wolvcapital.com'
        }
        
        # Load and render the base template
        rendered = self._render_base_template(context)
        
        # Check that the email is displayed (Django auto-escapes user.email)
        self.assertIn('test+&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;@example.com', rendered)
        
    def test_safe_brand_name_not_double_escaped(self):
        """Test that normal brand names are not double-escaped"""
        context = {
            'brand_name': 'WolvCapital & Co.',
            'brand_config': {'tagline': 'Invest & Grow'},
            'current_year': 2025,
            'site_url': 'https://wolvcapital.com'
        }
        
        # Load and render the base template
        rendered = self._render_base_template(context)
        
        # Check that ampersands are properly escaped but readable
        self.assertIn('WolvCapital &amp; Co.', rendered)
        self.assertIn('Invest &amp; Grow', rendered)