# Scout Task: JSON Agent

## Intro

Built with `create-next-app`, this is a NextJS app that uses MongoDB for the database and is containerized to run using Docker compose.

The app contains a chat interface to be plugged into an autonomous agent for working with JSON data.

## Quick start

1. Clone the repo: `git clone {REPO_URL}`

2. CD into the repo: `cd /path/to/repo`

3. Install dependencies: `npm install`

4. Start via docker compose: `docker compose up`

5. Once running, visit `http://localhost:3000/` to load the app--the first load might be slow. You should see the following page if everything is successful:
   <img width="1483" alt="Home page" src="https://teamupsgeneral.blob.core.windows.net/teamupspublic/assessments/json-agent/home-ui.png">

## Sample git workflow

Sample flow for making changes and submitting a PR after getting the app up and running.

```
// check out a new branch for your changes
git checkout -b {BRANCH_NAME}

// make changes and commit them
git add --all
git commit

// push new branch up to GitHub
git push origin {BRANCH_NAME}

// use GitHub to make PR
```
