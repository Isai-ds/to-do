public with sharing class TaskController {
    @AuraEnabled        
    public static List<Task__c> getTasks (String recordId){
        return [SELECT Id, Name, ActivityDate__c, Status__c, isBlocked__c, OwnerId, Owner.Name FROM Task__c WHERE  List__c =: recordId];
    }  

    @AuraEnabled        
    public static Map<String,Object> lockingTask (String recordId){        
        Task__c t = getTask(recordId);
        Map<String,Object> result = RecordController.lockingContainer(t.List__c);        
        result.put('task',t);        
        return result;
    }
    
    @AuraEnabled        
    public static Task__c saveTask (String recordId, String subject, String status){
        Task__c t = getTask (recordId);        
        t.Id = recordId;
        t.Name = subject;
        t.Status__c = status;
        update t;    
        TaskPlatformEvent.publishUpdatedEvent(recordId, t.List__c);        
        return t;    
    } 

    @AuraEnabled        
    public static void deleteTask (String recordId){
        Task__c t = getTask (recordId);        
        delete t;
        TaskPlatformEvent.publishDeletedEvent(recordId, t.List__c);        
    }

    private static Task__c getTask (String recordId){
        System.debug('recordId->'+recordId);
        return [SELECT Id, Name, List__c,ActivityDate__c, Status__c, OwnerId, Owner.Name FROM Task__c WHERE  Id =: recordId];

    }

}
