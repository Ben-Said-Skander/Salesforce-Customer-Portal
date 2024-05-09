import { LightningElement ,track,wire } from 'lwc';
import hasSyncedQuote from '@salesforce/apex/OpportunityController.hasSyncedQuote';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getSyncQuoteId from '@salesforce/apex/QuoteController.getSyncQuoteId';
import generateQuote from '@salesforce/apex/QuoteController.generateQuote';

export default class GenerateQuote extends LightningElement {

    @track oppId;
    @track quoteId;
    @track isAtLeastOneQuoteSyncing = false;
    @track openPDFPreview=false

    connectedCallback() {
      this.getOpportunityIdFromUrl();
      console.log('id is :   '+ this.oppId);
    }

    getOpportunityIdFromUrl() {
      
      const searchString = 'recordId=';
      const url = decodeURIComponent(window.location.href);
      const startPos = url.indexOf(searchString);
      if (startPos !== -1) {
          const endPos = url.indexOf('&', startPos);
          if (endPos !== -1) {
              this.oppId = url.substring(startPos + searchString.length, endPos);
          } else {
              // If there's no '&' after the Opportunity ID, extract until the end of the URL
              this.oppId = url.substring(startPos + searchString.length);
          }
      } else {
          console.error('Opportunity ID not found in URL');
      }
  }
  
    @wire(hasSyncedQuote, { opportunityId: '$oppId' })
    wiredHasSyncedQuote({ error, data }) {
       if (data) {
        this.isAtLeastOneQuoteSyncing = data;
       } else if (error) {
        console.log(error)
       }
}

    openPDF() { 
        getSyncQuoteId({ opportunityId: this.oppId })
        .then(result => {
            this.quoteId = result;
            console.log(this.quoteId);

               generateQuote({ opportunityId: this.oppId })
               .then(result2 => {
                    console.log(result2);
               }).catch(error => {
                    console.error('Error generating quote : ', error);
               });

            this.openPDFPreview = true;
        }).catch(error => {
            console.error('Error getting quote id: ', error);
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


