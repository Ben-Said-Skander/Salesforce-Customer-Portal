public with sharing class TimeCalculator {
  /*
    @AuraEnabled
    public static void calculerDelaiPriseEnCharge(String caseId) {

        DateTime startDateTime = null;
        DateTime endDateTime = null;
        Decimal processingTimeHours = 0;

        Case updatedCase = [SELECT Id, CreatedDate, Status FROM Case WHERE Id = :caseId];


        if (updatedCase.Status == 'En Cours') {

           startDateTime = updatedCase.CreatedDate;
           DateTime currentDate = System.now();
           endDateTime = currentDate;
           Integer totalHours = 0;
    
    
        while (startDateTime < endDateTime) {
           if (startDateTime.hour() >= 8 && startDateTime.hour() < 17 && startDateTime.weekday() != 1 && startDateTime.weekday() != 7) {
            totalHours++;
            }
            startDateTime = startDateTime.addHours(1);
    }
            processingTimeHours = totalHours;
}

        updatedCase.Delai_de_prise_en_charge__c = processingTimeHours;
        update updatedCase ;

    }

*/

}