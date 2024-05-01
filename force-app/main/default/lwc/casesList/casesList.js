import { LightningElement, track, wire } from 'lwc';
import getAllCases from '@salesforce/apex/CaseController.getAllCases';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'Sujet', fieldName: 'Subject', type: 'text' },
    { label: 'Produit', fieldName: 'Opportunity_Product_Name', type: 'text' },
    { label: 'Statut', fieldName: 'Status', type: 'text' },
    { label: 'Priorité', fieldName: 'Priority', type: 'text' },
    { label: 'Date de création', fieldName: 'CreatedDate', type: 'date' },
];

export default class ListeDemandes extends NavigationMixin(LightningElement) {
   
    @track cases;
    @track columns = COLUMNS;

    @wire(getAllCases)
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data.map(caseItem => ({
                ...caseItem,
                Opportunity_Product_Name: caseItem.Opportunity_Product__r ? caseItem.Opportunity_Product__r.Name : ''
            }));
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
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

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
            case 'select':
                this.navigateToRecord(row.Id);
                break;
            default:
                break;
        }
    }
}
