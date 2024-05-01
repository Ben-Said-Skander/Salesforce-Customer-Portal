public with sharing class KnowledgeController {
   
    @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> getArticlesByCaseType() {
        String userEmail = UserInfo.getUserEmail();
        Case relatedCaseType = [SELECT Id, Type FROM Case WHERE ContactEmail = :userEmail AND IsClosed = false ORDER BY CreatedDate DESC LIMIT 1];
    
        List<Knowledge__kav> articles = new List<Knowledge__kav>();
        if (relatedCaseType != null && relatedCaseType.Type != null) {
            articles = [SELECT Id, Title, UrlName
                        FROM Knowledge__kav
                        WHERE Problem_Type__c = :relatedCaseType.Type AND RecordTypeId = '012Qy000001ZswFIAS'
                        LIMIT 5];
        }
        return articles;
    }

    }

