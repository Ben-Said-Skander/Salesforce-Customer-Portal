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
        { label: 'Problème électronique', value: 'Hardware' },
        { label: 'Problème logiciel', value: 'Software' },
        { label: 'Autre', value: 'Other' }
    ];
    
    
    problemTagOptions = [
        { label: 'Problème de démarrage du moteur', value: 'Problème de démarrage du moteur' },
        { label: 'Bruits anormaux du moteur', value: 'Bruits anormaux du moteur' },
        { label: 'Problème de calibrage du tableau de bord', value: 'Problème de calibrage du tableau de bord' },
        { label: 'Défaillance des feux de signalisation', value: 'Défaillance des feux de signalisation' },
        { label: 'Incompatibilité avec un système électronique(Bluetooth..)', value: 'Incompatibilité avec un système électronique(Bluetooth..)' },
        { label: 'Problème de fuite de liquide', value: 'Problème de fuite de liquide' },
        { label: 'Problème de surchauffe du moteur', value: 'Problème de surchauffe du moteur' },
        { label: 'Problème de climatisation', value: 'Problème de climatisation' },
        { label: 'Problème de carrosserie', value: 'Problème de carrosserie' },
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

    async handleSelect(row) {
        this.selectedOpportunityId = row.Id;
        try {
            const result = await getOpportunityProducts({ opportunityId: this.selectedOpportunityId });
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
    }

    handleTagChange(event) {
        this.selectedProblemTags = event.detail.value;
    }

    handleSuivant() {

        if (this.subject != null &&
            this.priority != null &&
            this.type != null &&
            this.productName != null &&
            this.selectedProblemTags.length > 0 &&
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