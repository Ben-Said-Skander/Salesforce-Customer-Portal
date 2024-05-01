import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAllClosedCases from '@salesforce/apex/CaseController.getAllClosedCases';

const COLUMNS = [
    { label: 'Sujet', fieldName: 'Subject', type: 'text' },
    { label: 'Produit', fieldName: 'Opportunity_Product_Name', type: 'text' },
    { label: 'Priorité', fieldName: 'Priority', type: 'text' },
    { label: 'Date de clôture', fieldName: 'ClosedDate', type: 'date' },
    { label: 'Note Attribue sur le service', fieldName: 'Rating__c', type: 'Number' },
   
    { label: 'Sélectionné', type: 'button',
        typeAttributes: {
            label: 'Selectionner',
            name: 'select',
            variant: { fieldName: 'buttonVariant' }, 
            iconName: 'utility:check',
            iconPosition: 'left'
        }
    }
];

export default class ListeEnquete extends LightningElement {
    
    @track closedCases;
    @track isCaseSelected = false;
    @track selectedCaseId;
    @track columns = COLUMNS;

    @wire(getAllClosedCases)
    wiredCases({ error, data }) {
        if (data) {
            this.closedCases = data.map(caseItem => ({
                ...caseItem,   
                Opportunity_Product_Name: caseItem.Opportunity_Product__r ? caseItem.Opportunity_Product__r.Name : '',
                Rating__c: caseItem.Enquete_de_satisfaction__r && caseItem.Enquete_de_satisfaction__r.length > 0 ? `${caseItem.Enquete_de_satisfaction__r[0].Rating__c} Etoiles`  : 'Enquete pas encore remplie',
              
                buttonVariant: caseItem.Enquete_de_satisfaction__c ? 'neutral' : 'brand' // Set variant based on Enquete_de_satisfaction__c
            }));
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        const selectedCaseId = row.Id;

        switch (action.name) {
            case 'select':
                this.selectedCaseId = selectedCaseId;
                this.handleSelect(row);
                break;
            default:
                break;
        }
    }

    handleSelect(row) { 
        if (row.Enquete_de_satisfaction__c) {
            this.showToast('Info', 'Cette demande a déjà une enquête de satisfaction remplie .', 'info');
        } else {
            this.selectedCaseId = row.Id;
            this.isCaseSelected = true;
        }     
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}
