const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
	apiKey: "29425700",
	apiSecret: "bIaXNE2jK5bXO4uz"
})

function text(number, message) {
	vonage.message.sendSms("18884512961", number, message, function(err, response) {
		if (err) {
			console.log(err);
			return false;
		} else {
			if (response.messages[0]["status"] === "0") {
				return true;
			} else {
				console.log(response.messages[0]["error-text"]);
				return false;
			}
		}
	})
}

module.exports = { text };