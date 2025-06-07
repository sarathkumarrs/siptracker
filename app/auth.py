from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the Supabase JWT secret from environment variables
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# Check if the secret is loaded
if not SUPABASE_JWT_SECRET:
    raise ValueError("SUPABASE_JWT_SECRET environment variable not set")

# Initialize HTTPBearer for token extraction from Authorization header
oauth2_scheme = HTTPBearer()

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)) -> str:
    """
    FastAPI dependency to verify Supabase JWT and return the user_id.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token using the Supabase JWT secret
        # audience (aud) and issuer (iss) are common claims to verify
        # Supabase typically uses 'authenticated' for aud and its URL for iss
        payload = jwt.decode(
            token.credentials,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"], # Supabase uses HS256 by default
            # audience="authenticated", # Optional: uncomment if you want to verify audience
            # issuer="supabase" # Optional: uncomment if you want to verify issuer
        )
        
        # Supabase JWTs typically contain the user ID in the 'sub' claim
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
        # Ensure user_id is an integer if your database stores it as INT
        # Supabase 'sub' claim is usually a UUID string.
        # If your models.User.id is an Integer, you might need to fetch the actual
        # integer ID from your database based on the UUID 'sub'.
        # For simplicity in this assignment, let's assume `sub` can be directly used
        # as a string user ID or you map UUID to an integer in DB.
        # If your User model uses Integer for ID, we need to adapt here.
        # For now, let's treat it as a string as UUID is common.
        
        return user_id # Returns the user's UUID string from the JWT 'sub' claim
        
    except JWTError:
        # If decoding fails or token is invalid
        raise credentials_exception
    except Exception as e:
        # Catch any other unexpected errors during processing
        print(f"Error during JWT verification: {e}")
        raise credentials_exception