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
                helper.publishEventNotification(component);      
            });                    
        }else{                        
            if (!component.get('v.recordId')){                                
                helper.handleSave(component,event,helper,function(saveResult){                                    
                    component.find('tasks').set('v.parentId',saveResult.recordId);                              
                    
                    helper.setRecordToEdit(component,saveResult.recordId);   
                    component.set('v.actionType','edit');
                    helper.lockingContainer(component,helper,function(response){                         
                        helper.publishEventNotification(component);                                                      
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
        component.set('v.recordId','')
        component.set('v.actionType','new');
        component.find('recordCard').set('v.title','Crear nueva '+component.get('v.type').toLowerCase());
        helper.newRecord(component,helper);
        if (component.get('v.type')== helper.LIST_OPTION){
            helper.fireNewTasksEvent();
        }
    },
    loadRecord : function(component,event,helper) {
        var recordId = event.getParam('arguments').recordId; 
        component.set('v.actionType','read');    
        helper.setRecordToEdit(component,recordId);        
        helper.reloadRecord(component,helper);
        
    },
    handleRecordUpdated: function(component, event, helper) {
        var eventParams = event.getParams();
        if(eventParams.changeType === "CHANGED") {
            var changedFields = eventParams.changedFields;
            console.log('Fields that are changed: ' + JSON.stringify(changedFields));            
        }
    },
    handlerOnSaveTask : function (component,event,helper){
        if (!event.getParam('parentId')){
            helper.handleSave(component,event,helper,function(saveResult){                
                helper.fireOnlyTaskEvent(saveResult.recordId);    

                helper.setRecordToEdit(component,saveResult.recordId);  
                component.set('v.actionType','edit');                
                helper.lockingContainer(component,helper,function(response){                         
                    helper.publishEventNotification(component);                                                      
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
})
