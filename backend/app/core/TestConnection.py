import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SECRET_KEY")

def test_connection():
    try:
        # Check if environment variables exist
        if not url:
            raise ValueError("SUPABASE_URL is missing.")
        if not key:
            raise ValueError("SUPABASE_SECRET_KEY is missing.")

        # Create Supabase client
        supabase: Client = create_client(url, key)

        # Perform a simple query
        # Replace 'your_table_name' with an existing table
        response = supabase.table("PATIENT").select("*").limit(1).execute()

        print("✅ Successfully connected to Supabase!")
        print(f"Sample Response: {response.data}")

    except Exception as e:
        print("❌ Failed to connect to Supabase.")
        print(f"Error: {e}")

if __name__ == "__main__":
    test_connection()