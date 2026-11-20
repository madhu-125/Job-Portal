# Job Portal Backend

Spring Boot REST API for managing job listings. The service listens on port
`2222` and connects to a MySQL-compatible database.

## Requirements

- Java 25
- Docker (for container deployment), or Maven Wrapper (for local development)
- A reachable MySQL-compatible database and its connection details

## Configure the database

Provide the following environment variables before starting the application.
Do not commit database credentials to source control.

| Variable | Description |
| --- | --- |
| `SPRING_DATASOURCE_URL` | JDBC URL, for example `jdbc:mysql://localhost:3306/job_portal` |
| `SPRING_DATASOURCE_USERNAME` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Database password |

## Run locally

From this directory, set the database variables in your shell and run the
Maven Wrapper:

```powershell
$env:SPRING_DATASOURCE_URL = "jdbc:mysql://localhost:3306/job_portal"
$env:SPRING_DATASOURCE_USERNAME = "<username>"
$env:SPRING_DATASOURCE_PASSWORD = "<password>"
.\mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:2222`.

## Run with Docker

Build the image:

```sh
docker build -t job-portal-api .
```

Start the container, supplying your database details at runtime:

```sh
docker run --rm -p 2222:2222 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://<host>:3306/<database>" \
  -e SPRING_DATASOURCE_USERNAME="<username>" \
  -e SPRING_DATASOURCE_PASSWORD="<password>" \
  job-portal-api
```

## API endpoints

All endpoints use the `/jobs` base path and accept/return JSON where applicable.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/jobs/getall` | List all jobs |
| `GET` | `/jobs/job/{id}` | Get a job by ID |
| `POST` | `/jobs/insert` | Create a job |
| `PUT` | `/jobs/update/{id}` | Update a job |
| `DELETE` | `/jobs/delete/{id}` | Delete a job |

Example job body:

```json
{
  "title": "Software Engineer",
  "company": "Example Inc.",
  "location": "Remote",
  "description": "Build and maintain software.",
  "salary": 90000,
  "jobType": "Full-time",
  "postedDate": "2026-11-20"
}
```

The API currently permits cross-origin requests from `http://localhost:5173`.
