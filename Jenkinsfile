pipeline {
    agent any

    triggers {
        githubPullRequests(
            repoOwner: 'amenilallahem', // Propriétaire du dépôt GitHub
            repository: 'devops',       // Nom du dépôt
            event: 'opened'             // Événement spécifique (ex: opened, reopened, synchronized)
        )
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
                    sh 'npm install'
                }
            }
        }

        stage('Unit Test Backend') {
            steps {
                echo 'Running Unit Tests for Backend...'
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building the frontend...'
                dir('frontend') {
                    sh 'npm install'
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
