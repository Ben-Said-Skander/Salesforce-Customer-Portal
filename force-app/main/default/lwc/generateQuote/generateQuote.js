import { LightningElement ,track,wire } from 'lwc';
import hasSyncedQuote from '@salesforce/apex/OpportunityController.hasSyncedQuote';
//import callCongaAPI from '@salesforce/apex/OpportunityController.callCongaAPI';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getSyncQuoteId from '@salesforce/apex/QuoteController.getSyncQuoteId';

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
    /*
    window.open('/apex/APXTConga4__Conga_Composer?SolMgr=1&serverUrl={!API.Partner_Server_URL_520}&Id='+
    this.oppId+'&QueryId=[lineItems]0Q_014MAQ247304&TemplateId=0T_020MAQ054658&DS7=1&DS7Preview=1&DefaultPDF=1');
    */

  
    openPDF() { 
        getSyncQuoteId({ opportunityId: this.oppId })
        .then(result => {
            this.quoteId = result;
            console.log(this.quoteId);
            this.openPDFPreview = true;
        }).catch(error => {
            console.error('Error getting quote id: ', error);
        });
    }
    

        /*
        callCongaAPI()
            .then(result => {
                console.log('Success: ', result);
                this.showToast('Success', 'PDF created successfully', 'success');
            })
            .catch(error => {
                console.error('Error calling Conga API: ', error);
                this.showToast('Error', error.message, 'error');
            });*/
    
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }


 }


