import { LightningElement, track,api } from 'lwc';
import deleteLatestAttachment from '@salesforce/apex/OpportunityController.deleteLatestAttachment';
import submitForApproval from '@salesforce/apex/QuoteController.submitForApproval';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getLatestQuoteContentDocumentId from '@salesforce/apex/QuoteController.getLatestQuoteContentDocumentId';

export default class QuotePreview extends LightningElement {

    
    @api opportunity_id
    @api quote_id

    @track openPDFPreview=true
    @track documentId ;

    connectedCallback() {
        this.getDocument();     
      }

    getDocument(){
        getLatestQuoteContentDocumentId({ opportunityId: this.opportunity_id })
        .then(result => {
            this.documentId=result ;
            console.log('********************************' + this.documentId)
        }
        ).catch(error => {
            console.error(error);
        });
    }
   
    get pdfUrl() {        
        return '/sfc/servlet.shepherd/document/download/'+this.documentId;
    }

    handleCancel() {
        deleteLatestAttachment({ opportunityId: this.opportunity_id })
            .then(result => {
                console.log('Deleting attachment was successful',result);
                window.location.href = '/lightning/r/Opportunity/'+this.opportunity_id+'/view';
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleDownload(){
        window.location.href = '/lightning/r/Opportunity/'+this.opportunity_id+'/view';
    }

    handleApproval() {
        submitForApproval({ quoteId: this.quote_id })
            .then(result => {
                console.log('Quote submitted for approval successfully', result);
                this.showToast('Success', 'Quote submitted for approval successfully', 'success');
                window.location.href = '/lightning/r/Opportunity/'+this.opportunity_id+'/view';
            })
            .catch(error => {
                console.error(error);
            });
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