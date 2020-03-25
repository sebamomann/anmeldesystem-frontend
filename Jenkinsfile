img = null
env_data = ""

pipeline {
  agent any

  stages {
    //stage('Test App') {
      // steps {
        // sh 'npm test'
      // }
    //}
    stage('Build Docker image') {
      steps {  
        script {
          image = docker.build("sebamomann/anmeldesystem-frontend:${VERSION}", "--build-arg version=${VERSION} .")
        }
      }
    }
    stage('Deploy to HUB version') {
      steps {
        withDockerRegistry([credentialsId: "docker-hub-sebamomann", url: ""]) {
          script {
            echo LATEST
            image.push("${VERSION}")
          }
        }
      }
    }
    stage('Deploy to HUB latest') {
      when {
        expression {
          return LATEST == "true"
        }
      }
      steps {
        withDockerRegistry([credentialsId: "docker-hub-sebamomann", url: ""]) {
          script {
            image.push("latest")
          }
        }
      }
    }
    stage('Execute') {
      when {
        expression {
          return LATEST == "true"
        }
      }
      steps {
        echo 'preparing .env file'

        script {
          env_data = """
            API_URL=${API_URL}
          """
        }

        writeFile(file: ".env", text: env_data)

        echo 'execute ...'
        sh 'docker-compose -f compose.yml up -d'
      }
    }
  }
}