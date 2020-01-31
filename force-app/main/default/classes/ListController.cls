public with sharing class ListController {
    //Obtiene las notas y listas de la base de datos
    @AuraEnabled    
    public static List<Container__c> getNotesLists (){
        return [SELECT Id, Name, Type__c, Comments__c, Owner.Name, CreatedDate FROM Container__c];
    }
}
