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
    getTask : function(component,helper,callback) {
        var action = component.get('c.lockingTask');
        action.setParams({
            'recordId' : component.get('v.recordId')
        });
        action.setCallback(this, $A.getCallback(function(response){
            if (response.getState() == 'SUCCESS'){                
                callback(response);               
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
    saveSubject : function(component,helper) {
        var action = component.get('c.setSubject');        
        var subject = component.find('subject').getElement().value;        
        
        action.setParams({
            'recordId' : component.get('v.recordId'),
            'subject' : subject
        });
        action.setCallback(this, $A.getCallback(function(response){
            if (response.getState() == 'SUCCESS'){
                component.get('v.data').Name = subject;
                helper.saveMessage();
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
    saveMessage : function (){        
        var resultsToast = $A.get('e.force:showToast');
        resultsToast.setParams({
            'title': 'Guardado',
            'message': 'La tarea se guardo correctamente',
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
    },
    unlockTask : function(component,helper,callback) {
        var action = component.get('c.unlockTask');
        action.setParams({
            'recordId' : component.get('v.recordId')
        });
        action.setCallback(this, $A.getCallback(function(response){
            if (response.getState() == 'SUCCESS'){                
                component.set('v.data',response.getReturnValue());
                callback();
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
    
})
