({
    onInit : function(component, event, helper) {
        helper.newRecord(component,event);
    },
    handleSave : function(component, event, helper) {
        helper.handleSave(component,event,helper);
    },
    newRecord : function(component, event, helper) {
        component.set('v.recordId','')
        component.find('recordCard').set('v.title','Crear nueva '+component.get('v.type').toLowerCase());
        helper.newRecord(component,event);
    },
    loadRecord : function(component) {
        component.find('recordCard').set('v.title','Modificar '+component.get('v.type').toLowerCase());
        component.find('recordData').reloadRecord(false);
    },
    handleRecordUpdated: function(component, event, helper) {
        var eventParams = event.getParams();
        if(eventParams.changeType === "CHANGED") {
            // get the fields that changed for this record
            var changedFields = eventParams.changedFields;
            console.log('Fields that are changed: ' + JSON.stringify(changedFields));            

        } else if(eventParams.changeType === "LOADED") {
            // record is loaded in the cache
        } else if(eventParams.changeType === "REMOVED") {
            // record is deleted and removed from the cache
        } else if(eventParams.changeType === "ERROR") {
            // there’s an error while loading, saving or deleting the record
        }
    }
})
