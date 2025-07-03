import * as core from '@actions/core';
import axios, { isAxiosError } from 'axios';

async function validateSubscription(): Promise<void> {
  const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`;

  try {
    await axios.get(API_URL, { timeout: 3000 });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      core.error('Subscription is not valid. Reach out to support@stepsecurity.io');
      process.exit(1);
    } else {
      core.info('Timeout or API not reachable. Continuing to next step.');
    }
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
