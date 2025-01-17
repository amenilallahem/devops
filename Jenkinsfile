pipeline {
    agent any

    triggers {
        githubPullRequests(
            events: ['open', 'reopen', 'synchronize'] // Événements spécifiques à surveiller
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
    }
}
