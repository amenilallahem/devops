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

        // Build Backend
        stage('Build Backend') {
            steps {
                echo 'Building the backend...'
                dir('backend') {
                    sh 'npm install' // Installer les dépendances du backend
                }
            }
        }

        // Unit Test Backend
        stage('Unit Test Backend') {
            steps {
                echo 'Running Unit Tests for Backend...'
                dir('backend') {
                    sh 'npm test' // Exécuter les tests backend
                }
            }
        }

        // Build Frontend (sans tests)
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
        // Archive les résultats des tests JUnit générés par Jest pour le Backend
        junit '**/backend/build/test-results/test-results.xml' // Chemin des rapports JUnit backend
    }
}
