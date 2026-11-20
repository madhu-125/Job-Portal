import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:2222/jobs";

const initialForm = {
  title: "",
  company: "",
  location: "",
  description: "",
  salary: "",
  jobType: "",
  postedDate: "",
};

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  // GET: Fetch all jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/getall`);

      if (!response.ok) {
        throw new Error("Unable to fetch jobs.");
      }

      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        "Could not connect to the backend. Check that Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  // Update form fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // POST: Create a job or PUT: Update a job
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const jobData = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      salary: form.salary === "" ? null : Number(form.salary),
      jobType: form.jobType,
      postedDate: form.postedDate || null,
    };

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : `${API_URL}/insert`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditing
            ? "Failed to update the job."
            : "Failed to create the job."
        );
      }

      setSuccess(
        isEditing
          ? "Job updated successfully!"
          : "Job created successfully!"
      );

      resetForm();
      setSuccess(
        isEditing
          ? "Job updated successfully!"
          : "Job created successfully!"
      );

      await fetchJobs();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // Load selected job into the form
  const handleEdit = (job) => {
    setEditingId(job.id);
    setError("");
    setSuccess("");

    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      description: job.description || "",
      salary: job.salary ?? "",
      jobType: job.jobType || "",
      postedDate: job.postedDate || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE: Delete a job
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the job.");
      }

      setJobs((previous) => previous.filter((job) => job.id !== id));

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Job deleted successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  const formatSalary = (salary) => {
    if (salary === null || salary === undefined || salary === "") {
      return "Not specified";
    }

    return Number(salary).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">J</span>
          <span>Job<span className="brand-highlight">Portal</span></span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#jobs">Browse Jobs</a>
          <a href="#job-form">Post a Job</a>
        </nav>

        <a className="nav-button" href="#job-form">
          + Post Job
        </a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR NEXT OPPORTUNITY STARTS HERE</span>

            <h1>
              Find a job that
              <br />
              <span>fits your future.</span>
            </h1>

            <p>
              Discover opportunities, connect with companies, and take the
              next step in your career.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#jobs">
                Explore Jobs <span>→</span>
              </a>
              <a className="secondary-button" href="#job-form">
                Post a Job
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>{jobs.length}+</strong>
                <span>Listed Jobs</span>
              </div>
              <div>
                <strong>Easy</strong>
                <span>Job Management</span>
              </div>
              <div>
                <strong>Anytime</strong>
                <span>Explore Opportunities</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-circle circle-one"></div>
            <div className="visual-circle circle-two"></div>

            <div className="floating-card card-top">
              <span className="floating-icon">✦</span>
              <div>
                <strong>New opportunities</strong>
                <small>Your next chapter awaits</small>
              </div>
            </div>

            <div className="hero-illustration">
              <div className="illustration-window">
                <div className="window-dots">
                  <i></i><i></i><i></i>
                </div>
                <div className="illustration-line line-wide"></div>
                <div className="illustration-line"></div>
                <div className="illustration-job">
                  <span className="mini-logo">J</span>
                  <div>
                    <b>Software Developer</b>
                    <small>Build something amazing</small>
                  </div>
                </div>
                <div className="illustration-line line-short"></div>
                <div className="illustration-button"></div>
              </div>
              <div className="person">
                <div className="person-head"></div>
                <div className="person-body"></div>
                <div className="person-arm"></div>
              </div>
              <div className="plant">
                <i></i><i></i><i></i>
                <div></div>
              </div>
            </div>

            <div className="floating-card card-bottom">
              <span className="check-icon">✓</span>
              <div>
                <strong>Your career, your way</strong>
                <small>Start exploring today</small>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section" id="jobs">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CAREER OPPORTUNITIES</span>
              <h2>Explore available jobs</h2>
              <p>Find your next role from the jobs listed below.</p>
            </div>

            <button
              className="outline-button refresh-button"
              onClick={fetchJobs}
              type="button"
            >
              ↻ Refresh
            </button>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>!</span> {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="status">
              <span>✓</span> {success}
            </div>
          )}

          {loading ? (
            <div className="state-card">
              <div className="spinner"></div>
              <p>Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="state-card empty-state">
              <div className="empty-icon">⌕</div>
              <h3>No jobs available yet</h3>
              <p>Be the first to add a job opportunity to the portal.</p>
              <a className="primary-button" href="#job-form">
                Add Your First Job
              </a>
            </div>
          ) : (
            <div className="job-grid">
              {jobs.map((job) => (
                <article className="job-card" key={job.id}>
                  <div className="job-card-top">
                    <div className="company-avatar">
                      {(job.company || "C").charAt(0).toUpperCase()}
                    </div>
                    <span className="job-id">JOB #{job.id}</span>
                  </div>

                  <h3>{job.title || "Untitled Position"}</h3>
                  <p className="company-name">
                    {job.company || "Company not specified"}
                  </p>

                  <div className="job-meta">
                    <span>⌖ {job.location || "Location not specified"}</span>
                    <span>◷ {job.jobType || "Type not specified"}</span>
                  </div>

                  <p className="job-description">
                    {job.description || "No description provided."}
                  </p>

                  <div className="job-card-bottom">
                    <div className="salary-block">
                      <strong>{formatSalary(job.salary)}</strong>
                      <span>
                        {job.postedDate
                          ? `Posted ${job.postedDate}`
                          : "Posting date not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="job-card-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(job)}
                    >
                      ✎ Edit
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(job.id)}
                    >
                      ✕ Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="form-section" id="job-form">
          <div className="form-intro">
            <span className="eyebrow">JOB MANAGEMENT</span>
            <h2>{editingId !== null ? "Update a job" : "Post a new job"}</h2>
            <p>
              {editingId !== null
                ? "Make changes to the selected job and save your updates."
                : "Add job details to make the opportunity visible on the portal."}
            </p>

            <div className="form-benefit">
              <span>✓</span>
              <div>
                <strong>Simple job management</strong>
                <p>Create, edit, and delete job listings in one place.</p>
              </div>
            </div>

            <div className="form-benefit">
              <span>✓</span>
              <div>
                <strong>Clear job information</strong>
                <p>Include the company, location, salary, and description.</p>
              </div>
            </div>
          </div>

          <form className="job-form" onSubmit={handleSubmit}>
            <div className="form-title-row">
              <div>
                <h3>{editingId !== null ? "Edit job details" : "Job details"}</h3>
                <p>Fields marked * are required.</p>
              </div>
              {editingId !== null && (
                <span className="editing-badge">Editing #{editingId}</span>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Job title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Java Developer"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company name *</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="e.g. Tech Solutions"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Hyderabad"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="jobType">Job type *</label>
                <select
                  id="jobType"
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select job type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="salary">Salary (₹)</label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 500000"
                  value={form.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="postedDate">Posted date</label>
                <input
                  id="postedDate"
                  name="postedDate"
                  type="date"
                  value={form.postedDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Job description *</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  maxLength="2000"
                  placeholder="Describe the responsibilities, skills, and requirements..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <span className="character-count">
                  {form.description.length}/2000 characters
                </span>
              </div>
            </div>

            <div className="form-actions">
              {editingId !== null && (
                <button
                  type="button"
                  className="outline-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="primary-button submit-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Save Changes →"
                  : "Publish Job →"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">J</span>
          <span>Job<span className="brand-highlight">Portal</span></span>
        </a>
        <p>Connecting opportunities with ambition.</p>
        <span>© {new Date().getFullYear()} JobPortal</span>
      </footer>
    </div>
  );
}

export default App;