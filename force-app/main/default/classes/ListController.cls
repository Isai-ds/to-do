public with sharing class ListController {
    //Obtiene las notas y listas de la base de datos
    
    @AuraEnabled    
    public static List<Container__c> getNotesLists (){
        return [SELECT Id, Name, Type__c, Owner.Name, CreatedDate, isBlocked__c, LastBlockedBy__c,LastBlockedBy__r.Name,LastBlockedDate__c FROM Container__c ORDER BY OwnerId, CreatedDate DESC];
    }

    @AuraEnabled
    public static User getCurrentUser(){
        return [SELECT Id, Name FROM User WHERE Id =: UserInfo.getUserId()];
    }
}