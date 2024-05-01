global with sharing class EmailToCaseHandler implements Messaging.InboundEmailHandler {
    
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
        
        Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();
        
        try {
            // Extract information from the email
            String fromAddress = email.fromAddress;
            String subject = email.subject;
            String body = email.plainTextBody;
            
            // Find the ContactId and AccountId based on the fromAddress (email address)
            Contact[] contacts = [SELECT Id, AccountId FROM Contact WHERE Email = :fromAddress LIMIT 1];

            Case newCase = new Case();
            newCase.Origin = 'Email';
            newCase.Subject = subject;
            newCase.Description = body;
            newCase.Status = 'New';
            
            if (contacts.size() > 0) {                
                newCase.ContactId = contacts[0].Id;
                newCase.AccountId = contacts[0].AccountId; 
            } 

            insert newCase;

            result.success = true;
            result.message = 'Case created successfully.';
            
        } catch (Exception e) {
            // Set the result to indicate failure
            result.success = false;
            result.message = 'Failed to create Case: ' + e.getMessage();
            System.debug('Error creating Case: ' + e.getMessage());
        }
        
        return result;
    }
}
