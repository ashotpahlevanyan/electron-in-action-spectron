const assert = require('assert');
const path = require('path');
const Application = require('spectron').Application;
const electronPath = require('electron');
const { beforeEach, afterEach } = require('mocha');

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '..')]
});

describe('Clipmaster Spectron', function () {
  this.timeout(10000);

  beforeEach(() => {
    return app.start();
  });

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('shows an initial window', async () => {
    const count = await app.client.getWindowCount();

	  return assert.equal(count, 1);
  });

	it('has the correct title', async () => {
		const title = await app.client.waitUntilWindowLoaded().getTitle();

		return assert.equal(title, 'Clipmaster Spectron');
	});

	it('does not have developers tools open', async () => {
		const devToolsAreOpen = await app.client
			.waitUntilWindowLoaded()
			.browserWindow.isDevToolsOpened();

		return assert.equal(devToolsAreOpen, false);
	})
});
