({
    NEW_LIST_NOTE_ACTION : 'create',
    UPDATE_LIST_NOTE_ACTION : 'update',
    LIST_OPTION : 'list',
    NOTE_OPTION : 'note',
    getColumns : function (component,helper){
        component.set('v.columns',[
            {label : 'Nombre', fieldName :'Name',type :'text'},
            {label : 'Tipo', fieldName :'Type__c',type :'text'},
            {label : 'Creado por', fieldName :'Owner.Name',type : 'text'},
            {label : 'Fecha de creación', fieldName :'CreatedDate',type : 'date-local'}
        ]);
    },
    getNotesLists : function(component) {

        //Hacemos que aparezca un icono de carga
        component.find('container').set('v.isLoading',true);

        //realizamos la llamada a nuestro backend para obtener las notas y listas
        var action = component.get('c.getNotesLists');
        action.setCallback(this,function(response){
            if (response.getState() == 'SUCCESS'){
                component.set('v.data',response.getReturnValue());
                component.find('container').set('v.isLoading',false);                
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
    getUserInfo : function(component) {            
        //realizamos la llamada a nuestro backend para obtener las notas y listas
        var action = component.get('c.getCurrentUser');
        action.setCallback(this,function(response){
            if (response.getState() == 'SUCCESS'){
                component.set('v.user',response.getReturnValue());                
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
    fireSelectedRecordEvent : function (type,recordId){
        var selectedRecordEvent = $A.get("e.c:selectedRecordEvent");
        selectedRecordEvent.setParams({
            'type' : type,
            'recordId' : recordId
        });
        selectedRecordEvent.fire();
    },
    fireNewRecordEvent : function (type){
        var newRecordEvent = $A.get("e.c:newRecordEvent");
        newRecordEvent.setParams({
            'type' : type            
        });
        newRecordEvent.fire();
    },
    subscribe : function(component, event, helper) {
        // Get the empApi component
        const empApi = component.find('empApi');        
        empApi.setDebugFlag(true);

        const channel = '/event/ContainerEvent__e';
        // Replay option to get new events
        const replayId = -1;
        

        empApi.subscribe(channel, replayId, $A.getCallback(eventReceived => {            
            console.log('Received event2  ', eventReceived.data.payload.CreatedById);
            
            helper.getNotesLists(component,event);

        }))
        .then(subscription => {
            // Confirm that we have subscribed to the event channel.
            // We haven't received an event yet.
            console.log('Subscribed to channel ', subscription.channel);
            // Save subscription to unsubscribe later
            component.set('v.subscription', subscription);
        });
    }
})