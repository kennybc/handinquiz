const { remote } = require('webdriverio');

async function start(req) {
    const browser = await remote({
        capabilities: { browserName: 'chrome' },
		logLevel : "silent"
    })
	
    await browser.url(req.body.url);
	
	if(await login(browser, req)) {
		return browser;
	} else {
		quit(browser);
		return "Incorrect username or password";
	}
}

async function login(browser, req) {
	const title = await browser.getTitle();
	const user_input = await browser.$('[name="user[username]"]');
	const pass_input = await browser.$('[name="user[password]"]');
	await user_input.setValue(req.body.user);
	await pass_input.setValue(req.body.pass);
	
	const submit_input = await browser.$('[name="commit"]');
	await submit_input.click();
	
	const quiz = await browser.getTitle();
	if (quiz === title) {
		quit(browser);
		return false;
	} else {
		console.log("Logged in successfully");
		return true;
	}
}

async function attempt(browser) {
	const base_url = await browser.getUrl();
	await browser.url(base_url + "/submissions/new");
	const new_url = await browser.getUrl();
	if (new_url === base_url) {
		return 0;
	} else {
		const inputs = await browser.$$('form input');
		if (inputs.length > 7) {
			quit(browser);
			return 2;
		}
		const i_am_here = await browser.$('[name="answers[newsub][0][main]"]');
		const commit = await browser.$('[name="commit"]');
		await i_am_here.click();
		await commit.click();
		quit(browser);
		return 1;
	}
}

async function quit(browser) {
	await browser.deleteSession();
}

module.exports = { start, attempt };