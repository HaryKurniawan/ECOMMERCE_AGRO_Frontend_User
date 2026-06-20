pipeline {
    agent any

    stages {

        // stage('OWASP Dependency-Check') {
        //     steps {
        //         withCredentials([
        //             string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')
        //         ]) {
        //             sh '''
        //             if [ -n "$NVD_API_KEY" ]; then
        //               echo "API Key ditemukan"
        //             else
        //               echo "API Key kosong"
        //               exit 1
        //             fi
                    
        //             echo "Running OWASP Dependency-Check for Frontend User..."
        //             docker run --rm \\
        //                 -u \$(id -u):\$(id -g) \\
        //                 -v "\$(pwd):/src" \\
        //                 -v "/var/jenkins_home/dependency-check-data:/usr/share/dependency-check/data" \\
        //                 owasp/dependency-check:latest \\
        //                 --project "Ecommerce Frontend User" \\
        //                 --scan /src \\
        //                 --exclude "**/node_modules/**" \\
        //                 --exclude "**/.next/**" \\
        //                 --exclude "**/coverage/**" \\
        //                 --nvdApiKey \$NVD_API_KEY \\
        //                 --format "HTML" \\
        //                 --format "JSON" \\
        //                 --out /src/dependency-check-report || true
        //             '''
        //         }
        //     }
        // }

        stage('Build Docker Image') {
            steps {
                withCredentials([
                    file(credentialsId: 'frontend-user-env', variable: 'ENV_FILE')
                ]) {
                    sh '''
                    cp $ENV_FILE .env.local

                    docker build -t agro-frontend-user .
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop agro-frontend-user || true
                docker rm agro-frontend-user || true

                docker run -d \
                --name agro-frontend-user \
                --network 1panel-network \
                -p 3001:3000 \
                agro-frontend-user
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                sleep 10
                docker ps | grep agro-frontend-user
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
