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
    


}