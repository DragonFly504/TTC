import time
import random
import string

def _rand_base36(n=6):
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choice(chars) for _ in range(n))

def generate_tracking_number(prefix="TTC", random_length=6):
    # Validate prefix
    prefix = "".join(ch for ch in prefix.upper() if ch.isalnum())
    
    # Timestamp-based segment
    ts = int(time.time())
    body = format(ts, "x")[-6:].upper()
    
    # Random segment
    rand = _rand_base36(random_length)
    
    # Optional checksum (simple sum of ASCII codes mod 36)
    checksum = format(sum(ord(c) for c in body + rand) % 36, "x").upper()
    
    return f"{prefix}-{body}{rand}{checksum}"

Example Output:
TTC-1A2B3CXYZ123D
