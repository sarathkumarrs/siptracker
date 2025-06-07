from database import engine, get_db
from sqlalchemy import text

def test_connection():
    try:
        # Test basic connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Connected to PostgreSQL!")
            print(f"Database version: {version}")
            
        # Test session creation
        db = next(get_db())
        print("✅ Database session created successfully!")
        db.close()
        
        print("🎉 Supabase connection is working perfectly!")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\nPlease check:")
        print("1. Your .env file has the correct DATABASE_URL")
        print("2. Your Supabase credentials are correct")
        print("3. Your network connection is working")

if __name__ == "__main__":
    test_connection()