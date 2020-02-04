public with sharing class RecordPlatformEvent {
    public static final String CREATED_EVENT = 'created';
    public static final String DELETED_EVENT = 'deleted';
    public static final String LOCKED_EVENT = 'locked';
    public static final String UNLOCKED_EVENT = 'unlocked';
    public static final String SHARED_EVENT = 'shared';

    public static void publishUnlockedEvent (String recordId){
        ContainerEvent__e event = newEvent(recordId,UNLOCKED_EVENT);        
        publish(event);
    }
    public static void publishLockedEvent (String recordId){
        ContainerEvent__e event = newEvent(recordId,LOCKED_EVENT);        
        publish(event);
    }
    public static void publishDeletedEvent (String recordId){
        ContainerEvent__e event = newEvent(recordId,DELETED_EVENT);        
        publish(event);
    }

    public static void publishCreatedEvent (String recordId){
        ContainerEvent__e event = newEvent(recordId,CREATED_EVENT);            
        publish(event);        
    }

    private static ContainerEvent__e newEvent (String recordId, String name){
        ContainerEvent__e event = new ContainerEvent__e();
        event.RecordId__c = recordId;
        event.Event__c = name;
        return event;
    }

    private static void publish (ContainerEvent__e event){
        List<Database.SaveResult> results = EventBus.publish(new List<ContainerEvent__e>{event});
    }
}
