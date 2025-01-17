pipeline {
    agent any

    triggers {
        // Déclenche le pipeline lorsqu'une pull request est créée ou mise à jour
        githubPullRequest()
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
                // Installer les dépendances du projet avec npm
                sh 'npm install'
            }
        }

        stage('Unit Test') {
            steps {
                echo 'Running Unit Tests...'
                // Exécuter les tests unitaires avec npm
                sh 'npm test'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Archiving test results...'
            // Sauvegarder les résultats des tests dans un rapport JUnit
            junit '*/test-results/**/.xml' // Adapter le chemin des rapports JUnit si nécessaire
        }
        success {
            echo 'Pipeline succeeded.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
