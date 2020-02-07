({    
    onInit : function(component, event, helper) {
        helper.newRecord(component,event);
        helper.getUserInfo(component);
    },
    handleSave : function(component, event, helper) {
        if (component.get('v.type')== helper.NOTE_OPTION){            
            helper.handleSave(component,event,helper,function(saveResult){
                if (!component.get('v.recordId')){
                    helper.newRecord(component,helper);          
                }                
                helper.publishEventNotification(component,helper.CREATED_EVENT);      
            });                    
        }else{                        
            if (!component.get('v.recordId')){                                
                helper.handleSave(component,event,helper,function(saveResult){                                    
                    component.find('tasks').set('v.parentId',saveResult.recordId);                              
                    
                    helper.setRecordToEdit(component,saveResult.recordId);   
                    component.set('v.actionType','edit');
                    helper.lockingContainer(component,helper,function(response){                         
                        helper.publishEventNotification(component,helper.CREATED_EVENT);                                                      
                    });
                });    
            }else{                                
                helper.checkingContainer(component,helper,function(result){                
                    helper.handleSave(component,event,helper);
                });                                        
            }                             
        }                                
    },
    newRecord : function(component, event, helper) {
        helper.newRecordActions(component,helper);
    },
    loadRecord : function(component,event,helper) {
        var recordId = event.getParam('arguments').recordId; 
        component.set('v.actionType','read');    
        helper.setRecordToEdit(component,recordId);        
        helper.reloadRecord(component,helper);
        
    },
    handleRecordUpdated: function(component, event, helper) {
        var eventParams = event.getParams();
        if(eventParams.changeType === 'REMOVED') {
            helper.publishEventNotification(component,helper.DELETED_EVENT);
            helper.deleteRecordPostAction(component,helper,eventParams);
        }
    },
    handlerOnSaveTask : function (component,event,helper){
        if (!event.getParam('parentId')){
            helper.handleSave(component,event,helper,function(saveResult){                
                helper.fireOnlyTaskEvent(saveResult.recordId);    
                helper.setRecordToEdit(component,saveResult.recordId);  
                component.set('v.actionType','edit');                
                helper.lockingContainer(component,helper,function(response){                         
                    helper.publishEventNotification(component,helper.CREATED_EVENT);                                                      
                });
            });
        }
        
    },    
    handleEdit : function (component,event,helper){                
        helper.reloadRecord(component,helper,function(){
            helper.checkingContainer(component,helper,function(result){                
                helper.editContainer(component,helper);                
            });            
        });                
    },
    handleFinish : function (component,event,helper){        
        helper.unlockContainer(component,helper,function(){
            component.set('v.actionType','read');        
        });
        
    },    
    handleDelete : function (component,event,helper){                        
        helper.checkingContainer(component,helper,function(result){                
            helper.handleDelete(component,helper);
        });                    
    },
    handlerShare : function (component,event,helper){                        
        component.set('v.toShare',true);
    },
    hanlerCloseSharing : function (component,event,helper){                        
        component.set('v.toShare',false);
    },
})
