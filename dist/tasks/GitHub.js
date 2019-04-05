"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Octokit = require("@octokit/rest");
const octokit = new Octokit();
function createApprovalRequest(adapterName, version, repository) {
    octokit.issues.create({
        owner: 'TheAdaptiveWeb',
        repo: 'AdaptiveWeb.io',
        title: `${adapterName} version ${version}`,
    });
}
