public with sharing class TaskController {
    @AuraEnabled        
    public static List<Task__c> getTasks (String recordId){
        return [SELECT Id, Name, ActivityDate__c, Status__c, isBlocked__c, OwnerId, Owner.Name FROM Task__c WHERE  List__c =: recordId];
    }  

    
    @AuraEnabled        
    public static Map<String,Object> lockingTask (String recordId){
        Map<String,Object> result = new Map<String,Object>();        
        Task__c t = getTask(recordId);
        result.put('isBlocked',true);         

        if (checkUnlockTask(t)){
            t = unlockTask(t.Id);            
        }
        if (String.isBlank(t.LastBlockedBy__c)){
            lockTask(t);
            result.put('isBlocked',false);
        }else if (t.LastBlockedBy__c == UserInfo.getUserId()){
            result.put('isBlocked',false);
        }
        result.put('task',t);
        
        return result;
    }
    private static Boolean checkUnlockTask (Task__c t){ 
        System.debug('t.LastBlockedDate__c->'+t.LastBlockedDate__c);
        Boolean unlock = false;
        if (t.LastBlockedDate__c != null){
            Long timeLastBlockedDate = t.LastBlockedDate__c.getTime(); 
            Long timeNow = DateTime.now().getTime();
            Long result = (timeNow - timeLastBlockedDate) / 1000L;    
            unlock =  result > 300;
        }        
        return unlock;
    }

    private static void lockTask (Task__c t){ 
        t.LastBlockedBy__c = UserInfo.getUserId();
        t.LastBlockedDate__c = System.DateTime.now();
        update t;
    }

    @AuraEnabled        
    public static Task__c unlockTask (String recordId){
        System.debug('unlocking...'+recordId);
        Task__c t = new Task__c(Id=recordId);     
        t.LastBlockedBy__c = null;
        t.LastBlockedDate__c = null;
        update t;
        t = getTask(recordId);
        return t;
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
        Task__c t = getTask(recordId);
        if (t.Status__c == 'En progreso'){
            t.Status__c = 'Terminado';
        }else{
            t.Status__c = 'En progreso';
        }
        update t;
    } 

    private static Task__c getTask (String recordId){
        return [SELECT Id, Name, ActivityDate__c, Status__c, isBlocked__c, LastBlockedBy__c,LastBlockedBy__r.Name, LastBlockedDate__c, OwnerId, Owner.Name FROM Task__c WHERE  Id =: recordId];
    }
}
