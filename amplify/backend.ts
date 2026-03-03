import { defineBackend } from '@aws-amplify/backend';

/**
 * Amplify Gen 2 Backend Configuration
 * 
 * This is a minimal backend config for hosting only.
 * The actual backend (API, Auth, Database) is managed by CDK.
 */
const backend = defineBackend({
  // No backend resources defined - using existing CDK infrastructure
});

export default backend;
