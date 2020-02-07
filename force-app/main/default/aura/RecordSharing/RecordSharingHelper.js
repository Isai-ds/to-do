({
    getUsers : function(component) {
        //realizamos la llamada a nuestro backend para obtener las tareas
        var action = component.get('c.getUsers');
        
        action.setCallback(this,function(response){
            if (response.getState() == 'SUCCESS'){
                component.set('v.options',response.getReturnValue());
                //component.find('tasks').set('v.isLoading',false);                
            }else if (response.getState() == 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: ",errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    validate : function(component,callback){
        var select = component.find('users');
        
        if (!component.get('v.selectedValue')){                                               
            select.showHelpMessageIfInvalid();
        }else{
            select.set('v.errors',null);
            callback();
        }
        
    },
    sharing : function(component,helper) {
        //realizamos la llamada a nuestro backend para obtener las tareas        
        var action = component.get('c.sharing');
        action.setParams({
            'recordId' : component.get('v.data').Id,
            'userId' : component.get('v.selectedValue')
        });
        
        action.setCallback(this,function(response){
            if (response.getState() == 'SUCCESS'){
                helper.saveMessage(component);
            }else if (response.getState() == 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: ",errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    saveMessage : function (component){        
        var resultsToast = $A.get('e.force:showToast');
        resultsToast.setParams({
            'title': 'Compartir',
            'message': 'El registro '+component.get('v.data').Name+' se ha compartido correctamente',
            'type': 'success'
        });
        resultsToast.fire();
    },  
})
