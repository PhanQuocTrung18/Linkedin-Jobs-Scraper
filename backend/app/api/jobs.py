from fastapi import APIRouter, Query
from fastapi.responses import FileResponse, JSONResponse
from app.services.scraper import LinkedInJobsScraper
import json
import csv
import os

router = APIRouter()

@router.get("/scrape")
async def scrape_jobs(
    keywords: str = Query(..., description="Job keywords to search"),
    location: str = Query(..., description="Location of jobs"),
    max_jobs: int = Query(10, description="Maximum number of jobs to scrape"),
    file_format: str = Query("json", description="File format: json or csv"),
    save_path: str = Query("output", description="Custom save path")
):
    os.makedirs(save_path, exist_ok=True)
    scraper = LinkedInJobsScraper()
    jobs = scraper.scrape_jobs(keywords, location, max_jobs)

    if not jobs:
        return JSONResponse(content={"message": "No jobs found"}, status_code=404)

    filename = f"{keywords}_{location}.{file_format}"
    filepath = os.path.join(save_path, filename)

    # Lưu dưới dạng JSON
    if file_format == "json":
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump([job.__dict__ for job in jobs], f, ensure_ascii=False, indent=4)

    # Lưu dưới dạng CSV
    elif file_format == "csv":
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["title", "company", "location", "job_link", "posted_date", "description"])
            for job in jobs:
                writer.writerow([job.title, job.company, job.location, job.job_link, job.posted_date, job.description])

    return {"message": "Scraping complete", "file": filename, "path": save_path}

@router.get("/download")
async def download_file(filename: str = Query(..., description="Filename to download"), save_path: str = Query("output", description="Custom save path")):
    filepath = os.path.join(save_path, filename)
    if not os.path.exists(filepath):
        return JSONResponse(content={"message": "File not found"}, status_code=404)
    
    return FileResponse(filepath, filename=filename)
