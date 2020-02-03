({
    onInit : function(component, event, helper) {
        helper.checkStatus(component,helper,helper.ACTION_READ_ONLY);
    },
    handleSelect : function(component, event, helper) {
        var button = event.getSource().getLocalId();
        if (button == 'edit'){          
            helper.getTask(component,helper,function(response){
                console.log('locking...',response.getReturnValue());
                
                var result = response.getReturnValue();
                component.set('v.data',result.task); 
                
                if (result.isBlocked){
                    helper.lockMessage(result.task.LastBlockedBy__r.Name);
                }else{
                    helper.editTask(component,helper);
                }
            });                     
        }
    },
    save : function(component, event, helper) {        
        helper.saveSubject(component,helper);
    },
    close : function(component, event, helper) {
        helper.unlockTask(component,helper,function(){
            component.set('v.edit',false);        
            helper.checkStatus(component,helper,helper.ACTION_READ_ONLY);
        });
    },
})
