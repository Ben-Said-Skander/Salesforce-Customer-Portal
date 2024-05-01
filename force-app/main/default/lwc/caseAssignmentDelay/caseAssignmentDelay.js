/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, api, wire,track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

export default class CaseAssignmentDelay extends LightningElement {
    @api recordId;
    @track totalElapsedSeconds = 0;
    @track totalSLATime ;
    @track circleClass; 

    slaTimeLeft = 0;
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
            console.log(this.caseId);
        } else {
            console.error('Case ID not found in URL');
        }
    }

    @wire(getRecord, { recordId: '$caseId', fields: ["Case.Assignment_Delay__c", "Case.Status",'Case.SLA_Deadline__c'] })
    wiredRecord({ error, data }) {
        if (data) {
            this.totalSLATime = data.fields.SLA_Deadline__c.value;
            this.slaTimeLeft = data.fields.Assignment_Delay__c.value;

            this.circleClass = 'green';
            if (this.slaTimeLeft < 3600 ) {
              
               this.circleClass = 'red';
               console.log(this.slaTimeLeft)
           } 

            this.calculateTime(this.slaTimeLeft);
            this.startTimer();
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