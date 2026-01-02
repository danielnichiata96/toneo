"""
Rate limiting configuration for Toneo API.
"""
from fastapi import Request
from slowapi import Limiter


def get_real_client_ip(request: Request) -> str:
    """
    Extract real client IP behind proxies (Vercel, Render, Cloudflare).

    Priority:
    1. CF-Connecting-IP (Cloudflare)
    2. X-Real-IP (nginx)
    3. X-Forwarded-For (first IP in chain)
    4. Direct client IP
    """
    # Cloudflare
    cf_ip = request.headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip

    # Nginx / other proxies
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip

    # X-Forwarded-For chain (take first = original client)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # Format: "client, proxy1, proxy2"
        return forwarded.split(",")[0].strip()

    # Direct connection
    if request.client:
        return request.client.host

    return "unknown"


# Create limiter instance using real client IP
limiter = Limiter(key_func=get_real_client_ip)

# Rate limit constants
TTS_RATE_LIMIT = "30/minute"  # 30 TTS requests per minute per IP
ANALYZE_RATE_LIMIT = "60/minute"  # 60 analyze requests per minute per IP
