"use strict";
/**
 *  Copyright 2019 The Adaptive Web. All Rights Reserved.
 *
 *  Licensed under the Mozilla Public License 2.0 (the "License").
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *
 *      https://www.mozilla.org/en-US/MPL/2.0/
 *
 *  or in the "license" file accompanying this file. This file is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors/safe");
exports.introduction = `This utility will walk you through the creation of a awconfig.json file.

If you want to use preferences in your project, you will need to specify them
the awconfig.json file once you have completed this utility. See
[insert documentation link here] for details.

Press ^C at any time to quit.`;
exports.nextSteps = `Next steps:
- ${colors.red(`\`awcli run\``)}:     start the watcher and test your changes in the browser,
- ${colors.red(`\`awcli build\``)}:   build a production-ready version of your adapter

Visit ${colors.blue(colors.underline('https://github.com/TheAdaptiveWeb/docs'))} for developer documentation.

🎉 ${colors.green('Thanks for helping to build a better, more accessible web; you rock!‍')} 🎉`;
exports.configWritten = `${colors.green(colors.bold('Config successfully written to awconfig.json'))}
`;
exports.devModeWarning = `${colors.bold('NOTE:')} To use this utility, you must have developer mode enabled:
To enable developer mode, visit the configuration site ( ${colors.blue(colors.underline('https://adaptiveweb.io/configure'))} ),
visit the settings menu (on the sidebar), and enable developer mode.
`;
exports.watchingFileChanges = `Watching for file changes.`;
