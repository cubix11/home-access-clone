# Server
## Security
This server is built to be as secure as possible.  
From the start, when a user signs up, they have to confirm their account.  
The only thing that the user can change without confirming their account is their email, in case they entered it wrong  
The server will generate a JSON web token which the client will take and store.  
If the user wants to update their settings, they will have to enter password  

## Routes
### Hello World