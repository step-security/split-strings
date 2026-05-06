import * as core from '@actions/core';
import axios, { isAxiosError } from 'axios';
import * as fs from 'fs';

async function validateSubscription(): Promise<void> {
  const eventPath = process.env.GITHUB_EVENT_PATH
  let repoPrivate: boolean | undefined

  if (eventPath && fs.existsSync(eventPath)) {
    const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'))
    repoPrivate = eventData?.repository?.private
  }

  const upstream = 'xom9ikk/split'
  const action = process.env.GITHUB_ACTION_REPOSITORY
  const docsUrl =
    'https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions'

  core.info('')
  core.info('[1;36mStepSecurity Maintained Action[0m')
  core.info(`Secure drop-in replacement for ${upstream}`)
  if (repoPrivate === false)
    core.info('[32m✓ Free for public repositories[0m')
  core.info(`[36mLearn more:[0m ${docsUrl}`)
  core.info('')

  if (repoPrivate === false) return

  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com'
  const body: Record<string, string> = {action: action || ''}
  if (serverUrl !== 'https://github.com') body.ghes_server = serverUrl
  try {
    await axios.post(
      `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/maintained-actions-subscription`,
      body,
      {timeout: 3000}
    )
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      core.error(
        `[1;31mThis action requires a StepSecurity subscription for private repositories.[0m`
      )
      core.error(
        `[31mLearn how to enable a subscription: ${docsUrl}[0m`
      )
      process.exit(1)
    }
    core.info('Timeout or API not reachable. Continuing to next step.')
  }
}

async function run() {
  try {
    await validateSubscription();
    console.log('🚀 Starting string split action');

    // Required input
    const rawString = core.getInput('string', { required: true });

    // Optional inputs with defaults
    const separator = core.getInput('separator') || ' ';
    const limitInput = core.getInput('limit') || '-1';
    const limit = parseInt(limitInput, 10);

    if (Number.isNaN(limit)) {
      throw new Error(`Invalid "limit" input: expected an integer but got "${limitInput}"`);
    }

    const splitResult = rawString.split(separator, limit);

    // Output each part
    splitResult.forEach((chunk, index) => {
      core.setOutput(`_${index}`, chunk);
    });

    // Output length
    core.setOutput('length', splitResult.length);

    console.log('✅ String split completed successfully.');
  } catch (err) {
    console.error('❌ Action failed:', err.message);
    core.setFailed(err.message);
  }
}

run();
