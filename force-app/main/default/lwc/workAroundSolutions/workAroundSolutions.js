import { LightningElement, track, wire } from 'lwc';
import getArticlesByCaseType from '@salesforce/apex/KnowledgeController.getArticlesByCaseType';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import hasOpenCase from '@salesforce/apex/CaseController.hasOpenCase';

export default class WorkAroundSolutions extends LightningElement {
    @track articles;
    @track filteredArticles;
    @track searchQuery = '';
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
            this.articles = data.map(article => {
                return {
                    ...article,
                    fullUrl: `https://empathetic-goat-j2hay1-dev-ed.trailblaze.lightning.force.com/lightning/r/Knowledge__kav/${article.Id}/view`
                };
            });
            this.filteredArticles = this.articles;
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    handleSearch(event) {
        this.searchQuery = event.target.value.toLowerCase();
        this.filteredArticles = this.articles.filter(article =>
            article.Title.toLowerCase().includes(this.searchQuery)
        );
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
        return this.filteredArticles && this.filteredArticles.length > 0;
    }
}
