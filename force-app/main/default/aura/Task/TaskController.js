({
    onInit : function(component, event, helper) {
        helper.checkStatus(component,helper,helper.ACTION_READ_ONLY);
    },
    handleEdit : function(component, event, helper) {              
        helper.lockingTask(component,helper,function(response){
                helper.editTask(component,helper);
        });                             
    },
    handleDelete : function(component, event, helper) {
        helper.lockingTask(component,helper,function(response){
            helper.deleteTask(component,helper);
        });                             
    },
    handleSave : function(component, event, helper) {        
        helper.lockingTask(component,helper,function(response){
            helper.saveTask(component,helper);
        });                             
    },
    handleClose : function(component, event, helper) {        
        component.set('v.edit',false);        
        helper.checkStatus(component,helper,helper.ACTION_READ_ONLY);        
    },
})
