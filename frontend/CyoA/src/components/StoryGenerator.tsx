import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeInput from "./ThemeInput";
import LoadingStatus from "./LoadingStatus";

const API_BASE_URL = "/api";

type JobStatus = "processing" | "completed" | "failed" | null;

function StoryGenerator() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<string>("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval>;

    if (jobId && jobStatus === "processing") {
      pollInterval = setInterval(() => {
        pollJobStatus(jobId);
      }, 5000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [jobId, jobStatus]);

  interface JobResponse {
    job_id: string;
    status: JobStatus;
  }

  interface JobStatusResponse {
    status: JobStatus;
    story_id?: string;
    error?: string;
  }

  const generateStory = async (theme: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setTheme(theme);

    try {
      const response = await axios.post<JobResponse>(
        `${API_BASE_URL}/stories/create`,
        { theme }
      );
      const { job_id, status } = response.data;
      setJobId(job_id);
      setJobStatus(status);

      pollJobStatus(job_id);
    } catch (e) {
      setLoading(false);
      if (e instanceof Error) {
        setError(`Failed to generate story: ${e.message}`);
      } else {
        setError("Failed to generate story: Unknown error");
      }
    }
  };

  const pollJobStatus = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<JobStatusResponse>(
        `${API_BASE_URL}/jobs/${id}`
      );
      const { status, story_id, error: jobError } = response.data;
      setJobStatus(status);

      if (status === "completed" && story_id) {
        fetchStory(story_id);
      } else if (status === "failed" || jobError) {
        setError(jobError || "Failed to generate story");
        setLoading(false);
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status !== 404) {
        setError(`Failed to check story status: ${e.message}`);
        setLoading(false);
      }
    }
  };

  const fetchStory = async (id: string): Promise<void> => {
    try {
      setLoading(false);
      setJobStatus("completed");
      navigate(`/story/${id}`);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to load story: ${e.message}`);
      } else {
        setError("Failed to load story: Unknown error");
      }
      setLoading(false);
    }
  };

  const reset = () => {
    setJobId(null);
    setJobStatus(null);
    setError(null);
    setTheme("");
    setLoading(false);
  };

  return (
    <div className="story-generator">
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}

      {!jobId && !error && !loading && <ThemeInput onSubmit={generateStory} />}

      {loading && <LoadingStatus theme={theme} />}
    </div>
  );
}

export default StoryGenerator;
