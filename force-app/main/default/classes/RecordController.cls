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

        if (timeUnlockConatiner(record)){
            unlockContainer(record.Id);            
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
    private static Boolean timeUnlockConatiner (Container__c record){ 
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

    @AuraEnabled        
    public static void unlockContainer (String recordId){
        System.debug('unlocking...'+recordId);
        Container__c record = new Container__c(Id=recordId);     
        record.LastBlockedBy__c = null;
        record.LastBlockedDate__c = null;
        update record;                
    }

    private static Container__c getRecord (String recordId){
        return [SELECT Id, Name, Comments__c, isBlocked__c, LastBlockedBy__c,LastBlockedBy__r.Name, LastBlockedDate__c, OwnerId, Owner.Name FROM Container__c WHERE  Id =: recordId];
    }


}
