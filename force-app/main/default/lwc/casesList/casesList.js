import { LightningElement, track, wire } from 'lwc';
import getAllCases from '@salesforce/apex/CaseController.getAllCases';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ListeDemandes extends NavigationMixin(LightningElement) {
    @track cases;

    @wire(getAllCases)
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data.map(caseItem => ({
                ...caseItem,
                Opportunity_Product_Name: caseItem.Opportunity_Product__r ? caseItem.Opportunity_Product__r.Name : '',
                CreatedDate: new Date(caseItem.CreatedDate).toLocaleDateString() ,
            }));
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    handleRowAction(event) {
        const rowId = event.currentTarget.dataset.id;
        if (rowId) {
            this.navigateToRecord(rowId);
        }
    }

    navigateToRecord(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Case',
                actionName: 'view'
            }
        });
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
