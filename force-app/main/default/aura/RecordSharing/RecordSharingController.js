({
    onInit : function(component, event, helper) {
        helper.getUsers(component);
    },
    handlerClose : function(component, event, helper) {
        var fireCloseSharingWindow = component.getEvent('closeSharing');
        fireCloseSharingWindow.fire();
    },
    handlerSave : function(component, event, helper) {
        helper.validate(component,function(){
            helper.sharing(component,helper);
        });
    }
})
