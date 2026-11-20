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
| `SPRING_DATASOURCE_URL` | mysql://su7aHp5vSKZ635z.root:gPfpWZshSh7pRvgH@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/job_portal` |
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

## Deploy on Render

1. Push this backend project to a GitHub repository connected to Render.
2. In Render, create a **New Web Service** and select the repository.
3. If the backend is in a subdirectory, set **Root Directory** to that
   repository-relative directory. Select **Docker** as the runtime and leave
   the Dockerfile path as `Dockerfile` if it is in the root directory.
4. Add these environment variables in the Render service's **Environment**
   settings:
   - `SPRING_DATASOURCE_URL`: the JDBC URL for your reachable MySQL-compatible
     database, including any TLS options required by your provider.
   - `SPRING_DATASOURCE_USERNAME`: database username.
   - `SPRING_DATASOURCE_PASSWORD`: database password.
5. Create the service and wait for the Docker build and deployment to finish.
   Render provides `PORT` at runtime; the application uses it automatically.
   Open the service's `onrender.com` URL to reach the API.

The database must be reachable from Render. Render PostgreSQL is not a
drop-in replacement for this application's MySQL driver; use a MySQL-compatible
database unless the application is migrated to another database.

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
