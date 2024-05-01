import { LightningElement, track,api } from 'lwc';
import getAttachmentContent from '@salesforce/apex/OpportunityController.getAttachmentContent';
import deleteLatestAttachment from '@salesforce/apex/OpportunityController.deleteLatestAttachment';
import submitForApproval from '@salesforce/apex/QuoteController.submitForApproval';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class QuotePreview extends LightningElement {

    @track base64Encoded;
    @api opportunity_id
    @api quote_id
    filename='Quote.pdf'
    @track openPDFPreview=true
    
    pdfUrl;
 
    connectedCallback() {
        this.fetchAttachmentContent();

    }
 


    fetchAttachmentContent() {
        getAttachmentContent({ opportunityId: '006Qy0000048q1HIAQ' })
            .then(result => {
                // Remove the last two characters (==) from the base64 string
                result = result.replace(/==$/, '');
                this.base64Encoded = result;

                
                console.log(this.base64Encoded);
                console.log('********************* Opp Id :'+this.opportunity_id)
               // this.displayPdf();
            })
            .catch(error => {
                console.error(error);
            });
    }
 
    displayPdf() {
        // Decode the base64 string
        const binaryData = atob(this.base64Encoded);
 
        // Convert the binary data to an array buffer
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
        }
 
        // Create a Blob object
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
        // Set the URL as the src attribute of an iframe to display the PDF
        const iframe = this.template.querySelector('iframe');
        iframe.src = url;
    }
    
    handleCancel() {
        deleteLatestAttachment({ opportunityId: this.opportunity_id })
            .then(result => {
                console.log('Deleting attachment was successful',result);
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleDownload(){
        this.openPDFPreview=false 
    }

    handleApproval() {
        submitForApproval({ quoteId: this.quote_id })
            .then(result => {
                console.log('Quote submitted for approval successfully', result);
                this.showToast('Success', 'Quote submitted for approval successfully', 'success');
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