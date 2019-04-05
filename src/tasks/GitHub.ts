

import * as Octokit from '@octokit/rest';
const octokit = new Octokit();

function createApprovalRequest(adapterName: string, version: string, repository: string) {
    octokit.issues.create({
        owner: 'TheAdaptiveWeb',
        repo: 'AdaptiveWeb.io',
        title: `${adapterName} version ${version}`,
        
    });
}