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
                var data = component.get('v.data');
                var task = component.get('v.simpleTask');
                task = JSON.parse(JSON.stringify(task));
                data.push(task);                            
                component.set('v.data',data);
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
    },
    handlerDelete : function(component, event, helper) {            
        var task = event.getParam('task');
        console.log('task to delete',JSON.stringify(task));
        var tasks = component.get('v.data');      
            
        for (var i =0; i< tasks.length; i++){
            if ( tasks[i].Id === task.Id) {
                tasks.splice(i, 1); 
                break;
            }
        }

        component.set('v.data',tasks);
    }   

})
