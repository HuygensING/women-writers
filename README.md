# Women's Writers Edit Environment

This app allows Women's Writers participants to edit the data stored in the Timbuctoo repository.

## Development - Getting Started

You probably did this already (or you wouldn't be reading this):

	$ git clone ssh://hi7.huygens.knaw.nl/data/git/women-writers.git

Now:

	$ git clone ssh://hi7.huygens.knaw.nl/data/git/edit-forms.git

	$ cd edit-forms

	$ sudo npm install

	$ sudo npm link

	$ cd ../women-writers

	$ npm link timbuctoo-edit-forms

	$ npm install

	$ cd node_modules/grunt-express
	
	$ npm install
	
	$ cd -

	$ grunt server:open

## Deploying

The Gruntfile contains instructions to deploy the frontend to test and production environments. It basically builds the entire frontend from source files, and then rsyncs the build over SSH to the specified server, using the SSH login info contained in `config/targets.json`

To set up the SSH transfer, you need to exchange the public key, so you won't have to enter the password each time you want to deploy:

	$ ssh-copy-id {user}@{server} (should be done only once)
	
Then:

	$ grunt deploy --target={target}
 
See for the user, server and target config/targets.json

Deployment-specific variables are contained in the `config/target/{target}.json` files.

### Deploying to production

Releasing to production should only ever be done from the master branch, for easy rolling back.

	$ git checkout master
	$ grunt deploy --target=production

### Deploying to test
	
	$ git checkout test
	$ grunt deploy --target=test