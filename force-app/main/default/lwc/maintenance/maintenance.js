import { LightningElement, wire, track } from 'lwc';
import getTrustMaintenanceInfo from '@salesforce/apex/TestExecutionHelper.getTrustMaintenanceInfo';

const columns = [
    { label: 'Name', fieldName: 'name', type: 'text' },
    { label: 'Maintenance Type', fieldName: 'maintenanceType', type: 'text' },
    { label: 'Event Status', fieldName: 'eventStatus', type: 'text' },
    { label: 'Start Time', fieldName: 'plannedStartTime', type: 'date' },
    { label: 'Service Keys', fieldName: 'serviceKeys', type: 'text' },
    { label: 'Passed Time', fieldName: 'passStatus', type: 'text' },
];

export default class Maintenance extends LightningElement {
   
    columns = columns;
    @track domain;
    @track data = [];

    @wire(getTrustMaintenanceInfo)
    wiredData({ error, data }) {
        if (data) {
            this.data = data.map((item) => {
                let plannedStartTime = new Date(item.plannedStartTime);
                let isPassed = plannedStartTime < new Date();

                return {
                    id: item.id,
                    name: item.name,
                    maintenanceType: item.message ? item.message.maintenanceType : '',
                    eventStatus: item.message ? item.message.eventStatus : '',
                    plannedStartTime: new Date(item.plannedStartTime).toLocaleDateString(),
                    serviceKeys: item.serviceKeys ? item.serviceKeys.join(', ') : '',
                    passStatus: isPassed
                };
            });
        } else if (error) {
            console.error('Error fetching maintenances', error);
        }
    }


    handleReleaseUpdate(){

     const myDomain = window.location.hostname.split('.')[0];
     const url = `https://${myDomain}.trailblaze.lightning.force.com/lightning/setup/ReleaseUpdates/home`;
     console.log('URL:', url);

     window.open(url) ;
 
    }
}




    





