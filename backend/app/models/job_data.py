from pydantic import BaseModel

class JobDataResponse(BaseModel):
    title: str
    company: str
    location: str
    job_link: str
    posted_date: str
    description: str

    @classmethod
    def from_job(cls, job):
        return cls(
            title=job.title,
            company=job.company,
            location=job.location,
            job_link=job.job_link,
            posted_date=job.posted_date,
            description=job.description
        )
