def image
def branch_name = "${env.BRANCH_NAME}"
def github_token = "${env.GITHUB_STATUS_ACCESS_TOKEN}"
def build_number = "${env.BUILD_NUMBER}"

def tagName = 'jb_' + branch_name + "_" + build_number
def netName = 'protractor_net_' + tagName
def uiName = 'cypress_frontend_' + tagName

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

    stage('Build Docker image') {
      steps {
        script {
          image = docker.build("anmeldesystem/anmeldesystem-ui:" + tagName,
              "-f Dockerfile .")
        }
      }
    }

   stage('cypress prepare') {
     steps {
       script {
         try {
           sh 'docker network create ' + netName
         } catch (err) {
           echo err.getMessage()
         }
       }
     }
   }

    stage('Start new image') {
      steps {
        script {
          sh 'docker run -d --network ' + netName + ' --name ' + uiName + ' anmeldesystem/anmeldesystem-ui:' + tagName
        }
      }
    }

    stage('Run cypress') {
      steps {
        script {
          sh "API_URL=http://localhost:3000/ \
            BASE_URL=http://${uiName}/ \
            KEYCLOAK_URL=https://account.sebamomann.de/auth/ \
            KEYCLOAK_REALM=test \
            KEYCLOAK_REDIRECT_URI=https://localhost:4200/ \
            KEYCLOAK_POST_LOGOUT_REDIRECT_URI=https://localhost:4200/ \
            KEYCLOAK_CLIENT_ID=test \
            KEYCLOAK_RESPONSE_TYPE=code \
            KEYCLOAK_SCOPE='openid profile email' \
            docker run --network ${netName} -v \$PWD:/e2e -w /e2e cypress/included:3.2.0 \
          "
        }
      }
    }

    stage('Publish to registry') {
      when {
        expression {
          return branch_name =~ /^\d\.\d\.\d(-\d+)?/
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
          sh 'docker network rm protractor_net_' + tagName
        } catch (err) {
          echo err.getMessage()
        }

        try {
          sh 'docker container rm ' + uiName + ' -f'
        } catch (err) {
          echo err.getMessage()
        }

        try {
          sh 'docker image rm anmeldesystem/anmeldesystem-ui:' + tagName + ' -f'
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
