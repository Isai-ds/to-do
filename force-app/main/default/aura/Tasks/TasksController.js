({
    handleRetrieveTasksEvent : function(component, event, helper) {
        var parentId = event.getParam('parentId');
        component.set('v.parentId',parentId);
        helper.newRecord(component);
        helper.getTasks(component,event);
    },
    handleNewTasksEvent : function(component, event, helper) {
        component.set('v.parentId','');
        component.set('v.data',[]);
        helper.newRecord(component);
    },
    handleSaveTask: function(component, event, helper) {       
        console.log('adding...',component.get('v.parentId'));     
        if (component.get('v.parentId') != ''){
            helper.handleSave(component,event,helper, function(){                
                helper.saveMessage();                
            });
        }else{
            
            helper.fireOnlyTaskEvent(component);
        }        
    },
    handlerOnSaveTask : function(component, event, helper) {            
        console.log('Creating from task -> parent', event.getParam('parentId'));
        if (event.getParam('parentId')){
            component.set('v.parentId',event.getParam('parentId'));
            helper.handleSave(component,event,helper);
        }
    }

})
