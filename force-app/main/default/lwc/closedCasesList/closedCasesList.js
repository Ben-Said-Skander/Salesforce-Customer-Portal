import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAllClosedCases from '@salesforce/apex/CaseController.getAllClosedCases';

const ICON_COLOR_MAPPING = new Map([
    ["grey", "default"],
    ["orange", "warning"],
]);

export default class ListeEnquete extends LightningElement {
    @track closedCases;
    @track isCaseSelected = false;
    @track selectedCaseId;

    @api totalStars = 5;
    @api size = "small";
    @api filledColor = "orange";
    @api unfilledColor = "grey";

    @wire(getAllClosedCases)
    wiredCases({ error, data }) {
        if (data) {
            this.closedCases = data.map(caseItem => {
                const rating = caseItem.Enquete_de_satisfaction__r && caseItem.Enquete_de_satisfaction__r.length > 0 ? caseItem.Enquete_de_satisfaction__r[0].Rating__c : 0;
                return {
                    ...caseItem,   
                    Opportunity_Product_Name: caseItem.Opportunity_Product__r ? caseItem.Opportunity_Product__r.Name : '',
                    Rating__c: rating ? `${rating} Etoiles` : 'Enquête pas encore remplie',
                    ClosedDate: new Date(caseItem.ClosedDate).toLocaleDateString() ,
                    buttonVariant: rating === 0 ? 'normal-button' : 'grey-button',
                    stars: this.updateStars(rating)
                };
            });
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    handleButtonClick(event) {
        const selectedCaseId = event.target.dataset.id;
        const selectedCase = this.closedCases.find(caseItem => caseItem.Id === selectedCaseId);

        if (selectedCase.Enquete_de_satisfaction__c) {
            this.showToast('Info', 'Cette demande a déjà une enquête de satisfaction remplie.', 'info');
        } else {
            this.selectedCaseId = selectedCaseId;
            this.isCaseSelected = true;
        }
    }

    updateStars(rating) {
        if (rating === 0) {
            return null;
        }
        const stars = [];
        for (let i = 0; i < this.totalStars; ++i) {
            if (i < rating) {
                stars.push({
                    Index: i,
                    State: ICON_COLOR_MAPPING.get(this.filledColor)
                });
            } else {
                stars.push({
                    Index: i,
                    State: ICON_COLOR_MAPPING.get(this.unfilledColor)
                });
            }
        }
        return stars;
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
