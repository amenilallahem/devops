pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code...'
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building the frontend application...'
                dir('frontend') {  // Répertoire frontend
                    sh 'npm install'
                }
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Building the backend application...'
                dir('backend') {  // Répertoire backend
                    sh 'npm install'
                }
            }
        }

        stage('Unit Test Frontend') {
            steps {
                echo 'Running Unit Tests for Frontend...'
                dir('frontend') {  // Répertoire frontend
                    sh 'npm test'
                }
            }
        }

        stage('Unit Test Backend') {
            steps {
                echo 'Running Unit Tests for Backend...'
                dir('backend') {  // Répertoire backend
                    sh 'npm test'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Archiving test results...'
            junit 'build/test-results/**/*.xml'  // Chemin des rapports JUnit (adapter si nécessaire)
        }
        success {
            echo 'Pipeline succeeded.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
