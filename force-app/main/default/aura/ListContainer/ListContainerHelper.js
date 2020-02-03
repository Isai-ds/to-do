({
    NEW_LIST_NOTE_ACTION : 'create',
    UPDATE_LIST_NOTE_ACTION : 'update',
    LIST_OPTION : 'list',
    NOTE_OPTION : 'note',
    getColumns : function (component,helper){
        component.set('v.columns',[
            {label : 'Nombre', fieldName :'Name',type :'text',
                cellAttributes: {
                    iconName : {
                        fieldName:'statusRecordIcon'
                    },
                    iconPosition : 'left',
                    iconAlternativeText : {
                        fieldName:'tooltipRecordIcon'
                    }
                }
            },
            {label : 'Tipo', fieldName :'Type__c',type :'text'},
            {label : 'Creado por', fieldName :'OwnerName',type : 'text'},
            {label : 'Fecha de creación', fieldName :'CreatedDate',type : 'date-local'}
        ]);
    },
    setData : function(component,helper, records){
        records.forEach(function(record){
            record.OwnerName = record.Owner.Name;
            helper.getIcon(component,record);
        });
        component.set('v.data',records);
    },
    getIcon : function(component,record) {
        if (record.isBlocked__c){      
            console.log(component.get('v.user'));  
            record.statusRecordIcon =  component.get('v.user').Id == record.LastBlockedBy__c ? 'utility:reminder' : 'utility:resource_absence';
            record.tooltipRecordIcon = 'El usuario '+record.LastBlockedBy__r.Name+' se encuentra modificando la '+record.Type__c+'. Espere a que el usuario termine';
        }              
    },
    getNotesLists : function(component,helper) {

        //Hacemos que aparezca un icono de carga
        component.find('container').set('v.isLoading',true);

        //realizamos la llamada a nuestro backend para obtener las notas y listas
        var action = component.get('c.getNotesLists');
        action.setCallback(this,function(response){
            if (response.getState() == 'SUCCESS'){
                helper.setData(component,helper,response.getReturnValue());
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
                        console.log("Error user message: " + errors[0].message);
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