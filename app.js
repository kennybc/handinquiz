const express = require("express");
const actions = require("./lib/actions.js");
const sms = require("./lib/sms.js");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.sendFile( __dirname + "/public/" + "index.html" );
})

app.post('/', function(req, res) {
	const phone = "1" + req.body.phone;
	res.setHeader("content-type", "text/html");
	res.write("<p> Working on it... </p>");
	actions.start(req).then(function(response) {
		// response is string if failed, browser if logged in successfully
		if (typeof response === "string") {
			res.end("<p> " + response + " </p>")
		} else {
			function attempt() {
				actions.attempt(response).then(function(new_response) {
					if (new_response == 1) {
						res.end("<p> Quiz submitted successfully </p>");
						sms.text(phone, "Quiz submitted successfully ");
						clearInterval(attempts);
					} else if (new_response == 0){
						res.write("<p> Quiz has not opened yet, trying again in 2 minutes </p>");
					} else if (new_response == 2) {
						res.end("<p> Quiz is not just a check-in </p>");
						sms.text(phone, "Quiz is not just a check-in ");
						clearInterval(attempts);
					}
				});
			}
			const attempts = setInterval(attempt, 120000);
			attempt();
			setTimeout(function() {
				sms.text(phone, "Quiz has not opened after 2 hours, your request has timed out ");
				clearInterval(attempts);
			}, 7200000);
		}
	});
})

app.listen(port, function() {
	console.log("App started on port " + port);
})
