public with sharing class TaskController {
    @AuraEnabled        
    public static List<Task__c> getTasks (String recordId){
        return [SELECT Id, Name, ActivityDate__c, Status__c, OwnerId, Owner.Name FROM Task__c WHERE  List__c =: recordId];
    }  
    
    @AuraEnabled        
    public static Task__c getTask (String recordId){
        return [SELECT Id, Name, ActivityDate__c, Status__c, LastBlockedBy__c, LastBlockedDate__c, OwnerId, Owner.Name FROM Task__c WHERE  Id =: recordId];
    }  

    @AuraEnabled        
    public static void setSubject (String recordId, String subject){
        Task__c t = new Task__c();
        t.Id = recordId;
        t.Name = subject;
        update t;        
    } 
    
    @AuraEnabled        
    public static void toogleStatusTask (String recordId){
        Task__c t = [SELECT Id, Name, ActivityDate__c, Status__c, OwnerId, Owner.Name FROM Task__c WHERE  Id =: recordId];
        if (t.Status__c == 'En progreso'){
            t.Status__c = 'Terminado';
        }else{
            t.Status__c = 'En progreso';
        }
        update t;
    } 
}
