"""
Rate limiting configuration for Toneo API.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

# Create limiter instance using client IP
limiter = Limiter(key_func=get_remote_address)

# Rate limit constants
TTS_RATE_LIMIT = "30/minute"  # 30 TTS requests per minute per IP
ANALYZE_RATE_LIMIT = "60/minute"  # 60 analyze requests per minute per IP
