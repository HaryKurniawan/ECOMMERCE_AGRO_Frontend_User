pipeline {
    agent any

    environment {
        IMAGE_NAME = 'agro-frontend-user'
        CONTAINER_NAME = 'agro-frontend-user'
        HOST_PORT = '3001'
        APP_PORT = '3000'
    }

    stages {

        stage('OWASP Dependency-Check') {
            steps {
                withCredentials([
                    string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')
                ]) {
                    sh '''
                    if [ -n "$NVD_API_KEY" ]; then
                      echo "NVD API Key ditemukan"
                    else
                      echo "NVD API Key kosong"
                      exit 1
                    fi

                    echo "Running OWASP Dependency-Check for Frontend User..."

                    docker run --rm \
                        -u $(id -u):$(id -g) \
                        -v "$(pwd):/src" \
                        -v "/var/jenkins_home/dependency-check-data:/usr/share/dependency-check/data" \
                        owasp/dependency-check:latest \
                        --project "Ecommerce Frontend User" \
                        --scan /src \
                        --exclude "**/node_modules/**" \
                        --exclude "**/.next/**" \
                        --exclude "**/coverage/**" \
                        --exclude "**/dependency-check-report/**" \
                        --nvdApiKey "$NVD_API_KEY" \
                        --format "HTML" \
                        --format "JSON" \
                        --out /src/dependency-check-report || true
                    '''
                }
            }
        }

        stage('Gitleaks Secret Scan') {
            steps {
                sh '''
                echo "Running Gitleaks Secret Scan..."

                docker run --rm \
                    -v "$WORKSPACE:/repo" \
                    zricethezav/gitleaks:latest \
                    detect \
                    --source=/repo \
                    --no-git \
                    --redact \
                    --exit-code=1
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([
                    file(credentialsId: 'frontend-user-env', variable: 'ENV_FILE')
                ]) {
                    sh '''
                    echo "Preparing frontend environment..."

                    cp "$ENV_FILE" .env.local

                    docker build \
                        -t $IMAGE_NAME:latest \
                        .
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                echo "Deploying Frontend User..."

                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true

                docker run -d \
                    --name $CONTAINER_NAME \
                    --restart unless-stopped \
                    --network 1panel-network \
                    -p $HOST_PORT:$APP_PORT \
                    $IMAGE_NAME:latest
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "Waiting Frontend User startup..."

                for i in $(seq 1 20)
                do
                    if curl -sf http://localhost:$HOST_PORT > /dev/null; then
                        echo "Frontend User is healthy!"
                        exit 0
                    fi

                    echo "Attempt $i/20 - waiting..."
                    sleep 3
                done

                echo "Frontend User failed health check"
                docker logs $CONTAINER_NAME --tail 100
                exit 1
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                echo "Cleaning unused Docker images..."
                docker image prune -f
                '''
            }
        }
    }

    post {
        always {
            dependencyCheckPublisher pattern: 'dependency-check-report/dependency-check-report.json'
            archiveArtifacts artifacts: 'dependency-check-report/*.html', allowEmptyArchive: true
        }

        success {
            echo 'Frontend User deployment successful!'
        }

        failure {
            echo 'Frontend User deployment failed!'
            sh 'docker logs agro-frontend-user --tail 100 || true'
        }
    }
}