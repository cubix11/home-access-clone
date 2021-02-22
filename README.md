# Server
## Security
This server is built to be as secure as possible.  
From the start, when a user signs up, they have to confirm their account.  
The only thing that the user can change without confirming their account is their email, in case they entered it wrong  
The server will generate a JSON web token which the client will take and store.  
If the user wants to update their settings, they will have to enter password.  
Next, everything except for the username is encoded in the database, and even the data in the JSON web token is encoded.  

## Key
? means optional
! means required

## Routes
### Signup  
Route: /user/signup  
#### Request Body:
username!: Account username,  
password!: Account password,  
email!: Account email,  
ha_username!: Home Access username,  
ha_password!: Home Access password  
#### Responses:
409 (Conflict): Username already exists in database  
422 (Unprocessable Entity): Username or password not valid  
500 (Internal Server Error): Something went wrong when creating JSON web token.  
201 (Created): Everything went fine and user was created. Client will receive the token.  
#### Description:
This route will signup a user, or in other words create a user in the database.  
After the user is created, a confirmation email is sent for the user to verify their account.  
### Login
Route: /user/login
#### Request Body
username!: Account username  
password!: Account password  
#### Responses
404 (Not Found): Username is not found in database  
422 (Unprocessable Entity): Username or password not valid  
500 (Internal Server Error): Something went wrong when creating JSON web token.  
403 (Forbidden): Password is incorrect  
200 (Successful): Everything went correctly and client will receive token  
#### Description
This route will handle logging a user in. The client gives the username and password, and the server returns a JSON web token is the password is correct.
### Delete
Route: /user/delete
#### Request Body
password: Account password
#### Responses
404 (Not Found): Username (in JSON web token) is not found in database  
202 (Marked for deletion): User has been deleted  
403 (Forbidden): Password is incorrect  
#### Description
This route will delete the user account.  
This is not reversible!
### Update
Route: /user/update
#### Request Body
username?: NEW Account Username  
email?: NEW Email  
ha_username?: NEW Home Access username  
ha_password?: NEW Home Access password  
newPassword?: NEW Account password  
password!: Account password for security  
#### Responses
404 (Not Found): Username (in JSON web token) is not found in database  
400 (Bad Request): Trying to change username to same one as before  
409 (Conflict): Username already exists in database  
403 (Forbidden): Password is incorrect  
500 (Internal Server Error): Something went wrong when creating JSON web token.  
204 (Updated): Everything went successfully and user has been updated
#### Description
This route is used for updating settings. The reason newPassword is the name of the new password is because there is already a password field.
### Verify
Route: /user/verify
#### Responses
404 (Not Found): Username (in JSON web token) is not found in database  
403 (Forbidden): Password is incorrect  
200 (Successful): User has been verified
#### Description
This route is what the user goes to verify their account. This link is what is sent to their email.