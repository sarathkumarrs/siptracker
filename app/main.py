from contextlib import asynccontextmanager # <-- Import this
from fastapi import FastAPI
from .api import users
from .database import create_db_and_tables # <-- Keep this import

# 1. Define your lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code that runs on startup
    print("Application startup: Creating database tables...")
    create_db_and_tables()
    print("Database tables created (if they didn't exist).")
    
    yield # The application will run between this point and the code below
    
    # Code that runs on shutdown (optional, but good for cleanup)
    print("Application shutdown: Closing resources (if any).")
    # For example, if you had global database connections or caches to close:
    # db.close_all_connections()
    # cache.clear()

# 2. Pass the lifespan function to FastAPI
app = FastAPI(lifespan=lifespan) # <-- Pass your lifespan function here

app.include_router(users.router)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the SIP Tracker API"}