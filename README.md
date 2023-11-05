# highview
Highview is a Jira Cloud Forge project for [Atlassian Jira](https://www.atlassian.com/software/jira) that leverages the OpenAI GPT API to examine your Jira project summaries and output project insights.  You can find the demo on Youtube [here.](https://youtu.be/QHMqz1-7b6w?si=vR6uMtDbswkr69aU)

## Build prerequisites
* NodeJS v18.18.2+
* Forge v6.19.1+ (Use "npm install -g @forge/cli" to install.)
* An Atlassian developer account

## Build instructions
* Verify Node and Forge meat minimum requirements using "node --version" and "forge --version" at the command line.
* Clone this repo or fork it and clone it to build your own app.
* Enter the highview folder and do "npm install"
* Use "forge login" to log into your Atlassian dev account.
* Use "forge create" to create the app.
* Update the src/index.jsx with your OpenAI API key.  (Use an env var and don't check it in)
* Run "forge deploy" to deploy the appp.
* Run "forge install" to install the app.

## Testing
* Create a Jira project and import the test issues file in this repo, homework-minder-project-test-issues.csv.
* Navigate to the test Jira project page, click "highview" or whatever you named your project under "Apps" in the lower left corner. This should open a many of tabs where you can run each analysis.  Ouput should display in the output window below.