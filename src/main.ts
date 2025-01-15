import * as core from '@actions/core'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */

// await fetch("https://api.vercel.com/v10/projects/prj_XLKmu1DyR1eY7zq8UgeRKbA7yVLA/env?slug=SOME_STRING_VALUE&teamId=SOME_STRING_VALUE&upsert=true", {
//   "body": {
//     "key": "API_URL",
//     "value": "https://api.vercel.com",
//     "type": "plain",
//     "target": [
//       "preview"
//     ],
//     "gitBranch": "feature-1",
//     "comment": "database connection string for production"
//   },
//   "headers": {
//     "Authorization": "Bearer <TOKEN>"
//   },
//   "method": "post"
// })
export async function run(): Promise<void> {
  try {
    const envVars = core.getMultilineInput('VARS', {
      required: true
    })
    const type = core.getInput('TYPE')
    const target = core.getInput('TARGET').split(',')
    const gitBranch = core.getInput('GIT_BRANCH')
    const body = [
      envVars.map((envVar) => ({
        key: envVar.split('=')[0],
        value: envVar.split('=')[1],
        type,
        target,
        ...(gitBranch ? { gitBranch } : {})
      }))
    ]
    await fetch(
      `https://api.vercel.com/v10/projects/${core.getInput(
        'VERCEL_PROJECT_ID',
        {
          required: true
        }
      )}/env?teamId=${core.getInput('VERCEL_ORG_ID', { required: true })}&upsert=true`,
      {
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${core.getInput('VERCEL_TOKEN', { required: true })}`,
          'Content-Type': 'application/json'
        },
        method: 'post'
      }
    )
    core.info('Environment variables upserted successfully')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
