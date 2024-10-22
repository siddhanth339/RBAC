# Simple API for RBAC 
This is an API implementing the RBAC model which has been developed and tested using the <a href = "https://www.postman.com/" alt = "PostMan">PostMan</a> application.
This was built using Express and MongoDB.

## Description 
server/control/controls.js -> This file consists of all the methods which are used to signup, login and query the mongoDB database.<br>
server/models/dbModel.js -> This file defines the structure of the database which has three collections: users, roles and images.<br>
server/routes/route.js -> This file consists of all the routes (urls) to help the user navigate through the application.<br>
server/server.js -> This file sets up connection with the database and checks if the jwt token is expired. If the jwt token is expired, then the user has to login again.<br>

## Setup
To run this application locally, follow the steps given below:
1. Clone this repository: Open your command prompt and type: <code>git clone https://github.com/siddhanth339/RBAC.git</code>
2. Npm install: Next, run the <code> npm install </code> command, which will install all the dependencies listed in the package.json file.
3. Npm start: Finally, run the <code> npm start </code> command, this command will start the application.

## Using the API
Open PostMan.<br>

## SignUp

1. Set the method to "POST"
2. Set URL: <code>http://localhost:3000/signup</code>
3. Inside the Body section, provide details for signup: "role", "email", "password", "username".
Note that the "role" can take only one of these values (["basic", "supervisor", "developer", "admin", "superadmin"])
<img src = "./images/signup.png" alt = "signup image">

## Login

1. Set the method to "POST"
2. Set URL: <code>http://localhost:3000/login</code>
3. Inside the Body section, provide login details: "email" and "password"
<img src = "./images/login.png" alt = "login image">

<b>Note:</b> The below features can be used only after user logs in (authentication).

## Add Roles
For now, a user can be assigned with only one of these roles (["basic", "supervisor", "developer", "admin", "superadmin"]).<br>
To add a role to the roles collection, we have to first login as a "superadmin". So, create a user having role set to "superadmin".<br>
After login, copy the accessToken returned by the API which can be found at the bottom as shown in the figure below, the accessToken is used to authenticate the user.
<img src = "./images/accessToken.jpg" alt = "accessToken image"><br>

1. Set the method to "POST"
2. Set URL: <code>http://localhost:3000/addRole?email=superadmin@gmail.com</code> (the email of superadmin)
3. Set the "x-access-token" attribute in the Headers section to the accessToken value as shown in the figure below.
<img src = "./images/copyAccessTokenToHeader.jpg" alt = "copy token">

4. Also provide details of the role: "Level", "role", "Flag", "Read", "Update", "Delete". <br>
"Level": The access level of the user.<br>
"role": Role of the user.<br>
"Flag": Boolean, when set to true, only the images having access level equal to the level of the user will be displayed. If it is set to false then all the images having access level less than or equal to the access level of the user will be displayed.<br>
Example, "developer" role has "Level" set to 3 and "Flag" set to true, this means that the "developer" will be shown images having access level = 3 only.<br>
On the other hand, if the user has role as "superadmin" with "Level" set to 5 and "Flag" set to false, the "superadmin" will be able to see all the images having access level <= 5.<br>

<img src = "./images/addRole.png" alt = "add role">

If the user is not a superadmin, he/she will not be allowed to add roles to the database (RBAC in use)<br>
As shown below, user2001 was unable to access the database and add roles.<br>
<img src = "./images/userAddingRole.png" alt = "user adding role to db">

## Add images
Images can only be added by admin and superadmin. It is similar to adding role <br>
1. Set the method to "POST"
2. Set URL: <code>http://localhost:3000/addImage?email=superadmin@gmail.com</code> (the email of superadmin)
3. Set the "x-access-token" attribute in the Headers section

4. Also provide details of the image: "Name", "Size", "AccessLvl"<br>
"Name": Name of the image file.<br>
"Size": Size of the image.<br>
"AccessLvl": Who can access this image. For example, if AccessLvl = 4 then, users having Level greater than or equal to 4 can only access this image i.e., if Level of "admin" is 4, then only "admin" and "superadmin" can access this image. <br>

<img src = "./images/addImage.png" alt = "add image">

## Update Image
Users having the privilege to update images can only update the images. This privilege is set by the "superadmin" at the time of creating roles by setting the "Update" column value to "true".
1. Set the method to "POST"
2. Set URL: <code>http://localhost:3000/updateImage?email=superadmin@gmail.com</code> (the email of superadmin)
3. Set the "x-access-token" attribute in the Headers section
4. Provide details to update the image in the Body section: "Name", "Size", "AccessLvl"<br>
For example, update the AccessLvl of "image7.png" from AccessLvl = 4 to AccessLvl = 5.<br>
<img src = "./images/updateImage.png" alt = "update image">

## Delete Image
Users having the privilege to delete images can only delete the images. This privilege is set by the "superadmin" at the time of creating roles by setting the "Delete" column value to "true".
1. Set the method to "POST"
2. Set URL: <code>http://localhost:3000/deleteImage?email=superadmin@gmail.com</code> (the email of superadmin)
3. Set the "x-access-token" attribute in the Headers section
4. Provide details to delete the image in the Body section: "Name" <br>
<img src = "./images/deleteImage.png" alt = "delete image">

## Access Images
Users access images based on their access level (RBAC in use).<br>
1. Set the method to "GET"
2. Set URL: <code>http://localhost:3000/getImages?email=superadmin@gmail.com</code> (the email of superadmin)
3. Set the "x-access-token" attribute in the Headers section
4. No values have to be provided in the Body section, the application gets the user's email from the url, checks the level of the user and displays appropriate images.<br>

Example: When the superadmin logs in and then tries to get the images, all images having access level <= 5 are shown <br>
<img src = "./images/superadmin_getImages.jpg" alt = "images accessed by superadmin">

When a "basic" user logs in, he/she is shown all images having access level = 1.
<img src = "./images/basic_getImages.png" alt = "images accessed by basic user">


