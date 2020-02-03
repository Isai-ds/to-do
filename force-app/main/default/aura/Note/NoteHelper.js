({
    NOTE_OPTION : 'Nota',
    LIST_OPTION : 'Lista',
    newRecord : function(component,helper) {
        component.find('recordData').getNewRecord(
            'Container__c', 
            null,      
            false,     
            $A.getCallback(function() {
                var rec = component.get('v.record');
                var error = component.get('v.recordError');
                if(error || (rec === null)) {
                    console.log('Error initializing record template: ' + error);
                    return;
                }                
            })
        );
    },
    reloadRecord : function(component,helper,callback) {
        component.find('recordData').reloadRecord(true,$A.getCallback(function(){
            if (component.get('v.type')== helper.LIST_OPTION){
                helper.fireRetrieveTasksEvent(component.get('v.recordId'));                
            }
            if (callback){
                callback();
            }
        }));
    },
    handleSave: function(component, event, helper,callback) {  
        component.set('v.simpleRecord.Type__c', component.get('v.type'));
      
        component.find('recordData').saveRecord($A.getCallback(function(saveResult) {
            if (saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT') {                
                helper.saveMessage(component,event);  
                if (callback){
                    callback(saveResult);                    
                }                                          
            } else if (saveResult.state === 'INCOMPLETE') {
                console.log('User is offline, device doesn\'t support drafts.');
            } else if (saveResult.state === 'ERROR') {
                console.log('Problem saving contact, error: ' + JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        }));        
    },    
    publishEventNotification : function (component){
        var action = component.get('c.publishRecordCreation');
        action.setCallback(this,$A.getCallback(function(response) {
            if (response.getState() == 'ERROR'){
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
    saveMessage : function (component,event){        
        var resultsToast = $A.get('e.force:showToast');
        resultsToast.setParams({
            'title': 'Guardado',
            'message': 'La nota fue guardado correctamente'
        });
        resultsToast.fire();
    },
    fireRetrieveTasksEvent : function(recordId){        
        var retrieveTasksEvent = $A.get('e.c:retrieveTasksEvent');
        retrieveTasksEvent.setParams({
            'parentId' : recordId
        });
        retrieveTasksEvent.fire();
    },    
    fireNewTasksEvent : function(recordId){        
        var newTasksEvent = $A.get('e.c:newTasksEvent');        
        newTasksEvent.fire();
    },
    fireOnlyTaskEvent : function(parentId){
        var onSaveTaskEvent = $A.get('e.c:addOnlyTaskEvent');
        onSaveTaskEvent.setParams({
            'parentId' : parentId
        });
        onSaveTaskEvent.fire();
    },
    setRecordToEdit : function (component, recordId){        
        component.set('v.recordId',recordId);
        component.find('recordCard').set('v.title','Modificar '+component.get('v.type').toLowerCase());
    },
    getUserInfo : function(component) {            
        //realizamos la llamada a nuestro backend para obtener las notas y listas
        var action = component.get('c.getCurrentUser');
        action.setCallback(this,function(response){
            if (response.getState() == 'SUCCESS'){
                component.set('v.user',response.getReturnValue());      
                console.log('user->',response.getReturnValue());
            }else if (response.getState() == 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error user message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },    
    lockingContainer : function(component,helper,callback) {
        var action = component.get('c.lockingContainer');
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
    lockMessage : function (userName){        
        var resultsToast = $A.get('e.force:showToast');
        resultsToast.setParams({
            'title': 'Lista bloqueada',
            'message': 'La lista se esta modificando por '+userName+'. Espere a que el usuario termine',
            'type' : 'warning'

        });
        resultsToast.fire();
    },
    unlockContainer : function(component,helper,callback) {
        var action = component.get('c.unlockContainer');
        action.setParams({
            'recordId' : component.get('v.recordId')
        });
        action.setCallback(this, $A.getCallback(function(response){
            if (response.getState() == 'SUCCESS'){                
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
    editContainer :  function(component,helper){
        component.set('v.actionType','edit');
    },
    checkingContainer : function (component,helper,callback){
        helper.lockingContainer(component,helper,function(response){
            console.log('locking...',response.getReturnValue());        
            var result = response.getReturnValue();            
            if (result.isBlocked){
                helper.lockMessage(result.LastBlockedBy.Name);
            }else{
                callback(result);
            }
        });    
    }
})
