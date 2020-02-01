public with sharing class RecordController {
    
    @AuraEnabled
    public static void publishRecordCreation (){
        ContainerEvent__e event = new ContainerEvent__e();
        List<Database.SaveResult> results = EventBus.publish(new List<ContainerEvent__e>{event});
    }
}
