from decimal import Decimal, InvalidOperation
from django import template

register = template.Library()


def _to_decimal(value):
    if isinstance(value, Decimal):
        return value
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal('0.00')


@register.filter(name='currency')
def currency(value, symbol='$'):
    """
    Format a number as currency with thousands separators and 2 decimal places.

    Usage in templates:
        {{ amount|currency }}
        {{ amount|currency:"€" }}
    """
    amount = _to_decimal(value).quantize(Decimal('0.01'))
    # Use Python formatting to add grouping
    return f"{symbol}{amount:,.2f}"
