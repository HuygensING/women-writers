# Women's Writers Edit Environment

This app allows Women's Writers participants to edit the data stored in the Timbuctoo repository.

## Development - Getting Started

You did this already:

	$ git clone ssh://hi7.huygens.knaw.nl/data/git/neww-edit.git 

So:

	$ cd neww-edit
	$ npm install
	$ cd ../edit-forms; sudo npm link; cd -
	$ npm link timbuctoo-edit-forms
	$ grunt build
	$ grunt server:open
