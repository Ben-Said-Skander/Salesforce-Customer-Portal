import { LightningElement, track, wire } from 'lwc';
import getArticlesByCaseType from '@salesforce/apex/KnowledgeController.getArticlesByCaseType';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import hasOpenCase from '@salesforce/apex/CaseController.hasOpenCase';

export default class WorkAroundSolutions extends LightningElement {
    @track articles;

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

    @wire(getArticlesByCaseType)
    wiredArticles({ error, data }) {
        if (data) {
            this.articles = data;
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
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

    get hasArticles() {
        return this.articles && this.articles.length > 0;
    }
}
