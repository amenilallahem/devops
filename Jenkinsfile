pipeline {
    agent any
    environement {
        NODE_VERSION = '22.x'
    }

    triggers {

        githubPush()


    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code...'
                // Cloner le code source depuis le dépôt Git
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm install'
            }
        }

        stage('Unit Test') {
            steps {
                echo 'Running Unit Tests...'
                sh 'npm test'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Archiving test results...'
            // Sauvegarder les résultats des tests (JUnit)
            junit 'build/test-results/**/*.xml' // Chemin des rapports JUnit (adapter si nécessaire)
        }
        success {
            echo 'Pipeline succeeded.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
