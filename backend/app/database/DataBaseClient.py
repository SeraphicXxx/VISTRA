from app.config.settings import Config
from supabase import create_client, Client

url: str = Config.SUPABASE_URL
key: str = Config.SUPABASE_KEY

if not url or not key:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment.")

supabase: Client = create_client(url, key)
 