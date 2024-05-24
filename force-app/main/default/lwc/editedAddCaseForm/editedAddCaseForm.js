import { LightningElement, wire, track ,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import getOpportunityProducts from '@salesforce/apex/OpportunityController.getOpportunityProducts';

const COLUMNS = [
    { label: 'Nom', fieldName: 'Name', type: 'text' },
    { label: 'Statut', fieldName: 'StageName', type: 'text' },
    { label: 'Date de clôture', fieldName: 'CloseDate', type: 'date' },
    { label: 'Selected',type: 'button',
        typeAttributes: {
            label: 'Select',
            name: 'select',
            variant: 'brand',
            iconName: 'utility:check',
            iconPosition: 'left',
            opportunityId: { fieldName: 'Id' } 
        }
    }
];

const PRODUCT_COLUMNS = [
    { type: 'checkbox', label: 'Select', typeAttributes: { disabled: false } },
    { label: 'Nom de Produit', fieldName: 'Name', type: 'text' },
    { label: 'Quantite', fieldName: 'Quantity', type: 'number' },
    { label: 'Prix Unitaire', fieldName: 'UnitPrice', type: 'currency' },
    { label: 'Prix Totale', fieldName: 'TotalPrice', type: 'currency' }
];



export default class EditedAddCaseForm extends NavigationMixin(LightningElement) {
    
    priorityOptions = [
        { label: 'Faible', value: 'Faible' },
        { label: 'Moyenne', value: 'Moyenne' },
        { label: 'Elevé', value: 'Elevé' }
    ];
    
    typeOptions = [     
        { label: 'Problèmes Techniques', value: 'Problèmes Techniques' },
        { label: 'Maintenance et Réparations', value: 'Maintenance et Réparations' },
        { label: 'Formation et Support Utilisateur', value: 'Formation et Support Utilisateur' },
        { label: 'Personnalisation des Équipements', value: 'Personnalisation des Équipements' },
        { label: 'Autre', value: 'Autre' }
    ];
    
    
    problemTagOption1 = [
        { label: 'Dysfonctionnements des équipements d imagerie (CT, IRM, échographie)', value: 'Dysfonctionnements des équipements d imagerie (CT, IRM, échographie)' },
        { label: 'Pannes de ventilateurs ou autres dispositifs respiratoires', value: 'Pannes de ventilateurs ou autres dispositifs respiratoires' },
        { label: 'Problème de calibrage du tableau de bord', value: 'Problème de calibrage du tableau de bord' },
        { label: 'Défaillance des feux de signalisation', value: 'Défaillance des feux de signalisation' },
        { label: 'Problèmes de connectivité avec les moniteurs de signes vitaux', value: 'Problèmes de connectivité avec les moniteurs de signes vitaux' },
        { label: 'Problème de surchauffe du machine', value: 'Problème de surchauffe du machine' },
        { label: 'Autre', value: 'Autre' },
    ];

    problemTagOption2 = [
        { label: 'Demandes de maintenance préventive des équipements', value: 'Demandes de maintenance préventive des équipements)' },
        { label: 'Besoin de réparations urgentes sur les dispositifs médicaux', value: 'Besoin de réparations urgentes sur les dispositifs médicaux' },
        { label: 'Autre', value: 'Autre' },
    ];
 
    problemTagOption3 = [
        { label: 'Besoin de formation pour le personnel sur les nouveaux équipements', value: 'Besoin de formation pour le personnel sur les nouveaux équipements' },
        { label: 'Besoin de Support utilisateur pour le logiciels des nouvelles machine', value: 'Besoin de Support utilisateur pour les logiciels des nouvelles machine' },
        { label: 'Formation sur l interprétation des données médicales fournies par les équipements', value: 'Formation sur l interprétation des données médicales fournies par les équipements' },
        { label: 'Demandes de manuels d utilisation ou de guides techniques', value: 'Demandes de manuels d utilisation ou de guides techniques' },
        { label: 'Autre', value: 'Autre' },
    ];

    problemTagOption4 = [
        { label: 'Demandes de configuration spécifique pour les appareils médicaux', value: 'Demandes de configuration spécifique pour les appareils médicaux' },
        { label: 'Besoin d accessoires ou de pièces de rechange', value: 'Besoin d accessoires ou de pièces de rechange' },
        { label: 'Autre', value: 'Autre' },
    ];

    
    @api edited_description
    @api edited_priority
    @api edited_tag_options
    @api edited_type_options
    @api edited_product
    @api edited_image
    @api edited_product_id
    @api edited_subject 

    @track semicolonSeparated=[]
        
    @track subject = this.edited_subject ;
    @track description = this.edited_description ;
    @track priority = this.edited_priority;
    @track tag ;
    @track type= this.edited_type_options;
    @track image= this.edited_image;
    @track productName= this.edited_product;
 
    @track opportunities;
    @track columns = COLUMNS;
    @track productColumns = PRODUCT_COLUMNS;
    @track selectedOpportunityId;
    @track opportunityProducts;
    
   
    @track selectedProductLineItem ;
    
    @track product_id

    @track isSelectedSuivant=true ;
    @track reviewFormData = {};

    @track selectedProblemTags = [];
    @track formattedString = [] ;

    @track problem1 =false ; 
    @track problem2 =false ; 
    @track problem3 =false ; 
    @track problem4 =false ; 
    @track problem5 =false ; 
    @track typeChosen =false ; 
    @track otherSubject = false ;
    
    @wire(getOpportunities)
    wiredOpportunities({ error, data }) {
        if (data) {
            this.opportunities = data;
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
            case 'select':
                this.handleSelect(row);
                break;
            default:
                break;
        }
    }

    connectedCallback() {
        this.subject = this.edited_subject ;
        this.description = this.edited_description ;
        this.priority = this.edited_priority;
        this.type= this.edited_type_options;     
        this.selectedProblemTags = this.edited_tag_options;      
        this.image= this.edited_image;
       
        this.productName= this.edited_product;
    }

    async handleSelect(event) {
        this.selectedOpportunityId = event.target.dataset.id;
       console.log('***************'+ this.selectedOpportunityId)
       try {
           const result = await getOpportunityProducts({ opportunityId:  this.selectedOpportunityId });
           this.opportunityProducts = result.map(item => ({
               ...item,
               OpportunityLineItemId: item.Id 
           }));

       } catch (error) {
           this.showToast('Error', error.body.message, 'error');
       }
   }
   
    
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedProductLineItem = selectedRows.map(row => ({
            product_id: row.OpportunityLineItemId,
            productName: row.Name
        }));

        const productIds = this.selectedProductLineItem.map(item => item.product_id);
        this.product_id = productIds[0];
        this.productName = this.selectedProductLineItem[0].productName ;

    }
    
    handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (file.type.match(/image.*/)) {
                    this.image = reader.result.split(',')[1]; 
                } else {
                    this.image = null;
                    this.showToast('Error', 'Please select a valid image file', 'error');
                }
            };
            reader.readAsDataURL(file);
        } else {
            this.image = null;
        }
    }


    handleSubjectChange(event) {
        this.subject = event.target.value;
    }

    handlePriorityChange(event) {
        this.priority = event.detail.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }
    handleTypeChange(event) {
        this.type = event.detail.value;
        switch(this.type){
            case 'Problèmes Techniques' :
                this.subject = 'Problèmes Techniques'
                this.problem1=true ;
                this.problem2=false ;
                this.problem3=false ;
                this.problem4=false ;
                this.problem5=false ;
                this.typeChosen = true ;
                break ;
            case 'Maintenance et Réparations' :
                this.subject = 'Maintenance et Réparations'
                this.problem1=false ; 
                this.problem2=true ;
                this.problem3=false ;
                this.problem4=false ;
                this.problem5=false ;
                this.typeChosen = true ;
                 break ;

            case 'Formation et Support Utilisateur' :
                this.subject = 'Formation et Support Utilisateur'
                this.problem1=false ;
                this.problem2=false ;
                this.problem3=true ;
                this.problem4=false ;
                this.problem5=false ;
                this.typeChosen = true ;
                 break ;

            case 'Personnalisation des Équipements' : 
                this.subject = 'Personnalisation des Équipements'
                this.problem4=true ;
                this.problem1=false ;
                this.problem2=false ;
                this.problem3=false ;
                this.problem5=false ;
                this.typeChosen = true ;
                 break ;

            case 'Autre' : 
                this.problem5=true ;
                this.problem1=false ;
                this.problem2=false ;
                this.problem3=false ;
                this.problem4=false ;
                this.typeChosen = false ;
                this.otherSubject = true ;   
                this.subject ='' ;
                this.selectedProblemTags=''             
                break ;
            
            default: 
                this.typeChosen = false ;
                this.problem5=false ;
                this.problem1=false ;
                this.problem2=false ;
                this.problem3=false ;
                this.problem4=false ;
        }
    }

    handleTagChange(event) {
        this.selectedProblemTags = event.detail.value;
    }

    handleSuivant() {

        if (this.subject != null &&
            this.priority != null &&
            this.type != null &&
            this.productName != null &&
            this.description != null
        ) {

            console.log('************ SUCESS **********')
            console.log(this.selectedProblemTags)

            this.isSelectedSuivant = false;
            
            this.reviewFormData = {
                subject: this.subject,
                description: this.description,
                priority: this.priority,
                productName: this.productName,
                image: this.image,
                product_id: this.product_id,
                tag: this.selectedProblemTags,
                type:this.type
            };
        } else {
  
            const evt = new ShowToastEvent({
                title: 'Erreur',
                message: 'Veuillez entrer toutes les données requises',
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
    }
}