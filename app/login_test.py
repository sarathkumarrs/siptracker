import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Get your Supabase URL and Anon Key from your .env file or Supabase project settings
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env")

# Initialize the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# --- CORRECTED FUNCTION: Removed 'async' and 'await' ---
def login_and_get_jwt(email, password):
    try:
        # Call the synchronous method directly
        response = supabase.auth.sign_in_with_password(
            {
                "email": email,
                "password": password,
            }
        )
        
        # The response object structure
        # print(response.model_dump_json(indent=2)) # Useful for debugging response structure
        
        # Access user and session directly from the response object
        # Note: The response object itself might not have .user or .session as direct attributes
        # in some versions, you might need to access .data.user or .data.session
        # Check your 'supabase-py' version's documentation if this part fails.
        # However, for common versions, it should work.
        
        if response.user and response.session:
            access_token = response.session.access_token
            user_id = response.user.id # This is the UUID 'sub' claim from the JWT
            print(f"✅ Successfully logged in user: {user_id}")
            print(f"Your JWT Access Token: {access_token}")
            print("\nUse this token in the 'Authorization: Bearer <TOKEN>' header for your FastAPI requests.")
            print(f"DEBUG: Raw JWT Access Token: {access_token}")
            print(f"DEBUG: JWT Access Token repr: {repr(access_token)}")
            print(f"DEBUG: JWT Access Token length: {len(access_token)}")
            return access_token
        else:
            # This case might be hit if the login fails for reasons like bad creds
            print(f"❌ Login failed. Check email/password. Response: {response}")
            return None

    except Exception as e:
        print(f"An error occurred during login: {e}")
        return None

# --- To run this this synchronous script ---
if __name__ == "__main__":
    # Replace with the email and password of the user you created in Supabase
    user_email = "sarathkumar455@gmail.com"
    user_password = "Sarath@455"

    # Call the synchronous function directly
    login_and_get_jwt(user_email, user_password)