import logging
from fastapi import FastAPI, status, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import create_tables
from logger import configure_logging
from router.task_router import router as task_router
from router.user_router import router as user_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    # Initialization of the DB schema
    print("Syncing database schema ...")
    create_tables()
    print("Database schema synced.")

    configure_logging()
    print("Logger configured.")
    yield
    # Shutdown logic


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health probe endpoint
@app.get("/health", status_code=status.HTTP_200_OK, summary="Health check")
def health() -> bool:
    """
    API health check request
    """
    return True


app.include_router(task_router)
app.include_router(user_router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )
