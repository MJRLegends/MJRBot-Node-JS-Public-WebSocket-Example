#!/usr/bin/env node
const WebSocket = require('ws');
const connection = new WebSocket('wss://ws.mjrlegends.com:2096');

//Handle Possible Errors
connection.on('error', function error(error) {
    console.log('Connection Error: ' + error.toString());
});

//Handle Connection Connected Events
connection.on('open', function open() {
    console.log('WebSocket Client Connected');
	sendListenRequest();
});

//Pong messages back from server confirming ping got there
connection.on('pong', function pong() {
	console.log("Connection Pong Received");
});

//Handle Connection Closed
connection.on('close', function close(reasonCode, message) {
	console.log("Connection Closed, Reason Code: " + reasonCode  + " Message: " + message);
});

//Handle Incoming messages
connection.on('message', function incoming(message) {
	const json = JSON.parse(message);
	
	//Handle Incoming Responses from our requests made
	if(json.type === "RESPONSE"){
		// If no errors were made in the request made, Error & Message will be empty marking Success
		if(json.error === "" && json.message === "")
			console.log('Request Response: Error: None Message: Success');
		else
			console.log('Request Response: Error: ' + json.error + " Message: " + json.message);	
	} 
	
	// Handle Event Messages from the topics listened for
	else if(json.type === "MESSAGE"){
		//Listen for Topic: channel_points_reward_redeem
		if(json.topic === "channel_points_reward_redeem"){
			console.log("New Channel Points Reward Redeemed, TimeStamp: " + json.message.timestamp + " | User: " + json.message.redemption.user.display_name + " | Reward ID: " +  json.message.redemption.reward.id + " | Reward Name: " +  json.message.redemption.reward.title + " | Input: " +  json.message.redemption.user_input);	
		}
		else
			console.log("Unknown Event Message " + message);
	}
});

function sendListenRequest() {
	connection.send(JSON.stringify({
		"type": "LISTEN",
		"nonce": "snLwNF1kKeYxKOqHiq195WEC52UYuGxMrm6530b9rFzKC0Yw55S52yXT5pyCLob8", // Unique Random 64 or higher string
		"channel_id": 13371337,  // Your channels personal twitch id Token can be found from https://mjrbot.mjrlegends.com/developers.php
		"topics": ["channel_points_reward_redeem"], // Topics to listen too
		"token": "TOKEN" // Your channels personal WS Token from https://mjrbot.mjrlegends.com/developers.php
	}));
}

//Send a Listen Request to tell mjrbot which topics we want to listen on
