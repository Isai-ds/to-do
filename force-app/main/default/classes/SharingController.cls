public with sharing class SharingController {
    
    public class Option{
        @AuraEnabled 
        public String label {get;set;}
        
        @AuraEnabled
        public String value {get;set;}
        
    }
    @AuraEnabled    
    public static List<SharingController.Option> getUsers() {
        List<SharingController.Option> users = new List<SharingController.Option>();
        for (Schema.User u : [SELECT Id, Name FROM User WHERE Id !=:UserInfo.getUserId() AND Profile.Name IN ('ToDoUser')]){
            SharingController.Option user = new SharingController.Option();
            user.label = u.Name;
            user.value = u.Id;
            users.add(user);
        }
        return users;
    }

    @AuraEnabled    
    public static void sharing(String recordId, String userId) {
        Container__share record = new Container__share();
        record.ParentId = recordId;
        record.UserOrGroupId = userId;
        record.AccessLevel = 'Edit';
        insert record;

        RecordPlatformEvent.publishSharedEvent(recordId);
    }
}
