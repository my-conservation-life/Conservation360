import { LightningElement, track, api } from 'lwc';
import controllers from 'c/controllers';

/**
 * CreateProject is used to create new conservation project.
 */
export default class CreateProject extends LightningElement {

    // Controller object used to access the database
    c = controllers;

    // The ID of the project's sponsor
    @track sponsorId = 1; // Todo: somehow we need to get the current sponsor ID

    // The name of the project
    @track projectName = '';

    // The description of the project.
    @track projectDescription = '';

    @track hasSuccess = false;
    @track hasError = false;

    handleChange(event) {
        const field = event.target.name;
        if (field === 'sponsor-id') {
            this.sponsorId = event.target.value;
        } else if (field === 'project-name') {
            this.projectName = event.target.value;
        } else if (field === 'project-description') {
            this.projectDescription = event.target.value;
        }
    }
    
    saveProject() {

        // Display to the user that this task is in progress
        this.template.querySelector('.status-text').value = 'Saving...';

        let valid = true;
        if (/*is valid*/valid)        // Todo validate from
            this.sendProject();
    }

    @api
    sendProject() {
        // The new project from the lwc inputs
        const newProject = {
            project: {
                name: this.projectName,
                description: this.projectDescription,
                sponsor_id: this.sponsorId.toString()
            }
        };

        this.c.projects.create(newProject)
            .then(json => {
                this.hasSuccess = true;
                console.log(json);
            })
            .catch(e => {
                this.hasError = true;
                console.error(e);
            });
    }

}