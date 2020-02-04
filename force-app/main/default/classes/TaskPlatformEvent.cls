public with sharing class TaskPlatformEvent {
    public static final String CREATED_EVENT = 'created';
    public static final String DELETED_EVENT = 'deleted';    
    public static final String UPDATED_EVENT = 'updated';

    public static void publishDeletedEvent (String recordId, String parentId){
        TaskEvent__e event = newEvent(recordId,parentId,DELETED_EVENT);        
        publish(event);
    }

    public static void publishCreatedEvent (String recordId, String parentId){
        TaskEvent__e event = newEvent(recordId,parentId,CREATED_EVENT);            
        publish(event);        
    }

    public static void publishUpdatedEvent (String recordId, String parentId){
        TaskEvent__e event = newEvent(recordId,parentId,CREATED_EVENT);            
        publish(event);        
    }

    private static TaskEvent__e newEvent (String recordId, String parentId, String name){
        TaskEvent__e event = new TaskEvent__e();
        event.RecordId__c = recordId;
        event.EventType__c = name;
        event.UserId__c = UserInfo.getUserId();
        return event;
    }

    private static void publish (TaskEvent__e event){
        List<Database.SaveResult> results = EventBus.publish(new List<TaskEvent__e>{event});
    }
}
