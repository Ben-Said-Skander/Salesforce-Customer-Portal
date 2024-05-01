import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createNewCommentAgent from '@salesforce/apex/CommentController.createNewCommentAgent';


export default class AddCommentAgent extends LightningElement {

    @track commentBody = '';
    @track isChecked = false;

    handleChange(event) {
        this.isChecked = event.target.checked;
    }

    handleAjout() {
        if (!this.commentBody) {
            this.showToast('Error', 'Les commentaires et notes ne doivent pas être vides.', 'error');
        } else {
            console.log('Comment Body:', this.commentBody);
            createNewCommentAgent({
                    comment: this.commentBody,
                    isPublic: Boolean(this.isChecked)
                })
                .then(() => {
                    this.showToast('Success', 'Commentaire ajoutée avec succès', 'success');
                })
                .catch(error => {
                    console.error('Echec de l ajout de la commentaire ', error);
                    this.showToast('Error', 'Veuillez remplir tous les champs requis.', 'error');
                });
        }
    }

    handleCommentChange(event) {
        this.commentBody = event.detail.value;
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