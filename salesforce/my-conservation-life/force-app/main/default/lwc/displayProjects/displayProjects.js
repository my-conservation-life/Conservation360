import { LightningElement, track } from 'lwc';
import { projects } from 'c/controllers';

const actions = [
    { label: 'Edit', name: 'edit' }
];

const columns = [
    {
        label: 'Project ID',
        fieldName: 'id',
        type: 'number'
    },
    {
        label: 'Sponsor ID',
        fieldName: 'sponsor_id',
        type: 'number'
    },
    {
        label: 'Project Name',
        fieldName: 'name',
        type: 'string'
    },
    {
        label: 'Project Description',
        fieldName: 'description',
        type: 'string'
    },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
            menuAlignment: 'right'
        }
    }
];

export default class DisplayProjects extends LightningElement {
    
    @track data = [];
    @track columns = columns;
    @track tableLoadingState = true;
    @track showModal = false;
    @track currentRecord;
    @track isEditForm = false;
    hasRendered = false;
    updatedProject = {'id': undefined, 'sponsor_id': undefined, 'name': undefined, 'description': undefined};

    renderedCallback() {
        // rendered callback may be called multiple times and we do not 
        // want to keep hitting the servers
        if (!this.hasRendered)
        {
            this.updateTable();
            this.hasRendered = true;
        }
    }

    /**
     * Update table with latest queries
     */
    updateTable() {
        projects
            .find({ /** All Projects */ })
            .then(response => {
                this.data = response;
            });

        this.tableLoadingState = false;
    }

    handleRowAction(event) {
        let actionName = event.detail.action.name;
        let row = event.detail.row;

        switch (actionName) {
        case 'edit':
            this.editCurrentRecord(row);
            break;
        default:
            break;
        }
    }

    handleChange(event) {
        const field = event.target.name;
        if (field === 'project-name') {
            this.updatedProject.name = event.target.value;
        } else if (field === 'project-description') {
            this.updatedProject.description = event.target.value;
        }
    }

    editCurrentRecord(currentRow) {
        this.showModal = true;
        this.isEditForm = true;
        this.currentRecord = currentRow;
        this.updatedProject.id = this.currentRecord.id.toString();
        this.updatedProject.sponsor_id = this.currentRecord.sponsor_id.toString();
        this.updatedProject.name = this.currentRecord.name;
        this.updatedProject.description = this.currentRecord.description;
    }

    // Handling project edit form submit
    handleUpdate() {
        projects.update(this.currentRecord.id, this.updatedProject)
            .then(json => {
                // success, should return the ID of the updated project
                console.log(json);
                this.updateTable();
            })
            .catch(e => {
                // error
                console.error(e);
            });

        this.closeModal();
    }

    closeModal() {
        this.showModal = false;
    }
}