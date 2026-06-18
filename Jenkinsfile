pipeline {
    agent any

    stages {

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
        success {
            echo 'Frontend User deployment successful!'
        }

        failure {
            echo 'Frontend User deployment failed!'
            sh 'docker logs agro-frontend-user --tail 100 || true'
        }
    }
}
