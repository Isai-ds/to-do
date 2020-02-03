public with sharing class ListController {
    //Obtiene las notas y listas de la base de datos
    @AuraEnabled    
    public static List<Container__c> getNotesLists (){
        return [SELECT Id, Name, Type__c, Owner.Name, CreatedDate FROM Container__c ORDER BY OwnerId, CreatedDate DESC];
    }

    @AuraEnabled
    public User getUser(){
        return [SELECT Id, Name FROM User WHERE Id =: UserInfo.getUserId()];
    }
}