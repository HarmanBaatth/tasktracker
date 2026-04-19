pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                bat 'npm install'
            }
        }
        stage('Lint') {
            steps {
                bat 'npx eslint .'
            }
        }
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        stage('Build Docker') {
            steps {
                bat 'docker build -t tasktracker .'
            }
        }
        stage('Deploy') {
            steps {
                bat 'docker rm -f tasktracker || exit 0'
                bat 'docker run -d -p 3000:3000 --name tasktracker tasktracker'
            }
        }
    }
}
