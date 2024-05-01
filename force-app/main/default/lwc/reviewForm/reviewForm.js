import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getUserContactId from '@salesforce/apex/OpportunityController.getUserContactId';
import createCaseWithAttachment from '@salesforce/apex/CaseController.createCaseWithAttachment';
import createCaseWithoutAttachment from '@salesforce/apex/CaseController.createCaseWithoutAttachment';


export default class ReviewForm extends NavigationMixin(LightningElement) {

    @api subject;
    @api description;
    @api priority;
    @api tag_options;
    @api type_options;
    @api product;
    @api image;
    @api product_id

    @track isSelected=false;
    @track userContactId;
    @track niveauDeSupport

    @track typeValuesString = '';
    @track entitlementId

    @track imageSrc ;


    connectedCallback() {
        this.retrieveUserContactId();
    }

    retrieveUserContactId() {
        getUserContactId()
        .then(result => {
            this.userContactId = result.ContactId;
            this.niveauDeSupport = result.NiveauDeSupport;
            this.imageSrc = this.decodeBase64ToUrl(this.image); 
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error getting user contact information',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    decodeBase64ToUrl(base64String) {
        return 'data:image/png;base64,' + base64String;
    }

    createCase() {

        this.typeValuesString = this.tag_options.join(';');

        if(this.niveauDeSupport === 'Gold'){
            this.entitlementId= '550Qy000003nWFfIAM' ; 
        }else if(this.niveauDeSupport === 'Silver'){
            this.entitlementId = '550Qy000003ncIXIAY'
        }else{
            this.entitlementId = '550Qy000003p9NhIAI'
        }

        if (this.image) {        
            createCaseWithAttachment({
                subject: this.subject,
                priority: this.priority,
                description: this.description,
                contactId: this.userContactId,
                opportunityProductId: this.product_id,
                imageData: this.image,
                problemTypes: this.typeValuesString,
                type: this.type_options,
                entitlementId : this.entitlementId,
                
            })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Case created',
                        variant: 'success'
                    })
                );

                window.location.href = '/lightning/page/home';
                /*
                this[NavigationMixin.Navigate]({
                    type: 'standard__navItemPage',
                    attributes: {
                        apiName: 'Liste_des_demandes'
                    }
                }); */
            })
            .catch(error => {
                console.error('Error creating the case :', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
       
        } else {

            createCaseWithoutAttachment({
                subject: this.subject,
                priority: this.priority,
                description: this.description,
                contactId: this.userContactId,
                opportunityProductId: this.product_id,
                problemTypes: this.typeValuesString,
                type: this.type_options ,
                entitlementId : this.entitlementId,
                
            })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Demande créée avec succès.',
                        variant: 'success'
                    })
                );
                window.location.href = '/lightning/page/home';
            })
            .catch(error => {
                console.error('Error creating the case :', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }
    }
       
    handleEdit(){

        this.reviewFormData = {
            edited_subject: this.subject,
            edited_description: this.description,
            edited_priority: this.priority,
            edited_product: this.product,
            edited_image: this.image,
            product_id: this.product_id,
            edited_tag_options: this.tag_options,
            edited_type_options:this.type_options
        };

        console.log('***************************************')
        console.log(this.reviewFormData.edited_tag_options)
        
        this.isSelected=true ;
    }

}
