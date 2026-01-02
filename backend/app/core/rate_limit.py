"""
Rate limiting configuration for Toneo API.

Security: Only trust forwarded headers when behind known proxies.
Direct clients can spoof X-Forwarded-For, so we validate the immediate
connection IP before trusting forwarded headers.
"""
import ipaddress
import os
from functools import lru_cache
from fastapi import Request
from slowapi import Limiter


# Known proxy IP ranges that we trust to set forwarded headers
# These are the IPs of our reverse proxies (Vercel, Railway, Cloudflare)
TRUSTED_PROXY_RANGES = [
    # Localhost / development
    "127.0.0.0/8",
    "::1/128",
    # Docker networks
    "172.16.0.0/12",
    "10.0.0.0/8",
    # Cloudflare IPv4 (https://www.cloudflare.com/ips/)
    "173.245.48.0/20",
    "103.21.244.0/22",
    "103.22.200.0/22",
    "103.31.4.0/22",
    "141.101.64.0/18",
    "108.162.192.0/18",
    "190.93.240.0/20",
    "188.114.96.0/20",
    "197.234.240.0/22",
    "198.41.128.0/17",
    "162.158.0.0/15",
    "104.16.0.0/13",
    "104.24.0.0/14",
    "172.64.0.0/13",
    "131.0.72.0/22",
    # Vercel Edge Network (approximation - they don't publish full list)
    # In production, Vercel sets proper headers and routes through their edge
]


@lru_cache(maxsize=1)
def _get_trusted_networks() -> list[ipaddress.IPv4Network | ipaddress.IPv6Network]:
    """Parse and cache trusted proxy networks."""
    networks = []
    for cidr in TRUSTED_PROXY_RANGES:
        try:
            networks.append(ipaddress.ip_network(cidr))
        except ValueError:
            pass
    return networks


def _is_trusted_proxy(ip: str) -> bool:
    """Check if IP is from a trusted proxy."""
    # In debug mode, trust all (for local development)
    if os.getenv("DEBUG", "false").lower() == "true":
        return True

    try:
        addr = ipaddress.ip_address(ip)
        for network in _get_trusted_networks():
            if addr in network:
                return True
    except ValueError:
        pass
    return False


def get_real_client_ip(request: Request) -> str:
    """
    Extract real client IP, only trusting forwarded headers from known proxies.

    Security: A direct client can spoof X-Forwarded-For headers.
    We only trust these headers if the immediate connection comes from
    a known proxy (Cloudflare, Vercel, Railway, localhost).

    Priority (if from trusted proxy):
    1. CF-Connecting-IP (Cloudflare - cryptographically verified by CF)
    2. X-Real-IP (nginx)
    3. X-Forwarded-For (first IP in chain)

    If not from trusted proxy, use direct connection IP.
    """
    # Get the immediate connection IP
    direct_ip = request.client.host if request.client else "unknown"

    # Only trust forwarded headers if direct connection is from trusted proxy
    if not _is_trusted_proxy(direct_ip):
        return direct_ip

    # Cloudflare (CF adds this header and it's verified)
    cf_ip = request.headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip.strip()

    # Nginx / other proxies
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()

    # X-Forwarded-For chain (take first = original client)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # Format: "client, proxy1, proxy2"
        return forwarded.split(",")[0].strip()

    # Fallback to direct connection
    return direct_ip


# Create limiter instance using real client IP
limiter = Limiter(key_func=get_real_client_ip)

# Rate limit constants
TTS_RATE_LIMIT = "30/minute"  # 30 TTS requests per minute per IP
ANALYZE_RATE_LIMIT = "60/minute"  # 60 analyze requests per minute per IP
