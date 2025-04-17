import { defineStackbitConfig } from '@stackbit/types';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  nodeVersion: '18',
  contentSources: [
    {
      name: 'content',
      type: 'files',
      location: 'content'
    }
  ],
  modelExtensions: [
    {
      name: 'page',
      type: 'page',
      urlPath: '/{slug}'
    }
  ],
  devCommand: 'npm run stackbit:dev',
  buildCommand: 'npm run build',
  deployCommand: 'npm run build',
  // Reduce memory usage for development server
  devOptions: {
    nodeOptions: ['--max-old-space-size=512']
  }
});
