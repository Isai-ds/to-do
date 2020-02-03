({    
    onInit : function(component, event, helper) {
        helper.newRecord(component,event);
        helper.getUserInfo(component);
    },
    handleSave : function(component, event, helper) {
        helper.handleSave(component,event,helper,function(saveResult){
            helper.isNewRecord(component,helper);                
        });
    },
    newRecord : function(component, event, helper) {
        component.set('v.recordId','')
        component.find('recordCard').set('v.title','Crear nueva '+component.get('v.type').toLowerCase());
        helper.newRecord(component,helper);
    },
    loadRecord : function(component,event,helper) {
        var recordId = event.getParam('arguments').recordId;     
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
                component.set('v.recordId',saveResult.recordId);      
                helper.setRecordToEdit(component,saveResult.recordId);  
                helper.fireOnlyTaskEvent(saveResult.recordId);    
            });
        }
        
    },
})
