import 'dotenv/config';

export const config = {
    runner: 'local',
    specs: ['./src/tests/specs/**/*.spec.js'],
    maxInstances: 10,
    capabilities: [{
        browserName: 'chrome'
    }],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};
