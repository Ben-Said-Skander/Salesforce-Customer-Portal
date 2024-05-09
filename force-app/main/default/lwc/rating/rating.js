import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getSurveyResults from '@salesforce/apex/SurveyController.getSurveyResults';

const ICON_COLOR_MAPPING = new Map([
    ["grey", "default"],
    ["orange", "warning"],
]);

export default class Rating extends NavigationMixin(LightningElement) {
   
    @api totalStars = 5;
    @api size = "medium";
    @api filledColor = "orange";
    @api unfilledColor = "grey";

    @track rating;
    @track question1;
    @track question2;
    @track question3;
    @track question4;
    @track question5;

    @track stars = [];

    connectedCallback() {
        this.getCaseIdFromUrl();
    }

    getCaseIdFromUrl() {
        const url = window.location.href;
        const parts = url.split('/');
        const caseIdIndex = parts.indexOf('Case') + 1;
        if (caseIdIndex > 0 && caseIdIndex < parts.length) {
            const caseId = parts[caseIdIndex];
            this.fetchSurveyResults(caseId);
        } else {
            console.error('Case ID not found in URL');
        }
    }

    fetchSurveyResults(caseId) {
        getSurveyResults({ caseId: caseId })
            .then(result => {
                this.rating = result.Enquete_de_satisfaction__r.Rating__c;
                this.question1 = result.Enquete_de_satisfaction__r.Question1__c;
                this.question2 = result.Enquete_de_satisfaction__r.Question2__c;
                this.question3 = result.Enquete_de_satisfaction__r.Question3__c;
                this.question4 = result.Enquete_de_satisfaction__r.Question4__c ? result.Enquete_de_satisfaction__r.Question4__c : 'Pas de remarque';
                this.question5 = result.Enquete_de_satisfaction__r.Question5__c ? result.Enquete_de_satisfaction__r.Question5__c : 'Pas de remarque';
                this.updateStars();
            })
            .catch(error => {
                console.error('Error loading rating', error);
                this.showToast('Error', 'An error occurred while loading rating', 'error');
            });
    }

    updateStars() {
        this.stars = [];
        for (let i = 0; i < this.totalStars; ++i) {
            if (i < this.rating) {
                this.stars.push({
                    Index: i,
                    State: ICON_COLOR_MAPPING.get(this.filledColor)
                });
            } else {
                this.stars.push({
                    Index: i,
                    State: ICON_COLOR_MAPPING.get(this.unfilledColor)
                });
            }
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
