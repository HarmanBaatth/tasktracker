pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Lint') {
            steps {
                sh 'npx eslint .'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build Docker') {
            steps {
                sh 'docker build -t tasktracker .'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker rm -f tasktracker || true'
                sh 'docker run -d -p 3000:3000 --name tasktracker tasktracker'
            }
        }
    }
}
