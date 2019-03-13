export default {

typescript:
`import { AdapterContext } from 'adaptiveweb';
declare const aw: AdapterContext;

/**
 * You can reference the AdapterContext with \`aw.[context method]\`.
 * 
 * For example, to get preferences, use:
 * \`\`\`
 * aw.getPreferences().then((preferences: any) => {
 *    // Do something with the preferences
 * });
 * \`\`\`
 * 
 * For full docs, see https://github.com/TheAdaptiveWeb/docs
 */

console.log('Hello, Adaptive Web!');`,

javascript:
`/**
 * You can reference the AdapterContext with \`aw.[context method]\`.
 * 
 * For example, to get preferences, use:
 * \`\`\`
 * aw.getPreferences().then(preferences => {
 *    // Do something with the preferences
 * });
 * \`\`\`
 * 
 * For full docs, see https://github.com/TheAdaptiveWeb/docs
 */

console.log('Hello, Adaptive Web!');`
}