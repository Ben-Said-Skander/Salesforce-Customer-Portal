/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement ,track,wire } from 'lwc';
import hasSyncedQuote from '@salesforce/apex/OpportunityController.hasSyncedQuote';
import getSyncQuoteId from '@salesforce/apex/QuoteController.getSyncQuoteId';
import generateQuote from '@salesforce/apex/QuoteController.generateQuote';

export default class GenerateQuote extends LightningElement {

    @track oppId;
    @track quoteId;
    @track isAtLeastOneQuoteSyncing = false;
    @track openPDFPreview=false
    @track showSpinner=false ;

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
    this.showSpinner = true; // Set flag to show spinner

    getSyncQuoteId({ opportunityId: this.oppId })
    .then(result => {
        this.quoteId = result;
        console.log(this.quoteId);

        generateQuote({ opportunityId: this.oppId })
        .then(result2 => {
            console.log(result2);

            setTimeout(() => {
                this.openPDFPreview = true;
                console.log('************ Sucess ***************')
                this.showSpinner = false; 
            }, 35000); 

        }).catch(error => {
            console.error('Error generating quote : ', error);
            this.showSpinner = false; 
        });

    }).catch(error => {
        console.error('Error getting quote id: ', error);
        this.showSpinner = false; 
    });
}

 }


