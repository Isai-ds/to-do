({
    onInit : function(component, event, helper) {
        helper.checkStatus(component,helper,helper.ACTION_READ_ONLY);
    },
    handleSelect : function(component, event, helper) {
        var button = event.getSource().getLocalId();
        if (button == 'edit'){            
            component.set('v.edit',true);
            helper.checkStatus(component,helper,helper.ACTION_EDIT);
        }
    },
    save : function(component, event, helper) {        
        helper.saveSubject(component,helper);
    },
    close : function(component, event, helper) {
        component.set('v.edit',false);        
        helper.checkStatus(component,helper,helper.ACTION_READ_ONLY);
    },
})
