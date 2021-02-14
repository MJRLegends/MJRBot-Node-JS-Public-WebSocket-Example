#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient({
	keepalive: true, // Settings to make connection send server a ping every 30 seconds
	keepaliveInterval: 30000
});


//Handle Connection Related Errors during connection phrase
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

//Handle Connection Connected Events
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');

	//Handle Possible Errors
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
	
	//Pong messages back from server confirming ping got there
    connection.on('pong', function() {
        console.log("Connection Pong Received");
    });
	
	//Handle Connection Closed
    connection.on('close', function(reasonCode, message) {
        console.log("Connection Closed, Reason Code: " + reasonCode  + " Message: " + message);
    });
	
	//Handle Incoming messages
    connection.on('message', function(message) {
		if (message.type === 'utf8') {
			const json = JSON.parse(message.utf8Data);
			
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
				if(json.topic === "channel_points_reward_redeem")
					console.log("New Channel Points Reward Redeemed, TimeStamp: " + json.message.timestamp + " | User: " + json.message.redemption.user.display_name + " | Reward ID: " +  json.message.redemption.reward.id + " | Reward Name: " +  json.message.redemption.reward.title + " | Input: " +  json.message.redemption.user_input);	
				else
					console.log("Unknown Event Message " + message.utf8Data);
			}
		}
		else
			console.log("Unknown Message Type " + message.type);
    });
    
   function sendListenRequest() {
        if (connection.connected) {
			connection.send(JSON.stringify({
                "type": "LISTEN",
                "nonce": "snLwNF1kKeYxKOqHiq19%WEC*2UYuGxMrm6*30b9rFzKC0Yw5$S^2yXT!pyCLob8", // Unique Random 64 or higher string
                "channel_id": ID,  // Your channels personal twitch id Token can be found from https://mjrbot.mjrlegends.com/developers.php
                "topics": ["channel_points_reward_redeem"], // Topics to listen too
                "token": "TOKEN" // Your channels personal WS Token from https://mjrbot.mjrlegends.com/developers.php
            }));
        }
    }
	
	//Send a Listen Request to tell mjrbot which topics we want to listen on
    sendListenRequest();
});

//Create Connection
client.connect('wss://ws.mjrlegends.com:2096');