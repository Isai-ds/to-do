public with sharing class TaskController {
    @AuraEnabled        
    public static List<Task> getTasks (String recordId){
        return [SELECT Id, Subject, ActivityDate, Status, OwnerId, Owner.Name FROM Task WHERE  WhatId =: recordId];
    }    
}
