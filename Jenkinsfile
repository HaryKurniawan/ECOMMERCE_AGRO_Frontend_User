pipeline {
    agent any

    environment {
        // Atur port dan nama container sesuai target (Nginx mengarah ke 3002)
        APP_PORT = "3002"
        CONTAINER_NAME = "agro-frontend-user"
        ENV_CRED_ID = "agro_env_frontend_user"
        IMAGE_NAME = "${CONTAINER_NAME}-image"
    }

    stages {
        stage('Gitleaks Secret Scan') {
            steps {
                sh '''
                echo "Running Gitleaks Secret Scan..."

                docker run --rm \
                    -u $(id -u):$(id -g) \
                    -v "$(pwd):/repo" \
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
                    file(credentialsId: "${ENV_CRED_ID}", variable: 'ENV_FILE')
                ]) {
                    sh '''
                    # Hapus sisa file lama (jika ada) untuk mencegah Permission Denied
                    rm -f .env.local || true
                    # Ambil file environment dari Jenkins Credential sesuai branch
                    cp "$ENV_FILE" .env.local
                    docker build -t ${IMAGE_NAME} .
                    '''
                }
            }
        }

        stage('Deploy (Safe Restart)') {
            steps {
                sh '''
                TEST_CONTAINER="${CONTAINER_NAME}-tester"
                
                echo "=== Memulai Proses Deploy Anti-Downtime ==="
                
                # 1. Bersihkan sisa tester sebelumnya jika ada
                docker rm -f $TEST_CONTAINER || true

                # 2. Nyalakan container TESTER
                # Catatan: Sengaja TIDAK dipasang port -p agar tidak bentrok dengan live server
                echo "1. Menyalakan versi baru di latar belakang (tanpa menggangu live server)..."
                docker run -d \
                --name $TEST_CONTAINER \
                --network agro-network \
                --env-file .env.local \
                ${IMAGE_NAME}

                # 3. Tunggu aplikasi menyala
                echo "2. Menunggu 10 detik untuk memastikan aplikasi stabil..."
                sleep 10

                # 4. Pengecekan Kesehatan (Health Check)
                if [ "$(docker inspect -f '{{.State.Running}}' $TEST_CONTAINER)" = "true" ]; then
                    echo "3. UJI COBA SUKSES! Aplikasi baru berjalan dengan sehat."
                    
                    # Hentikan dan hapus container versi lama yang sedang melayani pengunjung
                    docker rm -f ${CONTAINER_NAME} || true
                    
                    # Matikan container tester untuk diganti nama dan dipasang port
                    docker rm -f $TEST_CONTAINER || true
                    
                    # Jalankan container baru sebagai versi UTAMA di port yang benar
                    echo "4. Mengalihkan lalu lintas pengunjung ke versi terbaru..."
                    docker run -d \
                    --name ${CONTAINER_NAME} \
                    --network agro-network \
                    --env-file .env.local \
                    -p ${APP_PORT}:3000 \
                    ${IMAGE_NAME}

                    echo "=== Deploy ${CONTAINER_NAME} BERHASIL ==="
                else
                    echo "=== GAGAL: Aplikasi baru mengalami Runtime Error (Crash) ==="
                    
                    # Tampilkan log error dari container yang crash agar developer tahu masalahnya
                    docker logs $TEST_CONTAINER
                    
                    # Bersihkan container rusak
                    docker rm -f $TEST_CONTAINER
                    
                    # Hentikan pipeline dengan paksa (exit 1)
                    # Container lama (Production/Staging) TETAP AMAN dan terus melayani pengunjung!
                    exit 1
                fi
                '''
            }
        }

    }

    post {
        always {
            archiveArtifacts artifacts: 'dependency-check-report/*.html', allowEmptyArchive: true
        }

        success {
            echo "${CONTAINER_NAME} (Port ${APP_PORT}) deployment successful!"
        }

        failure {
            echo "${CONTAINER_NAME} deployment failed! Pengecekan log container live (jika ada):"
            sh 'docker logs ${CONTAINER_NAME} --tail 100 || true'
        }
    }
}
