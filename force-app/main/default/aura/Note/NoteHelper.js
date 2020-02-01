({
    newRecord : function(component,event) {
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
                console.log('Record template initialized: ',rec);
            })
        );
    },
    handleSave: function(component, event, helper) {  
        component.set('v.simpleRecord.Type__c', component.get('v.type'));
      
        component.find('recordData').saveRecord($A.getCallback(function(saveResult) {
            if (saveResult.state === 'SUCCESS' || saveResult.state === 'DRAFT') {                
                helper.saveMessage(component,event);
                helper.publishEventNotification(component);
                helper.isNewRecord(component,helper);                
            } else if (saveResult.state === 'INCOMPLETE') {
                console.log('User is offline, device doesn\'t support drafts.');
            } else if (saveResult.state === 'ERROR') {
                console.log('Problem saving contact, error: ' + JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        }));        
    },
    isNewRecord : function (component,helper){
        if (!component.get('v.recordId')){
            helper.newRecord(component);            
        }        
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
    }
})
