public with sharing class QuoteController {
   
    @AuraEnabled
    public static void submitForApproval(String quoteId) {
        
        Id userId = UserInfo.getUserId();
        Approval.ProcessSubmitRequest req1 = new Approval.ProcessSubmitRequest();
        req1.setComments('Submitting quote for approval.');
        req1.setObjectId(quoteId);
        req1.setSubmitterId(userId); 
        req1.setSkipEntryCriteria(true);
        req1.setProcessDefinitionNameOrId('Quote_Approval_level_1');

        Approval.ProcessResult result = Approval.process(req1);
        
    }

    @AuraEnabled
    public static void deleteLatestAttachment(Id opportunityId) {
        Attachment attachment = [SELECT Id, Body FROM Attachment WHERE ParentId = :opportunityId ORDER BY CreatedDate DESC LIMIT 1];
        delete attachment ;
    }

    //SELECT Id FROM Quote WHERE OpportunityId= '006Qy0000048q1HIAQ' AND IsSyncing=true 
    @AuraEnabled(cacheable=true)
    public static Id getSyncQuoteId(String opportunityId) {
        Quote quote = [SELECT Id FROM Quote WHERE OpportunityId = :opportunityId AND IsSyncing = true LIMIT 1];
        return quote.Id;
    }

    @AuraEnabled(cacheable=true)
    public static Id getLatestQuoteContentDocumentId(String opportunityId) {
        
        Id contentDocumentId = null;
        List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :opportunityId LIMIT 1];
        if (!contentDocumentLinks.isEmpty()) {
            contentDocumentId = contentDocumentLinks[0].ContentDocumentId;
        }
        return contentDocumentId;
    }

    
    @AuraEnabled
    public static void generateQuote(String opportunityId) {
        SDOC__SDJob__c job = new SDOC__SDJob__c(SDOC__Start__c=true,SDOC__Oid__c=opportunityId,SDOC__ObjApiName__c='Opportunity',SDOC__SendEmail__c='0',SDOC__Doclist__c='Quote Template');
        insert job ;
        
    }
}