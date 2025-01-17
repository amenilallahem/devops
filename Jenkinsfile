pipeline {
    agent any

    triggers {
        // Vérifie les PR toutes les 5 minutes (ou via un webhook GitHub)
        cron('H/5 * * * *') 
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Building the backend...'
                dir('backend') {
                    sh 'npm install' // Installer les dépendances du backend
                }
            }
        }

        stage('Unit Test Backend') {
            steps {
                echo 'Running Unit Tests for Backend...'
                dir('backend') {
                    sh 'npm test' // Exécuter les tests backend
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building the frontend...'
                dir('frontend') {
                    sh 'npm install' // Installer les dépendances du frontend
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
