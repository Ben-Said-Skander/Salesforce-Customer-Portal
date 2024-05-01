import { LightningElement, track, wire } from 'lwc';
import getAgentComment from '@salesforce/apex/CommentController.getAgentComment';
import getClientComment from '@salesforce/apex/CommentController.getClientComment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import hasOpenCase from '@salesforce/apex/CaseController.hasOpenCase';
import { refreshApex } from '@salesforce/apex';


export default class CaseComment extends LightningElement {
   
    @track isNewComment = false;
    @track clientComments;
    @track wiredClientComments;

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
    
    @wire(getClientComment)
    wiredComments(result) {
        this.wiredClientComments = result;
        if (result.data) {
            this.clientComments = result.data.map(comment => ({
                clientCommentBody: comment.Comment_Body__c,          
                clientCreatedDate: this.formatDate(comment.Created_Date_Time__c),
            }));
        } else if (result.error) {
            this.showToast('Error', result.error.body.message, 'error');
        }
    }

    @wire(getAgentComment)
    wiredAgentComments({ error, data }) {
        if (data) {
            this.agentComments = data.map(comment => ({
                agentCommentBody: comment.CommentBody,
                agentCreatedDate: this.formatDate(comment.CreatedDate),
                 
            }));
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    refreshComments() {
        return refreshApex(this.wiredClientComments);
    }

    handleNewComment() {
        this.isNewComment = true;
    }

    handleRetour() {
        this.refreshComments()
            .then(() => {
                this.isNewComment = false;
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
