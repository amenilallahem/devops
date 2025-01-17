pipeline {
    agent any

    triggers {
        githubPullRequests(
            events: [
                ghprbTriggerEvent { type 'PullRequestOpenedEvent' },
                ghprbTriggerEvent { type 'PullRequestReopenedEvent' },
                ghprbTriggerEvent { type 'PullRequestSynchronizeEvent' }
            ]
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
                    sh 'npm install' // Install backend dependencies
                }
            }
        }

        stage('Unit Test Backend') {
            steps {
                echo 'Running Unit Tests for Backend...'
                dir('backend') {
                    sh 'npm test' // Run backend tests
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building the frontend...'
                dir('frontend') {
                    sh 'npm install' // Install frontend dependencies
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
