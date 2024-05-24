import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createNewCommentClient from '@salesforce/apex/CommentController.createNewCommentClient';


export default class AddNote extends LightningElement {
   
    @track commentBody = '';
    @track isNewComment=false ;


    handleAjout() {
        if (!this.commentBody) {
            this.showToast('Erreur', 'Les commentaires et notes ne doivent pas être vides.', 'error');
        } else {
            console.log('Comment Body:', this.commentBody);
            createNewCommentClient({
                    comment: this.commentBody,
                })
                .then(() => {
                    this.showToast('Succès', 'Commentaire ajoutée avec succès', 'success');

                    const commentAddedEvent = new CustomEvent('commentadded');
                    this.dispatchEvent(commentAddedEvent);
                

                })
                .catch(error => {
                    console.error('Echec de l ajout de la commentaire ', error);
                    this.showToast('Erreur', 'Veuillez remplir tous les champs requis.', 'error');
                });
        }
    }

    handleRetour(){
        this.isNewComment=false ;
        const retourEvent = new CustomEvent('retour', {
            detail: { isNewComment: this.isNewComment }
        });
        this.dispatchEvent(retourEvent);
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
