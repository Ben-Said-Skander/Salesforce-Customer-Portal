public with sharing class OpportunityController {
   

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        String userEmail = UserInfo.getUserEmail();
        Contact contact = [SELECT AccountId FROM Contact WHERE Email = :userEmail LIMIT 1];
        return [SELECT Id, Name, StageName, CloseDate FROM Opportunity WHERE AccountId = :contact.AccountId ORDER BY CloseDate DESC LIMIT 3];

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

}

    