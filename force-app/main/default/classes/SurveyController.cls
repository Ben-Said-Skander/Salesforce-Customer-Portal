public with sharing class SurveyController {
 
    @AuraEnabled
    public static void createNewSurvey(Integer rating , String question1, String question2, String question3, String question4, String question5,Id caseId) {
        try {
            String userEmail = UserInfo.getUserEmail();
            
            Enqu_te_de_satisfaction__c newSurvey = new Enqu_te_de_satisfaction__c (
                contactEmail__c = userEmail,
                Case__c = caseId ,
                Question1__c = question1,
                Question2__c = question2,
                Question3__c = question3,
                Question4__c = question4,
                Question5__c = question5 ,
                Rating__c = rating                
            );
            
            insert newSurvey;

            // Update the Case record with the Id of the newly created survey
            Case updatedCase = [SELECT Id, Enquete_de_satisfaction__c FROM Case WHERE Id = :caseId];
            updatedCase.Enquete_de_satisfaction__c = newSurvey.Id;
            updatedCase.Is_Survey_Filled__c = true;
            update updatedCase;


        } catch(Exception e) {
            throw new AuraHandledException('Error creating survey: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Enqu_te_de_satisfaction__c> getAllSurveys() {
        String userEmail = UserInfo.getUserEmail();
        return [SELECT Question1__c, Question2__c, Question3__c, Question4__c, Question5__c FROM Enqu_te_de_satisfaction__c WHERE contactEmail__c = :userEmail ORDER BY CreatedDate DESC];
    }


    @AuraEnabled(cacheable=true)
    public static Case getSurveyResults(String caseId) {
        try {
                      
            return [SELECT Id, 
             Enquete_de_satisfaction__r.Rating__c ,
             Enquete_de_satisfaction__r.Question1__c,
             Enquete_de_satisfaction__r.Question2__c,
             Enquete_de_satisfaction__r.Question3__c,
             
             Enquete_de_satisfaction__r.Question4__c ,
             Enquete_de_satisfaction__r.Question5__c  
             
             FROM Case WHERE Id = :caseId];

        } catch (Exception e) {
            throw new AuraHandledException('Error loading rating: ' + e.getMessage());
        }
    }

}