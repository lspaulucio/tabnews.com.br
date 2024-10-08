import orchestrator from 'tests/orchestrator.js';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.dropAllTables();
});

describe('GET /status', () => {
  describe('Anonymous user', () => {
    test('Retrieving current system status', async () => {
      const serverStatusResponse = await fetch(`${orchestrator.webserverUrl}/api/v1/status`);
      const serverStatusBody = await serverStatusResponse.json();

      expect.soft(serverStatusResponse.status).toBe(200);
      expect(serverStatusBody.updated_at).toBeDefined();
      expect(serverStatusBody.dependencies.database.status).toBe('healthy');
      expect(serverStatusBody.dependencies.database.opened_connections).toBeGreaterThan(0);
      expect(serverStatusBody.dependencies.database.latency.first_query).toBeGreaterThan(0);
      expect(serverStatusBody.dependencies.database.latency.second_query).toBeGreaterThan(0);
      expect(serverStatusBody.dependencies.database.latency.third_query).toBeGreaterThan(0);
      expect(typeof serverStatusBody.dependencies.database.version).toBe('string');

      expect(serverStatusBody.dependencies.webserver.status).toBe('healthy');
      expect(serverStatusBody.dependencies.webserver.provider).toBe('local');
      expect(serverStatusBody.dependencies.webserver.environment).toBe('local');
      expect(typeof serverStatusBody.dependencies.webserver.version).toBe('string');
    });
  });
});
