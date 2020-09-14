def image
def branch_name = "${env.BRANCH_NAME}"
def github_token = "${env.GITHUB_STATUS_ACCESS_TOKEN}"
def build_number = "${env.BUILD_NUMBER}"

def dbName = 'protractor_db_jb' + build_number
def netName = 'protractor_net_jb' + build_number
def apiName = 'protractor_backend_jb' + build_number

def backendImageLatest

pipeline {
  agent any

  environment {
    GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN = credentials('GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN')
  }

  options {
    ansiColor('xterm')
  }

  stages {
    stage('Preamble') {
      steps {
        script {
          updateStatus("pending")
        }
      }
    }

    stage('pull required images') {
      steps {
        script {
          docker.withRegistry('http://localhost:34015') {
            backendImageLatest = docker.image('anmeldesystem/anmeldesystem-backend:latest')
            backendImageLatest.pull()
          }
        }
      }
    }

    stage('e2e prepare') {
      steps {
        script {
          try {
            sh 'docker network create ' + netName
          } catch (err) {
            echo err.getMessage()
          }

          sh 'docker run -d ' +
            '--name ' + dbName + ' ' +
            '--env MYSQL_ROOT_PASSWORD=password ' +
            '--env MYSQL_DATABASE=anmeldesystem-api-protractor ' +
            '--env MYSQL_USER=user ' +
            '--env MYSQL_PASSWORD=password ' +
            '--network ' + netName + ' ' +
            '--health-cmd=\'mysqladmin ping --silent\' ' +
            'mysql ' +
            'mysqld --default-authentication-plugin=mysql_native_password'

          waitUntil {
            "healthy" == sh(returnStdout: true,
              script: "docker inspect " + dbName + " --format=\"{{ .State.Health.Status }}\"").trim()
          }

          sh 'docker run -d ' +
            '--name ' + apiName + ' ' +
            '--env DB_USERNAME=root ' +
            '--env DB_PASSWORD=password ' +
            '--env DB_HOST=' + dbName + ' ' +
            '--env DB_PORT=3306 ' +
            '--env DB_DATABASE=anmeldesystem-api-protractor ' +
            '--env SALT_JWT=salt ' +
            '--env SALT_MAIL=salt ' +
            '--env SALT_ENROLLMENT=salt ' +
            '--env DOMAIN=go-join.me ' +
            '--env NODE_ENV=protractor ' +
            '--network ' + netName + ' ' +
            '--health-cmd=\'curl localhost:3000/healthcheck || exit 1 \' ' +
            '--health-interval=2s ' +
            'localhost:34015/anmeldesystem/anmeldesystem-backend:latest'

          waitUntil {
            "healthy" == sh(returnStdout: true,
              script: "docker inspect " + apiName + " --format=\"{{ .State.Health.Status }}\"").trim()
          }
        }
      }
    }

    stage('Build Docker image') {
      steps {
        script {
          image = docker.build("anmeldesystem/anmeldesystem-ui:jb" + build_number,
            "--build-arg BACKEND_URL=http://" + apiName + ":3000 " +
              "--network " + netName + " " +
              "-f Dockerfile .")
        }
      }
    }

    stage('Publish to registry') {
      when {
        expression {
          return branch_name =~ /^\d\.\d\.\d/
        }
      }
      steps {
        script {
          docker.withRegistry('http://localhost:34015') {
            image.push(branch_name)
          }
        }
      }
    }
    stage('Publish to registry - master') {
      when {
        expression {
          return branch_name =~ "master"
        }
      }
      steps {
        script {
          docker.withRegistry('http://localhost:34015') {
            image.push('latest')
          }
        }
      }
    }
  }
  post {
    always {
      script {
        try {
          sh 'docker container rm protractor_backend_jb' + build_number + ' -f'
        } catch (err) {
          echo err.getMessage()
        }

        try {
          sh 'docker container rm protractor_db_jb' + build_number + ' -f'
        } catch (err) {
          echo err.getMessage()
        }

        try {
          sh 'docker network rm protractor_net_jb' + build_number
        } catch (err) {
          echo err.getMessage()
        }

        try {
          sh 'docker image rm anmeldesystem/anmeldesystem-ui:jb' + build_number + ' -f'
        } catch (err) {
          echo err.getMessage()
        }
      }
    }
    success {
      script {
        updateStatus("success")
      }
    }
    failure {
      script {
        updateStatus("failure")
      }
    }
    aborted {
      script {
        updateStatus("error")
      }
    }
  }
}

void updateStatus(String value) {
  sh 'curl -s "https://api.github.com/repos/sebamomann/anmeldesystem-frontend/statuses/$GIT_COMMIT" \\\n' +
    '  -H "Content-Type: application/json" \\\n' +
    '  -H "Authorization: token $GITHUB_STATUS_ACCESS_TOKEN_SEBAMOMANN" \\\n' +
    '  -X POST \\\n' +
    '  -d "{\\"state\\": \\"' + value + '\\", \\"description\\": \\"Jenkins\\", \\"context\\": \\"continuous-integration/jenkins\\", \\"target_url\\": \\"https://jenkins.dankoe.de/job/anmeldesystem-frontend/job/$BRANCH_NAME/$BUILD_NUMBER/console\\"}" \\\n' +
    '  '
}
