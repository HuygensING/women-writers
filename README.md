# Women's Writers Edit Environment

This app allows Women's Writers participants to edit the data stored in the Timbuctoo repository.

## Development - Getting Started

You did this already:

	$ git clone ssh://hi7.huygens.knaw.nl/data/git/neww-edit.git

Now:

	$ git clone ssh://hi7.huygens.knaw.nl/data/git/edit-forms.git

	$ cd edit-forms

	$ sudo npm install

	$ sudo npm link

	$ cd ../neww-edit

	$ npm link timbuctoo-edit-forms

	$ npm install

	$ cd node_modules/grunt-express
	
	$ npm install
	
	$ cd ../../

	$ grunt server:open

## Deploying

	$ ssh-copy-id {user}@{server} (should be done only once)
	$ grunt deploy --target={target}
 
	see for the user, server and target config/targets.yaml
