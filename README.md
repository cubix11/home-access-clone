# Server
## Security
This server is built to be as secure as possible.  
From the start, when a user signs up, they have to confirm their account.  
The only thing that the user can change without confirming their account is their email, in case they entered it wrong  
The server will generate a JSON web token which the client will take and store.  
If the user wants to update their settings, they will have to enter password.  
Next, everything except for the username is encoded in the database, and even the data in the JSON web token is encoded.  

## Routes
### Signup  

Route: /user/signup  

Request Body:  
username: Account username,  
password: Account password,  
email: Account email,  
ha_username: Home Access username,  
ha_password: Home Access password  
  
Responses:  
409 (Conflict): Username already exists in database  
422 (Unprocessable Entity): Username or password not valid  
500 (Internal Server Error): Something went wrong when creating JSON web token.  
201 (Created): Everything went fine and user was created. Client will receive the token.  

Description:  
This route will signup a user, or in other words create a user in the database.  
After the user is created, a confirmation email is sent for the user to verify their account.  

### Login
#### Hello World
404 (Not Found): Username is not found in database  
422 (Unprocessable Entity): Username or password not valid  
500 (Internal Server Error): Something went wrong when creating JSON web token.  
403 (Forbidden): Password is incorrect  
200 (Successful): Everything went correct and client will receive token  