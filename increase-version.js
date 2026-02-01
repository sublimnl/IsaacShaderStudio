#!/usr/bin/env node
import fs from 'fs/promises';

console.log('Incrementing build number...');

const content = await fs.readFile('src/demo/build.json', 'utf-8');
const metadata = JSON.parse(content);

metadata.buildRevision = metadata.buildRevision + 1;
metadata.timestamp = Date.now();

await fs.writeFile('src/demo/build.json', JSON.stringify(metadata));

console.log(`Current build number: ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`);
