from contextlib import asynccontextmanager # <-- Import this
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import users,sips
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

origins = [
    "http://localhost:5173", # Your React app's development server origin
    "http://127.0.0.1:5173", # Another common local development origin
    # Add other origins if your frontend is deployed elsewhere
    # For production, replace '*' with your actual frontend domain(s)!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # List of origins that are allowed to make requests
    allow_credentials=True, # Allow cookies/authentication headers (like JWT)
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
    allow_headers=["*"], # Allow all headers (including Authorization header)
)

app.include_router(users.router)
app.include_router(sips.router)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the SIP Tracker API"}