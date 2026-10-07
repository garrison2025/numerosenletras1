import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const revision =
  process.env.CF_PAGES_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.BUILD_COMMIT_SHA ||
  'localdev';

if (revision !== 'localdev' && !/^[0-9a-f]{7,40}$/i.test(revision)) {
  throw new Error('Build revision environment value is not a Git SHA.');
}

const value = revision === 'localdev' ? '0000000' : revision;
writeFileSync(resolve('public/build-version.txt'), value + '\n', 'utf8');
console.log('Build revision:', value);
