import { LightningElement, track, wire } from 'lwc';
import fetchApexCodeCoverage from '@salesforce/apex/TestExecutionHelper.fetchApexCodeCoverage';

export default class CoverageStats extends LightningElement {

    @track overallCoverage;
    @track notCoveredClassName = [];
    @track failedClassCoverage = [];
    @track testStats = [];
    @track notCovered;
    @track overallCoverageColor; 

    @wire(fetchApexCodeCoverage)
    wiredData({ error, data }) {
        if (data) {
            let totalLinesCovered = 0;
            let totalLinesUncovered = 0;

            data.forEach(item => {

                totalLinesCovered += item.NumLinesCovered;
                totalLinesUncovered += item.NumLinesUncovered;

                let linesCovered= item.NumLinesCovered;
                let linesUncovered= item.NumLinesUncovered;
                
                if(linesCovered===0){
                    this.notCoveredClassName.push(item.ApexClassOrTrigger.Name);
                    this.failedClassCoverage.push(0);
                }else if ((linesCovered / (linesCovered + linesUncovered)) * 100 < 75 && linesCovered!==0) {
                    this.notCoveredClassName.push(item.ApexClassOrTrigger.Name);
                    this.failedClassCoverage.push(Number((linesCovered / (linesCovered + linesUncovered)) * 100).toFixed(2));
                }
            });

            // Calculate overall coverage percentage and format to two decimal places
            let coveragePercentage = totalLinesCovered / (totalLinesCovered + totalLinesUncovered) * 100;
            this.overallCoverage = Number(coveragePercentage.toFixed(2));
         
            this.overallCoverageColor = this.overallCoverage >= 75 ? 'green' : 'red'
           

            this.updateTestStats();

        } else if (error) {
            console.error('Error fetching Apex code coverage', error);
        }
    }

    updateTestStats() {
        this.testStats = [];
        for (let i = 0; i < this.notCoveredClassName.length; ++i) {
            this.testStats.push({
                Index: i,
                name: this.notCoveredClassName[i],
                coverage: this.failedClassCoverage[i]
            });
        }
    }

}
