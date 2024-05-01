public with sharing class CommentController {
    
   
    @AuraEnabled
    public static void createNewCommentAgent(String comment,Boolean isPublic) {
        try {
            String userEmail = UserInfo.getUserEmail();
    
            Case relatedCase = [SELECT Id
                                FROM Case 
                                WHERE Contact.Email = :userEmail AND IsClosed = false
                                ORDER BY CreatedDate DESC 
                                LIMIT 1];
    
            CaseComment newComment = new CaseComment(
                ParentId = relatedCase.Id,
                CommentBody = comment,
                IsPublished = isPublic
            );
            
            insert newComment;
        } catch(Exception e) {
            throw new AuraHandledException('Error creating a note: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void createNewCommentClient(String comment) {
        try {
            String userEmail = UserInfo.getUserEmail();
            Datetime currentDate = Datetime.now();
    
            Case relatedCase = [SELECT Id
                                FROM Case 
                                WHERE Contact.Email = :userEmail AND IsClosed = false
                                ORDER BY CreatedDate DESC 
                                LIMIT 1];
    
            CaseComment newComment = new CaseComment(
                ParentId = relatedCase.Id,
                CommentBody = comment,
                IsPublished = false
            );

            Comment__c clientComment = new Comment__c (
                Case__c = relatedCase.Id ,
                Comment_Body__c = comment,
                Created_Date_Time__c = currentDate
            );
            
            insert newComment;
            insert clientComment;

        } catch(Exception e) {
            throw new AuraHandledException('Error creating a note: ' + e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<CaseComment> getAgentComment() {
     
        String userEmail = UserInfo.getUserEmail();
        Case relatedCase = [SELECT Id 
                            FROM Case 
                            WHERE Contact.Email = :userEmail AND IsClosed = false 
                            ORDER BY CreatedDate DESC 
                            LIMIT 1];
    
        return [SELECT Id, CommentBody,CreatedDate ,IsPublished FROM CaseComment WHERE ParentId = :relatedCase.Id AND IsPublished = true ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Comment__c> getClientComment() {
     
        String userEmail = UserInfo.getUserEmail();
        Case relatedCase = [SELECT Id 
                            FROM Case 
                            WHERE Contact.Email = :userEmail AND IsClosed = false 
                            ORDER BY CreatedDate DESC 
                            LIMIT 1];
    
        return [SELECT Id, Comment_Body__c ,Created_Date_Time__c  FROM Comment__c WHERE Case__c = :relatedCase.Id ];
    }
    
}