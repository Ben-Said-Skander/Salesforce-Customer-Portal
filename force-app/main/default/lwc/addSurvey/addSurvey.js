import { LightningElement ,track,api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import createNewSurvey from '@salesforce/apex/SurveyController.createNewSurvey';



export default class EnqueteSatisfaction extends LightningElement {
  
    Question1Options = [
        { label: 'Satisfait', value: 'Satisfait' },
        { label: 'Neutre', value: 'Neutre' },
        { label: 'Insatisfait', value: 'Insatisfait' }
    ];

    Question2Options = [
        { label: 'Excellent', value: 'Excellent' },
        { label: 'Bon', value: 'Bon' },
        { label: 'Passable', value: 'Passable' },
        { label: 'Mauvais', value: 'Mauvais' }
    ];

    Question3Options = [
        { label: 'Satisfait', value: 'Satisfait' },
        { label: 'Neutre', value: 'Neutre' },
        { label: 'Insatisfait', value: 'Insatisfait' }
    ];

    @track question1
    @track question2
    @track question3

    @track textAreaValueQ4;
    @track textAreaValueQ5;

    @track rating ;

    @api case_id ;

    @track isSurveySaved = false ;



    handleQuestion1Change(event) {
        this.question1 = event.detail.value;
    }

    handleQuestion2Change(event) {
        this.question2 = event.detail.value;
    }

    handleQuestion3Change(event) {
        this.question3 = event.detail.value;
    }

    handleQuestion4Change(event) {
        this.textAreaValueQ4 = event.detail.value;
    }

    handleQuestion5Change(event) {
        this.textAreaValueQ5 = event.detail.value;
    }

    handleRatingChange(event) {
        this.rating = event.detail.rating; 
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    createSurvey() {
        if (!this.question1 || !this.question2 || !this.question3 || !this.rating) {
            this.showToast('Error', 'Veuillez répondre à toutes les questions requises.', 'error');
            return;
        }
    
        if (!this.case_id) {
            this.showToast('Error', 'Case Id is missing.', 'error');
            return;
        }
    
        createNewSurvey({
            caseId: this.case_id,
            question1: this.question1,
            question2: this.question2,
            question3: this.question3,
            question4: this.textAreaValueQ4,
            question5: this.textAreaValueQ5,
            rating:this.rating
        })
        .then(() => {
            this.showToast('Success', 'Enquete remplie avec succès.', 'success');
            this.isSurveySaved = true; // Optionally, set this to true if needed
        })
        .catch(error => {
            console.error('Error creating survey:', error);
            this.showToast('Error', 'Veuillez remplir tous les champs requis .', 'error');
        });
    }
    

    handleRetour(){
        this.isSurveySaved=true ;
    }
    
}