({    
    getTasks : function(component,event) {

        //Hacemos que aparezca un icono de carga
       // component.find('tasks').set('v.isLoading',true);

        //realizamos la llamada a nuestro backend para obtener las notas y listas
        var action = component.get('c.getTasks');
        action.setParams({
            'recordId' : component.get('v.parentId')
        });
        action.setCallback(this,function(response){
            if (response.getState() == 'SUCCESS'){
                component.set('v.data',response.getReturnValue());
                //component.find('tasks').set('v.isLoading',false);                
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
        });
        $A.enqueueAction(action);
    },
    newRecord : function(component) {
        component.find('recordData').getNewRecord(
            'Task__c', 
            null,      
            false,     
            $A.getCallback(function() {
                var rec = component.get('v.task');
                var error = component.get('v.recordError');
                if(error || (rec === null)) {
                    console.log('Error initializing task template: ' + error);
                    return;
                }
                console.log('Task template initialized: ',rec);
            })
        );
    },
    fireOnlyTaskEvent : function(component){
        var onSaveTaskEvent = $A.get('e.c:addOnlyTaskEvent');
        onSaveTaskEvent.fire();
    },
    handleSave: function(component, event, helper,callback) {  
        component.set('v.simpleTask.List__c', component.get('v.parentId'));
        component.find('recordData').saveRecord($A.getCallback(function(saveResult) {
            if (saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT') {                                
                helper.newRecord(component);
                if (callback){
                    callback();             
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
    saveMessage : function (){        
        var resultsToast = $A.get('e.force:showToast');
        resultsToast.setParams({
            'title': 'Guardado',
            'message': 'La tarea sea ha agregado correctamente'
        });
        resultsToast.fire();
    },
})