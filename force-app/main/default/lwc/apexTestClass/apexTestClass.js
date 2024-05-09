import { LightningElement ,track,wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import runTestsInNamespace from '@salesforce/apex/TestExecutionHelper.runTestsInNamespace';
import runAllTests from '@salesforce/apex/TestExecutionHelper.runAllTests';
import fetchApexCodeCoverage from '@salesforce/apex/TestExecutionHelper.fetchApexCodeCoverage';

//import deleteAllApexTestResults from '@salesforce/apex/TestExecutionHelper.deleteAllApexTestResults';



export default class DeleteTestData extends LightningElement {

    @track isThereApexClass = false ;
    @track jobId;


    @track data = [];
    columns = [
        { label: 'Apex Class Name', fieldName: 'ApexClassOrTrigger.Name', type: 'text' },
        { label: 'Lines Covered', fieldName: 'NumLinesCovered', type: 'number' },
        { label: 'Lines Uncovered', fieldName: 'NumLinesUncovered', type: 'number' },
        { label: 'Coverage %', fieldName: 'Coverage', type: 'number' }
    ];

    @wire(fetchApexCodeCoverage)
    wiredData({ error, data }) {
        if (data) {
            this.data = data.map((item) => {
                return {
                    Id: item.Id,
                    'ApexClassOrTrigger.Name': item.ApexClassOrTrigger.Name,
                    NumLinesCovered: item.NumLinesCovered,
                    NumLinesUncovered: item.NumLinesUncovered,
                    Coverage: ((item.NumLinesCovered === 0 && item.NumLinesUncovered === 0) ? 0 : item.NumLinesCovered / (item.NumLinesCovered + item.NumLinesUncovered) * 100).toFixed(2),
                };
            });
        } else if (error) {
            console.error('Error fetching Apex code coverage', error);
        }
    }

    handleClearTestData() {
            //let baseUrl = window.location.origin;
            let url = 'https://empathetic-goat-j2hay1-dev-ed.trailblaze.lightning.force.com/lightning/setup/ApexTestQueue/page?address=%2F07M'
            //let url = `${baseUrl}/lightning/setup/ApexTestQueue/page?address=%2F07M%3FClearAllData%3D1%26_CONFIRMATIONTOKEN%3DVmpFPSxNakF5TkMwd05DMHlNbFF4TURvek5Ub3pNUzQ1TWpCYSxOVUIyTnc0TkVmZkRCdUxlOWRlTjdTVC1fZDZzU3l3R0diekdRSGZtbWhvPSxObVU1WldZNQ%253D%253D`; 
            window.open(url); 
    }

    
    handleRunAllTestInNamespace() {
        runTestsInNamespace()
            .then(result => {
                this.jobId = result;
                console.log('******************'+this.jobId)
                this.showToast('Success', result, 'success');
                
            })
            .catch(error => {
                console.error('Error running tests: ', error);
            });
    }

    handleRunAllTests() {
        runAllTests()
            .then(result => {
                this.jobId = result;
                console.log('******************'+this.jobId)
                this.showToast('Success', result, 'success');
                
            })
            .catch(error => {
                console.error('Error running tests: ', error);
            });
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