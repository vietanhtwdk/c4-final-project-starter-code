# c4-final-project-starter-code

# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

# TODO items

The application should store TODO items, and each TODO item contains the following fields:

* `todoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a TODO item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item
 
## Deploy process:
### Step 1: Set up serverless
```cmd
npm install -g serverless@2.21.1
serverless login
sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
```
### Step 2: Deploy
```cmd
cd backend
npm update --save
npm audit fix
# For the first time, create an application in your org in Serverless portal
serverless
# Next time, deploy the app and note the endpoint url in the end
serverless deploy --verbose
```
### Step 3: Clean up
```cmd
serverless remove
```
## Client run:
### Step 1: Update variable
in client\src\config.ts update apiId, domain, clientId

### Step 2: Run client
```cmd
cd client
npm update --save
npm audit fix --legacy-peer-deps
npm install --save-dev
npm run start
```
