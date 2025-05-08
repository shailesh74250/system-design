# Setup sonar-qube
- Run SonarQube Locally with Docker
- docker-compose.yml
- docker-compose up -d
- http://localhost:9000
- (default login: admin / admin)
- create project

## Step 2: Generate a SonarQube Token
- Login to http://localhost:9000
- Go to My Account → Security.
- Generate a token (e.g., nestjs-token)

## Step 3: Configure Your NestJS Project
- Install sonar-scanner
- npm install --save-dev sonar-scanner

## Add sonar-project.properties in your NestJS root
- Replace <your-generated-token> with the token you generated.

## Update package.json scripts

    "scripts": {
      "test:cov": "jest --coverage",
      "sonar": "sonar-scanner"
    }

## Step 4: Generate Coverage and Run Sonar

    npm run test:cov
    npm run sonar
- You’ll see the report in http://localhost:9000/dashboard.

- Optional: Dockerize Sonar Scanner

        docker run --rm -e SONAR_HOST_URL="http://host.docker.internal:9000" \
        -e SONAR_LOGIN="<your-token>" \
        -v "$(pwd):/usr/src" \
        sonarsource/sonar-scanner-cli

## 4. Summary of What’s Now in Place
- Docker-based SonarQube locally
- Docker-based sonar-scanner run (no global install needed)
- GitHub Actions CI automation
- TypeScript + NestJS lint/test/coverage reports handled
