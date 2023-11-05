import ForgeUI, { render, ProjectPage, Fragment, Text, Tabs, Tab, Image, Heading, Button, useState, useEffect, useProductContext, ModalDialog, resolver } from '@forge/ui';
import api, { route } from '@forge/api';

const PROMPT_VISION = 'Examine the following list of Jira project issues consisting of user stories and bugs. Provide a one-paragraph overview of the product vision.';
const PROMPT_SKILLSET = 'Examine the following list of Jira project issues consisting of user stories and bugs. Tell me what skill sets I should look for in developers who will be working on this project.';
const PROMPT_WORK = 'Examine the following list of Jira project issues consisting of user stories and bugs. Please summarize how the development team will spend their time.';
const PROMPT_RISKS = 'Examine the following list of Jira project issues consisting of user stories and bugs. Predict potential impediments and risks to this project.';
const PROMPT_OPPORTUNITIES = 'Examine the following list of Jira project issues consisting of user stories and bugs. Identify areas of opportunity for automation, AI integration, and developer experience to improve our development team productivity.';

const fetchSummaries = async (context) => {
    const res = await api
      .asUser()
      .requestJira(route`/rest/api/3/search?jql=project=${context.platformContext.projectId}&fields=summary&maxResults=100`);
    const data = await res.json();
    return data.issues.map(issue => issue.fields.summary);
};

const fetchGptSummary = async (summaries, prompt) => {
    const CHATGPT_API_KEY = ''; // Todo: Put your OpenAI API key here or better yet, Use env variables/secrets manager

    // Construct the request headers and body
    const headers = {
        'Authorization': `Bearer ${CHATGPT_API_KEY}`,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{"role": "user", "content":`${prompt} Here are the summaries: ${JSON.stringify(summaries)}`}] // replace with your message or adapt as needed
    });
    const response = await api.fetch(`https://api.openai.com/v1/chat/completions`, {
          method: 'POST',
          headers: headers,
          body: body
    });
    const data = await response.json();
    return data.choices[0].message.content;
};

const App = () => {
    const [summary, setSummary] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const context = useProductContext();

    const handleVisionClick = async () => {
        await doAI(PROMPT_VISION);
    };

    const handleSkillsetClick = async () => {
        await doAI(PROMPT_SKILLSET);
    };

    const handleWorkClick = async () => {
        await doAI(PROMPT_WORK);
    };

    const handleRisksClick = async () => {
        await doAI(PROMPT_RISKS);
    };

    const handleOpportunitiesClick = async () => {
        await doAI(PROMPT_OPPORTUNITIES);
    };

    const doAI = async (prompt) => {
        const summaries = await fetchSummaries(context);
        console.log(summaries);
        const gptSummary = await fetchGptSummary(summaries, prompt);
        console.log(gptSummary);
        setSummary(gptSummary);
    }

    return (
        <Fragment>
            <Image src="https://fireflywp.com/wp-content/uploads/2023/10/highviewlogob.png" alt="highview banner digital graph wave"/>
            <Heading size="medium">What's HighView?</Heading>
            <Text>HighView provides a high level analysis of your Jira issues using a large language model. It reviews your recent Jira issue summaries and provides project insights.</Text>
            
            <Tabs>
                <Tab label="Project Vision">
                    <Text>Get a high-level vision of your project based on your Jira issue summaries.  This is a way to check if the project acivities align with your product vision.</Text>
                    <Button text="Get Vision" onClick={handleVisionClick} />
                </Tab>
                
                <Tab label="Skill Sets">
                    <Text>Find out what skill sets your team will need to complete your project.</Text>
                    <Button text="Get Skill Sets" onClick={handleSkillsetClick} />
                </Tab>
                
                <Tab label="Work Load">
                    <Text>Get breakdown of your project's work load.</Text>
                    <Button text="Get Work" onClick={handleWorkClick} />
                </Tab>
                
                <Tab label="Risks">
                    <Text>Identify potential risks to the success of your project.</Text>
                    <Button text="Get Risks" onClick={handleRisksClick} />
                </Tab>
                
                <Tab label="Opportunites">
                    <Text>Identify opportunities to improve your project and increase your odds of succcess.</Text>
                    <Button text="Get Opportunities" onClick={handleOpportunitiesClick} />
                </Tab>
            </Tabs>

            <Heading size="small">HighView Analysis</Heading>
            {summary && summary.split('\n').map((line, index) => (
                <Text key={index}>{line}</Text>
            ))}
        </Fragment>
    );
};

export const run = render(
    <ProjectPage>
        <App />
    </ProjectPage>
);
