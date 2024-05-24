import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import runTestsInNamespace from '@salesforce/apex/TestExecutionHelper.runTestsInNamespace';
import runAllTests from '@salesforce/apex/TestExecutionHelper.runAllTests';
import fetchApexCodeCoverage from '@salesforce/apex/TestExecutionHelper.fetchApexCodeCoverage';
import { refreshApex } from '@salesforce/apex';

export default class DeleteTestData extends LightningElement {
    @track isThereApexClass = false;
    @track jobId;
    @track rowStyle;
    @track data = [];
    @track wiredData;

    columns = [
        { label: 'Apex Class Name', fieldName: 'ClassName', type: 'text' },
        { label: 'Lines Covered', fieldName: 'NumLinesCovered', type: 'number' },
        { label: 'Lines Uncovered', fieldName: 'NumLinesUncovered', type: 'number' },
        { label: 'Coverage %', fieldName: 'Coverage', type: 'number' }
    ];

    @wire(fetchApexCodeCoverage)
    wiredDataResult(result) {
        this.wiredData = result;
        if (result.data) {
            this.data = result.data.map((item) => {
                let coverage = ((item.NumLinesCovered === 0 && item.NumLinesUncovered === 0) ? 0 : item.NumLinesCovered / (item.NumLinesCovered + item.NumLinesUncovered) * 100).toFixed(2);
                this.rowStyle = parseFloat(coverage) < 75 ? 'row-red' : 'row-green';
                return {
                    Id: item.Id,
                    ClassName: item.ApexClassOrTrigger.Name,
                    NumLinesCovered: item.NumLinesCovered,
                    NumLinesUncovered: item.NumLinesUncovered,
                    Coverage: coverage,
                    RowStyle: this.rowStyle
                };
            });
        } else if (result.error) {
            console.error('Error fetching Apex code coverage', result.error);
        }
    }

    refreshData() {
        return refreshApex(this.wiredData);
    }

    handleClearTestData() {
        let baseUrl = window.location.origin;
        let url = `${baseUrl}/lightning/setup/ApexTestQueue/page?address=%2F07M`;
        window.open(url);
    }

    handleRunAllTestInNamespace() {
        runTestsInNamespace()
            .then(result => {
                this.jobId = result;
                console.log('******************' + this.jobId);
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
                console.log('******************' + this.jobId);
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
/*
Cordialement,
L'équipe Philips Health Care
#0B5ED8
*/