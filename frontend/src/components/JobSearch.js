// import React, { useState } from 'react';
// import axios from 'axios';
// import './JobSearch.css'; // Import CSS riêng cho JobSearch

// const JobSearch = () => {
//   const [keywords, setKeywords] = useState('');
//   const [location, setLocation] = useState('');
//   const [maxJobs, setMaxJobs] = useState(10);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Gọi API từ back-end
//       const response = await axios.get('http://localhost:8000/api/jobs/scrape', {
//         params: {
//           keywords,
//           location,
//           max_jobs: maxJobs,
//         },
//       });
//       setJobs(response.data);
//     } catch (err) {
//       console.error(err);
//       setError(err.response ? err.response.data.detail : 'Đã có lỗi xảy ra khi lấy dữ liệu.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSearch} className="job-search-form">
//         <div>
//           <label htmlFor="keywords">Từ khóa:</label>
//           <input
//             type="text"
//             id="keywords"
//             value={keywords}
//             onChange={(e) => setKeywords(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="location">Địa điểm:</label>
//           <input
//             type="text"
//             id="location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="maxJobs">Số lượng job cần scrape:</label>
//           <input
//             type="number"
//             id="maxJobs"
//             value={maxJobs}
//             onChange={(e) => setMaxJobs(e.target.value)}
//           />
//         </div>
//         <button type="submit" disabled={loading}>
//           {loading ? 'Đang tải...' : 'Tìm kiếm'}
//         </button>
//       </form>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {jobs.length > 0 && (
//         <div>
//           <h2>Kết quả tìm kiếm:</h2>
//           <ul className="job-list">
//             {jobs.map((job, index) => (
//               <li key={index}>
//                 <strong>{job.title}</strong> tại {job.company} - {job.location}
//                 <br />
//                 <a href={job.job_link} target="_blank" rel="noreferrer">
//                   Xem chi tiết
//                 </a>
//                 <br />
//                 Ngày đăng: {job.posted_date}
//                 <br />
//                 <p>{job.description}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobSearch;

import React, { useState } from "react";
import axios from "axios";
import "./JobSearch.css"; 

const JobSearch = () => {
    const [keywords, setKeywords] = useState("");
    const [location, setLocation] = useState("");
    const [maxJobs, setMaxJobs] = useState(10);
    const [fileFormat, setFileFormat] = useState("json");
    const [fileName, setFileName] = useState("");

    const handleSearch = async () => {
        setFileName(""); // Reset file trước khi bắt đầu scrape
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/jobs/scrape", {
                params: { keywords, location, max_jobs: maxJobs, file_format: fileFormat },
            });
            setFileName(response.data.file);
        } catch (error) {
            console.error("Scraping failed:", error);
        }
    };

    return (
        <div className="job-search-container">
            <h2>LinkedIn Job Scraper</h2>
            <div className="input-group">
                <label>Keywords:</label>
                <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Max Jobs:</label>
                <input type="number" value={maxJobs} onChange={(e) => setMaxJobs(e.target.value)} />
            </div>
            <div className="input-group">
                <label>File Format:</label>
                <select value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}>
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                </select>
            </div>
            <button className="search-btn" onClick={handleSearch}>Scrape Jobs</button>

            {fileName && (
                <div className="download-section">
                    <p>Scraping complete! Download your file:</p>
                    <a
                        href={`http://127.0.0.1:8000/api/jobs/download/${fileName}`}
                        download={fileName}
                        className="download-btn"
                    >
                        Download {fileFormat.toUpperCase()} File
                    </a>
                </div>
            )}
        </div>
    );
};

export default JobSearch;
