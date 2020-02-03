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
            
            $A.util.addClass(component.find('subject'), 'done');
        }
    },
    getTask : function(component,event,helper,callback) {
        var action = component.get('c.getTask');
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
    saveSubject : function(component,helper) {
        var action = component.get('c.setSubject');        
        var subject = component.find('subject').getElement().value;        
        
        action.setParams({
            'recordId' : component.get('v.recordId'),
            'subject' : subject
        });
        action.setCallback(this, $A.getCallback(function(response){
            if (response.getState() == 'SUCCESS'){
                component.get('v.data').Subject__c = subject;
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
            'message': 'La tarea se guardo correctamente'
        });
        resultsToast.fire();
    }
})
