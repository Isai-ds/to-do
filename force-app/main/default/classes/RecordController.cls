public with sharing class RecordController {
    
    @AuraEnabled
    public static void publishRecordCreation (){
        ContainerEvent__e event = new ContainerEvent__e();
        List<Database.SaveResult> results = EventBus.publish(new List<ContainerEvent__e>{event});
    }
    @AuraEnabled
    public static User getCurrentUser(){
        return ListController.getCurrentUser();
    }

    @AuraEnabled        
    public static Map<String,Object> lockingContainer (String recordId){
        Map<String,Object> result = new Map<String,Object>();        
        Container__c record = getRecord(recordId);
        result.put('isBlocked',true);         

        if (timeUnlockRecord(record)){
            unlockRecord(record);            
        }
        if (String.isBlank(record.LastBlockedBy__c)){
            lockContainer(record);
            result.put('isBlocked',false);
        }else if (record.LastBlockedBy__c == UserInfo.getUserId()){
            result.put('isBlocked',false);
        }
        result.put('LastBlockedBy',record.LastBlockedBy__r);
        
        return result;
    }
    private static Boolean timeUnlockRecord (Container__c record){ 
        System.debug('t.LastBlockedDate__c->'+record.LastBlockedDate__c);
        Boolean unlock = false;
        if (record.LastBlockedDate__c != null){
            Long timeLastBlockedDate = record.LastBlockedDate__c.getTime(); 
            Long timeNow = DateTime.now().getTime();
            Long result = (timeNow - timeLastBlockedDate) / 1000L;    
            unlock =  result > 300;
        }        
        return unlock;
    }

    private static void lockContainer (Container__c record){ 
        record.LastBlockedBy__c = UserInfo.getUserId();
        record.LastBlockedDate__c = System.DateTime.now();
        update record;
    }
    private static void unlockRecord (Container__c record){
        System.debug('unlocking...'+record.Id);        
        record.LastBlockedBy__c = null;
        record.LastBlockedDate__c = null;
        update record; 
    }

    @AuraEnabled        
    public static void unlockContainer (String recordId){
        Container__c record = getRecord(recordId);
        if (record.LastBlockedBy__c == UserInfo.getUserId() && !timeUnlockRecord(record)){
            unlockRecord (record);
        }                     
    }

    private static Container__c getRecord (String recordId){
        return [SELECT Id, Name, Comments__c, isBlocked__c, LastBlockedBy__c,LastBlockedBy__r.Name, LastBlockedDate__c, OwnerId, Owner.Name FROM Container__c WHERE  Id =: recordId];
    }


}
