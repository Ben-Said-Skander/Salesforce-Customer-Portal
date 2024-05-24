public with sharing class CaseController {
  
    @AuraEnabled(cacheable=true)
    public static List<Case> getAllCases() {
        String userEmail = UserInfo.getUserEmail();
        return [SELECT Id, CreatedDate, Subject, Priority, Opportunity_Product__c, Opportunity_Product__r.Name, Status FROM Case WHERE ContactEmail = :userEmail ORDER BY CreatedDate DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getAllClosedCases() {
        String userEmail = UserInfo.getUserEmail();
       
        return [SELECT Id, CreatedDate, Subject, ClosedDate, Priority, Enquete_de_satisfaction__c, 
                       (SELECT Id, Rating__c FROM Enquete_de_satisfaction__r LIMIT 1),
                       Opportunity_Product__c, Opportunity_Product__r.Name, Status 
                FROM Case 
                WHERE ContactEmail = :userEmail AND Status='Fermé' 
                ORDER BY CreatedDate DESC];
    }

    @AuraEnabled(cacheable=true)
    public static Case getLatestCase() {
        String userEmail = UserInfo.getUserEmail();
        List<Case> cases = [SELECT Id, CreatedDate, Subject, Description, Priority, Opportunity_Product__r.Name, Status 
                            FROM Case 
                            WHERE ContactEmail = :userEmail AND IsClosed = false
                            ORDER BY CreatedDate DESC 
                            LIMIT 1];
        return cases[0];
    }
    
  
    //To set cacheable=true, a method must only get data, it can’t mutate (change) data.
    @AuraEnabled
    public static void closeLatestCase() {
            
        String userEmail = UserInfo.getUserEmail();
       
            List<Case> casesToClose = [SELECT Id, CreatedDate, Status 
                                        FROM Case 
                                        WHERE ContactEmail = :userEmail AND IsClosed = false
                                        ORDER BY CreatedDate DESC 
                                        LIMIT 1];

            if (!casesToClose.isEmpty()) {
                Case updateCaseToClose = casesToClose[0];
                updateCaseToClose.Status = 'Fermé';
       
    
                update updateCaseToClose;
            } else {
                throw new AuraHandledException('No open cases found for the current user.');
            }
        
    }

    @AuraEnabled
    public static void updateSLARemainingTime(String caseId,Integer timeLeft) {
                 
            Case caseToUpdate = [SELECT Id, CreatedDate, Status 
                                        FROM Case 
                                        WHERE Id = :caseId ];


            caseToUpdate.SLA_Time_Left__c = timeLeft;
       
            update caseToUpdate;
            
        
    }
    
    
    @AuraEnabled(cacheable=true)
    public static List<Enqu_te_de_satisfaction__c> getSurveyRating() {
        String userEmail = UserInfo.getUserEmail();
        List<Case> closedCases = [SELECT Id, Enquete_de_satisfaction__c, Status FROM Case WHERE ContactEmail = :userEmail AND Status='Fermé'];
        
        Set<Id> satisfactionIds = new Set<Id>();
        for (Case c : closedCases) {
            satisfactionIds.add(c.Enquete_de_satisfaction__c);
        }
    
        return [SELECT Id, Rating__c FROM Enqu_te_de_satisfaction__c WHERE Id IN :satisfactionIds];
    }
    

    @AuraEnabled
    public static void createCaseWithAttachment(String subject,String type ,String entitlementId, String priority, String description, Id contactId, Id opportunityProductId, String imageData, String problemTypes) {
            
        Contact contact = [SELECT AccountId FROM Contact WHERE Id = :contactId LIMIT 1];
        Id accountId = contact.AccountId;

        Case newCase = new Case(
            Subject = subject,
            Priority = priority,
            Description = description,
            Type = type,
            Origin = 'Web',
            Status = 'Nouvelle',
            ContactId = contactId,
            AccountId = accountId,
            Opportunity_Product__c = opportunityProductId,
            Problem_Tag__c = problemTypes ,
            EntitlementId = entitlementId
        );
        insert newCase;
    
        // Attach the image as an Attachment to the Case
        Attachment attachment = new Attachment();
        attachment.Body = EncodingUtil.base64Decode(imageData);
        attachment.Name = 'CaseImage.png';
        attachment.ParentId = newCase.Id;
        insert attachment;
    }

    @AuraEnabled
    public static void createCaseWithoutAttachment(String subject,String type , String entitlementId, String priority, String description, Id contactId, Id opportunityProductId, String problemTypes) {
            
        Contact contact = [SELECT AccountId FROM Contact WHERE Id = :contactId LIMIT 1];
        Id accountId = contact.AccountId;
       
        Case newCase = new Case(
            Subject = subject,
            Priority = priority,
            Description = description,
            Type = type,
            Origin = 'Web',
            Status = 'Nouvelle',
            ContactId = contactId,
            AccountId = accountId,
            Opportunity_Product__c = opportunityProductId,
            Problem_Tag__c = problemTypes ,
            EntitlementId = entitlementId
        );
        insert newCase;

    }

    @AuraEnabled(cacheable=true)
    public static Boolean hasOpenCase() {

        Boolean isOpenCase =false ;
        try {
            String userEmail = UserInfo.getUserEmail();
            Contact contact = [SELECT AccountId FROM Contact WHERE Email = :userEmail LIMIT 1];
            Integer caseCount = [SELECT COUNT() FROM Case WHERE ContactEmail = :userEmail AND IsClosed = false];
            if(caseCount>0){
                return isOpenCase=true ;
            }else{
                return isOpenCase=false ;
            }
        } catch (QueryException e) {
          // console.log(e) ; 
        }
        return isOpenCase ;
    }
    
    
    
    

}