/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, api, wire,track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

export default class CaseAssignmentDelay extends LightningElement {
    @api recordId;
    @track caseStatus;
    @track totalElapsedSeconds = 0;
    @track timeLeft;
    @track newSLATime
    @track slaTimeLeft
    @track totalSLATime
    @track circleClass; 

    hours = 0;
    minutes = 0;
    seconds = 0;
    interval;

    connectedCallback() {
        this.getCaseIdFromUrl();
    }

    getCaseIdFromUrl() {
        const url = window.location.href;
        const parts = url.split('/');
        const caseIdIndex = parts.indexOf('Case') + 1;
        if (caseIdIndex > 0 && caseIdIndex < parts.length) {
            this.caseId = parts[caseIdIndex];
        } else {
            console.error('Case ID not found in URL');
        }


        
    }


    @wire(getRecord, { recordId: '$caseId', fields: ['Case.Assignment_Delay__c', 'Case.Status'] })
    wiredRecord({ error, data }) {
        if (data) {
            this.slaTimeLeft = data.fields.Assignment_Delay__c.value;
            this.caseStatus = data.fields.Status.value;
         
            this.circleClass = 'green';

            this.calculateTime(this.slaTimeLeft);
            this.startTimer();

            if (this.slaTimeLeft < 3600 ) {
               
                this.circleClass = 'red';
                console.log(this.slaTimeLeft)
            } 
          
        } else if (error) {
            console.error('Error loading record', error);
        }
    }

    calculateTime(timeInSeconds) {
        this.hours = Math.floor(timeInSeconds / 3600);
        this.minutes = Math.floor((timeInSeconds % 3600) / 60);
        this.seconds = Math.floor(timeInSeconds % 60);
    }

    startTimer() {
        this.interval = setInterval(() => {
            this.totalElapsedSeconds++;
            if (this.seconds > 0) {
                this.seconds--;
            } else {
                if (this.minutes > 0) {
                    this.minutes--;
                    this.seconds = 59;
                } else {
                    if (this.hours > 0) {
                        this.hours--;
                        this.minutes = 59;
                        this.seconds = 59;
                    } else {
                        clearInterval(this.interval);
                    }
                }
            }
        }, 1000);
    }
    
    get formattedTime() {
        return `${this.pad(this.hours)}h ${this.pad(this.minutes)}m ${this.pad(this.seconds)}s`;
    }

    pad(value) {
        return value < 10 ? '0' + value : value;
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }
   
}