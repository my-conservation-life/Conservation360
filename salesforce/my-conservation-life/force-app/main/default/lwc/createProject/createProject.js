import { LightningElement, track, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { projects } from 'c/controllers';
import { fireEvent } from 'c/pubsub';


/**
 * CreateProject is used to create new conservation project.
 */
export default class CreateProject extends LightningElement {

    @wire(CurrentPageReference) pageRef;

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
        projects.create(newProject)
            .then(json => {
                this.hasSuccess = true;
                fireEvent(this.pageRef, 'projectCreated', {});
                console.log(json);
            })
            .catch(e => {
                this.hasError = true;
                console.error(e);
            });
    }
}
