import { LightningElement } from 'lwc';
import closeLatestCase from '@salesforce/apex/CaseController.closeLatestCase';


export default class TestComponent extends LightningElement {
  
    handleConfirmClick() {
        closeLatestCase();
    }

}