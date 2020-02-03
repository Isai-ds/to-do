({
    onInit : function(component, event, helper) {
        helper.checkStatus(component,helper,helper.ACTION_READ_ONLY);
    },
    handleSelect : function(component, event, helper) {
        var button = event.getSource().getLocalId();
        if (button == 'edit'){
            helper.getTask(component,event,helper,function(){
                component.set('v.edit',true);
            });
        }
    },
    save : function(component, event, helper) {        
        helper.saveSubject(component,helper);
    },
    close : function(component, event, helper) {
        component.set('v.edit',false);        
    },
})
