import { LightningElement, track, wire } from 'lwc';
import getLatestCase from '@salesforce/apex/CaseController.getLatestCase';
import closeLatestCase from '@salesforce/apex/CaseController.closeLatestCase';
import LightningConfirm from "lightning/confirm";
import hasOpenCase from '@salesforce/apex/CaseController.hasOpenCase';

export default class CasePath extends LightningElement {
      
    @track steps = [
        { label: 'Nouvelle demande', value: 'Nouvelle' },
        { label: 'En Cours de traitement', value: 'En Cours' },
        { label: 'En attente reponse client', value: 'En attente reponse client' },
        { label: 'Demande fermée', value: 'Fermé' }
    ];
    

    @track currentStep ='Nouvelle' ;
    @track subject;
    @track description;
    @track priority;
    @track openedDate;
    @track status;

    @track isThereOpenCase = false;

    connectedCallback() {
        this.loadHasOpenCase();
    }

    loadHasOpenCase() {
        hasOpenCase()
            .then(result => {
                this.isThereOpenCase = result;
            })
            .catch(error => {
                console.error('Error loading open case status', error);
            });
    }
    
    @wire(getLatestCase)
    wiredCase({ error, data }) {
        if (data) {
            this.subject = data.Subject;
            this.status = data.Status;
            this.description = data.Description;
            this.priority = data.Priority;
            this.openedDate = new Date(data.CreatedDate).toLocaleDateString();
            
            if(this.status === 'Nouvelle'){
                this.currentStep='Nouvelle';
            } else if(this.status === 'Fermé'){
                this.currentStep='Fermé';
            } else if(this.status === 'En attente reponse client'){
                this.currentStep='En attente reponse client';
            }
             else {
                this.currentStep='En Cours';
            }       
            
           
        } else if (error) {
            console.error('Error loading case', error);
        } else {
             // null
        }
    }


   async  handleConfirmClick() {
        const result = await LightningConfirm.open({
            title:'Confirmer',
            message: "Êtes-vous sûr de vouloir clôturer cette demande?",
            variant: "default", 
        });
    
        if (result) {
            try {
                await  closeLatestCase();
                this.currentStep = 'Fermé';
            } catch (error) {
                console.error('Error closing case', error);
            }
        } else {
            // user canceled
        }
    }

}
