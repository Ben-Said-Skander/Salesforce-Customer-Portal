import { LightningElement } from 'lwc';
import deleteLatestDocument from '@salesforce/apex/QuoteController.deleteLatestDocument';


export default class TestComponent extends LightningElement {
  
    handleConfirmClick() {
        deleteLatestDocument({ opportunityId: '006Qy0000048q1HIAQ' })
        .then(result => {
            console.log('Deleting attachment was successful',result);
        })
        .catch(error => {
            console.error(error);
        });
    }

}