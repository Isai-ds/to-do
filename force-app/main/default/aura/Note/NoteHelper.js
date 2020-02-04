({
    NOTE_OPTION : 'Nota',
    LIST_OPTION : 'Lista',
    CREATED_EVENT : 'created',
    DELETED_EVENT : 'deleted',
    newRecord : function(component,helper) {
        component.find('recordData').getNewRecord(
            'Container__c', 
            null,      
            false,     
            $A.getCallback(function() {
                var error = component.get('v.recordError');
                if(error) {
                    console.log('Error initializing note / list template: ' + error);
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
                helper.saveMessage('Actualización','La '+component.get('v.type').toLowerCase()+ ' se actualizó correctamente');             

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
    handleDelete: function(component) {
        component.find('recordData').deleteRecord($A.getCallback(function(deleteResult) {        
            if (deleteResult.state === 'SUCCESS' || deleteResult.state === 'DRAFT') {                
                console.log('Record is deleted.');
            } else if (deleteResult.state === 'INCOMPLETE') {
                console.log('User is offline, device doesn\'t support drafts.');
            } else if (deleteResult.state === 'ERROR') {
                console.log('Problem deleting record, error: ' + JSON.stringify(deleteResult.error));
            } else {
                console.log('Unknown problem, state: ' + deleteResult.state + ', error: ' + JSON.stringify(deleteResult.error));
            }
        }));
    },
    publishEventNotification : function (component,eventType){
        console.log('pubkishin......');
        var action = component.get('c.publishRecordCreation');
        action.setParams({
            'recordId' : component.get('v.recordId'),
            'eventType' : eventType
        });
        action.setCallback(this,$A.getCallback(function(response) {
            if (response.getState() == 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + 
                                 errors[0].message);
                    }
                } else {
                    console.log('Unknown error');
                }
            }
        }));
        $A.enqueueAction(action);
    },
    saveMessage : function (title,message,error){        
        var resultsToast = $A.get('e.force:showToast');
        resultsToast.setParams({
            'title': title,
            'message': message,
            'type' : (error) ? 'error' : 'success'
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
                        console.log('Error user message: ' + 
                                 errors[0].message);
                    }
                } else {
                    console.log('Unknown error');
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
                        console.log('Error message: ' + 
                                 errors[0].message);
                    }
                } else {
                    console.log('Unknown error');
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
                        console.log('Error message: ' + 
                                 errors[0].message);
                    }
                } else {
                    console.log('Unknown error');
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
            var result = response.getReturnValue();      
            if (result.hasOwnProperty('IsDeleted')){
                helper.saveMessage('Eliminación','La '+component.get('v.type').toLowerCase()+ ' fue eliminada por otro usuario',true);
                helper.newRecordActions(component,helper);
            }else if (result.isBlocked){
                helper.lockMessage(result.LastBlockedBy.Name);
            }else{
                callback(result);
            }
        });    
    },
    deleteRecordPostAction : function(component,helper,parameters){
        console.log('parameters',parameters);
        console.log('record deleted',component.get('v.recordId'));
        helper.saveMessage('Eliminación','La '+component.get('v.type').toLowerCase()+ ' se eliminó correctamente'); 
        helper.newRecordActions(component,helper);
    },
    newRecordActions : function(component,helper){
        component.set('v.recordId','')
        component.set('v.actionType','new');
        component.find('recordCard').set('v.title','Crear nueva '+component.get('v.type').toLowerCase());
        helper.newRecord(component,helper);
        if (component.get('v.type')== helper.LIST_OPTION){
            helper.fireNewTasksEvent();
        }
    }
})
