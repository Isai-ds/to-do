({
    LIST_OPTION : 'list',
    STATUS_DONE : 'Terminado',
    STATUS_IN_PROGRESS : 'En progreso',
    ACTION_EDIT : 'edit',
    ACTION_READ_ONLY : 'read',
    checkStatus : function(component,helper,type){
        var task = component.get('v.data');        
        if (type == helper.ACTION_EDIT){            
            component.find('status').set('v.checked',task.Status__c == helper.STATUS_IN_PROGRESS ? false : true);            
            $A.util.removeClass(component.find('subject'), 'done');
        }else if (type == helper.ACTION_READ_ONLY){
            if (task.Status__c == helper.STATUS_DONE)
                $A.util.addClass(component.find('subject'), 'done');
        }
    },
    lockingTask : function(component,helper,callback) {
        var action = component.get('c.lockingTask');
        action.setParams({
            'recordId' : component.get('v.recordId')
        });
        action.setCallback(this, $A.getCallback(function(response){
            if (response.getState() == 'SUCCESS'){       
                console.log('locking...',response.getReturnValue());                
                var result = response.getReturnValue();
                component.set('v.data',result.task);                 
                if (result.isBlocked){
                    helper.lockMessage(result.LastBlockedBy.Name);
                }else{
                    if (callback){
                        callback(response);               
                    }                    
                }                         
            }else if (response.getState() == 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        }));
        $A.enqueueAction(action);
    },
    saveTask : function(component,helper) {
        var action = component.get('c.saveTask');        
        var subject = component.find('subject').getElement().value;        
        var status = component.find('status').get('v.checked') ? helper.STATUS_DONE : helper.STATUS_IN_PROGRESS;
        action.setParams({
            'recordId' : component.get('v.recordId'),
            'subject' : subject,
            'status' : status
        });
        action.setCallback(this, $A.getCallback(function(response){
            if (response.getState() == 'SUCCESS'){
                component.set('v.data',response.getReturnValue());
                helper.saveMessage('Actualización', 'La tarea se actualizó correctamente');
            }else if (response.getState() == 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message saving task: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        }));
        $A.enqueueAction(action);
    },
    deleteTask : function(component,helper) {
        var action = component.get('c.deleteTask');                
        action.setParams({
            'recordId' : component.get('v.recordId')
        });
        action.setCallback(this, $A.getCallback(function(response){
            if (response.getState() == 'SUCCESS'){                
                helper.saveMessage('Eliminación','La tarea se eliminó correctamente');
            }else if (response.getState() == 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message delete task: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        }));
        $A.enqueueAction(action);
    },
    saveMessage : function (title,message){        
        var resultsToast = $A.get('e.force:showToast');
        resultsToast.setParams({
            'title': title,
            'message': message,
            'type' : 'success'
        });
        resultsToast.fire();
    },
    lockMessage : function (userName){        
        var resultsToast = $A.get('e.force:showToast');
        resultsToast.setParams({
            'title': 'Tarea bloqueada',
            'message': 'La tarea se esta modificando por '+userName+'. Espere a que el usuario termine',
            'type' : 'warning'

        });
        resultsToast.fire();
    },
    editTask :  function(component,helper){
        component.set('v.edit',true);
        helper.checkStatus(component,helper,helper.ACTION_EDIT);
    }
    
})
