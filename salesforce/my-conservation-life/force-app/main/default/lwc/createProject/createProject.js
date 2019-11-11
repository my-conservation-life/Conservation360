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

    // Handle when the user types something into one of the inputs
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
    
    // Save the new Project
    saveProject() {
        // Display to the user that this task is in progress
        this.template.querySelector('.status-text').value = 'Saving...';
        this.sendProject();
    }

    // Create a request to create a new Project in the open source database
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

        // Send the new project to the DB server
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
