public with sharing class TestExecutionHelper {

    @AuraEnabled
    public static String runAllTests() {

        List<ApexClass> testClasses = [SELECT Id FROM ApexClass ];
        List<ApexTestQueueItem> testQueueItems = new List<ApexTestQueueItem>();
       
        for (ApexClass testClass : testClasses) {
            ApexTestQueueItem item = new ApexTestQueueItem();
            item.ApexClassId = testClass.Id;
            testQueueItems.add(item);
        }
        if (!testQueueItems.isEmpty()) {
            insert testQueueItems;
            return testQueueItems[0].TestRunResultId;
        } else {
            return 'No test classes found in your namespace.';
        }
    }
    //Whats your next move ?    Discover more articles    Talk to an agent     End Chat

    @AuraEnabled
    public static String runTestsInNamespace() {
       
        List<ApexClass> testClasses = [SELECT Id FROM ApexClass WHERE NamespacePrefix = null ];
        List<ApexTestQueueItem> testQueueItems = new List<ApexTestQueueItem>();
     
        for (ApexClass testClass : testClasses) {
            ApexTestQueueItem item = new ApexTestQueueItem();
            item.ApexClassId = testClass.Id;
            testQueueItems.add(item);
        }
        if (!testQueueItems.isEmpty()) {
            insert testQueueItems;
            return testQueueItems[0].TestRunResultId;
        } else {
            return 'No test classes found in your namespace.';
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Object> fetchApexCodeCoverage() {
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:ToolingRest/services/data/v59.0/tooling/query/?q=SELECT+ApexClassOrTrigger.Name,NumLinesCovered,NumLinesUncovered+FROM+ApexCodeCoverageAggregate+ORDER+BY+ApexClassOrTrigger.Name+ASC');
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json');
        
        Http http = new Http();
        HttpResponse response = http.send(request);
    
        if (response.getStatusCode() == 200) {
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            return (List<Object>) result.get('records');
        } else {
            throw new AuraHandledException('Failed to fetch Apex code coverage: ' + response.getStatusCode() + ' - ' + response.getStatus());
        }
    }

    @AuraEnabled(cacheable=true)
    public static void deleteAllApexTestResults() {


        String sessionHeader = '<urn:ids>' + '07MQy000000um5IMAQ' + '</urn:ids>';

        String soapBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:tooling.soap.sforce.com">'
                          + '<soapenv:Header>' + sessionHeader + '</soapenv:Header>'
                          + '<soapenv:Body><urn:delete>' + '07MQy000000um5IMAQ' + '</urn:delete></soapenv:Body></soapenv:Envelope>';

        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:ToolingRest/services/Soap/T/59.0');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'text/xml');
        request.setHeader('SOAPAction', '""');
        request.setBody(soapBody);

        Http http = new Http();
        HttpResponse response = http.send(request);
        System.debug('Response status: ' + response.getStatus());
        System.debug('Response body: ' + response.getBody());
    
        }
    
    

    @AuraEnabled(cacheable=true)
    public static List<Object> getTrustMaintenanceInfo() {

        String instanceName = [select InstanceName from Organization limit 1].InstanceName;
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://api.status.salesforce.com/v1/maintenances?instance='+instanceName+'&limit=30&offset=0');
        request.setMethod('GET');
        request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
        
        Http http = new Http();
        HttpResponse response = http.send(request);
        
        if (response.getStatusCode() == 200) {
            return (List<Object>) JSON.deserializeUntyped(response.getBody());
        } else {
            throw new AuraHandledException('Error fetching maintenance info: ' + response.getStatus());
        }
    }



}
