from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import jobs

app = FastAPI(title="LinkedIn Jobs Scraper API")

# Cấu hình CORS (cho phép front-end truy cập)
origins = [
    "http://localhost:3000",  # Địa chỉ của ứng dụng React (hoặc thay đổi theo cấu hình của bạn)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký router cho endpoint jobs
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
