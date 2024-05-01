public with sharing class OpportunityController {
   

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        String userEmail = UserInfo.getUserEmail();
        Contact contact = [SELECT AccountId FROM Contact WHERE Email = :userEmail LIMIT 1];
        return [SELECT Id, Name, StageName, CloseDate FROM Opportunity WHERE AccountId = :contact.AccountId ORDER BY CloseDate DESC LIMIT 3];

    }

    @AuraEnabled(cacheable=true)
    public static String getAttachmentContent(Id opportunityId) {
        Attachment attachment = [SELECT Id, Body FROM Attachment WHERE ParentId = :opportunityId ORDER BY CreatedDate DESC LIMIT 1];
        return EncodingUtil.base64Encode(attachment.Body);
    }

    @AuraEnabled
    public static void deleteLatestAttachment(Id opportunityId) {
        Attachment attachment = [SELECT Id, Body FROM Attachment WHERE ParentId = :opportunityId ORDER BY CreatedDate DESC LIMIT 1];
        delete attachment ;
    }



    @AuraEnabled(cacheable=true)
    public static Boolean hasSyncedQuote(String opportunityId) {
        String userEmail = UserInfo.getUserEmail();
        Contact contact = [SELECT AccountId FROM Contact WHERE Email = :userEmail LIMIT 1];
        List<Quote> quotes = [SELECT Id FROM Quote WHERE AccountId = :contact.AccountId AND OpportunityId = :opportunityId AND IsSyncing = true LIMIT 1];
        return !quotes.isEmpty();
    }
    

    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunityProducts(String opportunityId) {
        return [SELECT Id, Name, Quantity, UnitPrice, TotalPrice,Product2Id,Product2.Name FROM OpportunityLineItem WHERE OpportunityId = :opportunityId];
    }
    

    @AuraEnabled(cacheable=true)
    public static String getContactEmail() {
        String userEmail = UserInfo.getUserEmail();
        return userEmail ;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String,String> getUserContactId() {
        String userEmail = UserInfo.getUserEmail();
        Contact contact = [SELECT Id, Account.Niveau_de_support__c FROM Contact WHERE Email = :userEmail LIMIT 1];
        
        Map<String, String> contactInfo = new Map<String, String>();
        contactInfo.put('ContactId', contact.Id);
        contactInfo.put('NiveauDeSupport', contact.Account.Niveau_de_support__c);
        
        return contactInfo;
    }

    @AuraEnabled(cacheable=true)
    public static Id getLatestAttachmentId(String opportunityId) {
        List<Attachment> attachments = [SELECT Id FROM Attachment WHERE ParentId = :opportunityId ORDER BY CreatedDate DESC LIMIT 1];
        return attachments.isEmpty() ? null : attachments[0].Id;
    }


    
    @AuraEnabled(cacheable=true)
    public static String callCongaAPI() {
        /*
        String queryId = '[lineItems]0Q_014MAQ247304';
        String serverUrl = URL.getOrgDomainURL().toExternalForm();
        String recordId = '006Qy0000048q1HIAQ';
        String templateid = '0T_020MAQ054658';
        String filename = 'APICALL';
        String sessionId = UserInfo.getSessionId();
        //callout:ToolingRest/
        String congaUrl = 'https://composer.congamerge.com/composer8/index.html?' +
                            'sessionId=' + sessionId + '&serverUrl=' + serverUrl +
                            '&Id=006Qy0000048q1HIAQ'+
                            '&QueryId=[urlLogo]0Q_014MAQ247304'+
                            '&TemplateId=0T_020MAQ054658'+
                            '&OFN=' + filename +
                            '&APIMODE=1'+
                            '&DefaultPDF=1'+
                            '&SC0=1'+
                            '&SC1=Attachments'+
                            

        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(congaUrl);
        req.setMethod('GET');
        req.setTimeout(60000);
        //req.setHeader('Authorization', 'Bearer ' + sessionId);
    
        HttpResponse res = http.send(req);
        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            throw new AuraHandledException('Error calling conga api: ' + res.getStatusCode() + '--' + res.getStatus());
        }*/
        return 'conga' ;
    }

    /*
    String sessId = UserInfo.getSessionId();
    String servUrl = Url.getSalesforceBaseUrl().toExternalForm() + ‘/services/Soap/u/37.0/’ + UserInfo.getOrganizationId();

    String url2 = ‘https://composer.congamerge.com/composer8/index.html&#8217; +
    ‘?sessionId=’ + sessId +
    ‘&serverUrl=’ + EncodingUtil.urlEncode(servUrl, ‘UTF-8’);

if (String.isNotBlank(contactId)) {
url2 += ‘&id=’ + contactId;
}
if (String.isNotBlank(congaTemplateId1)) {
url2 += ‘&TemplateId=’ + congaTemplateId1;if (String.isNotBlank(congaEmailTemplateId1)) {
url2 += ‘&EmailTemplateId=’ + congaEmailTemplateId1;
}

if (String.isNotBlank(sQueryId) && String.isNotBlank(pvz)) {
url2 += ‘&QueryId=’ + sQueryId + ‘?pv0=’ + pvz;
}
if (String.isNotBlank(filename)) {
filename = EncodingUtil.urlEncode(filename, ‘UTF-8’);
}
url2 += filename;
}
url2 += ‘&SC0=1’+
url2 += ‘&SC1=Attachments’+
‘&defaultPDF=1’ +
‘&DS7=12’ +
‘&APIMODE=12’;
System.debug(‘***URL ‘ + url2);
Http http = new Http();
HttpRequest req = new HttpRequest();
req.setEndpoint(url2);
req.setMethod(‘GET’);
req.setTimeout(60000);
// Send the request, and return a response
HttpResponse res = http.send(req);
System.debug(‘*** $$$ ‘ + res);
System.debug(‘*** $$$ getStatus ‘ + res.getStatus());
System.debug(‘*** $$$ getBody ‘ + res.getBody());
return res.getStatus() + ‘ => ‘ + res.getBody();
}

calling class method
string rr= congaSendMailBackgroundMode (‘0032K00002F4Tg6′,’a1z2K0000011Rtw’,’a1q2K000000qa2m’,’Email test conga’,’deposion no attendi’,’0D22K000000fxU4′,’a1r2K000007ObAX’,’a072K00000hzw7I’);
system.debug(‘RR ‘+rr);
}
if (String.isNotBlank(subject)) {
subject = EncodingUtil.urlEncode(subject, ‘UTF-8’);
url2 += ‘&EmailSubject=’ + subject;
}
    */

}

    