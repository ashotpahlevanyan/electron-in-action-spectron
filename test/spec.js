const assert = require('assert');
const path = require('path');
const Application = require('spectron').Application;
const electronPath = require('electron');
const { beforeEach, afterEach } = require('mocha');

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '..')]
	// webdriverOptions: {
	// 	deprecationWarnings: false
	// }
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
	});

	it('has a button with text "Copy from Clipboard"', async () => {
		const buttonText = await app.client
			.getText('#copy-from-clipboard');

		return assert.equal(buttonText, 'Copy from Clipboard');
	});

	it('should not have any clippings when it starts up', async () => {
		await app.client.waitUntilWindowLoaded();
		const clippings = await app.client.$$('.clippings-list-item');

		return assert.equal(clippings.length,0);
	});

	it('should have one clipping when the "Copy from Clipboard" button ' +
		'has been pressed', async () => {
		await app.client.waitUntilWindowLoaded();
		await app.client.click('#copy-from-clipboard');

		const clippings = await app.client.$$('.clippings-list-item');

		return assert.equal(clippings.length, 1);
	});

	it('should successfully remove a clipping', async () => {
		await app.client.waitUntilWindowLoaded();
		await app.client
			.click('#copy-from-clipboard')
			.moveToObject('.clippings-list-item')
			.click('.remove-clipping');

		const clippings = await app.client.$$('.clippings-list-item');

		return assert.equal(clippings.length, 0);
	});

	it('should have a correct text in a new clipping', async () => {
		await app.client.waitUntilWindowLoaded();
		await app.electron.clipboard.writeText('Vegan Ham');
		await app.client.click('#copy-from-clipboard');
		const clippingText = await app.client.getText('.clipping-text');

		return assert.equal(clippingText, 'Vegan Ham');
	});

	it('should write clipping text to the clipboard', async () => {
		await app.client.waitUntilWindowLoaded();
		await app.electron.clipboard.writeText('Vegan Ham');
		await app.client.click('#copy-from-clipboard');
		await app.electron.clipboard.writeText('Something Different');
		await app.client.click('.copy-clipping');
		const clipboardText = await app.electron.clipboard.readText();

		return assert.equal(clipboardText, 'Vegan Ham');
	});
});
