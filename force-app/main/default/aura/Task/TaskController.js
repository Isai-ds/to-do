({
    handleSelect : function(component, event, helper) {
        var button = event.getSource().getLocalId();
        if (button == 'edit'){
            component.set('v.edit',true);
            component.find('recordData').reloadRecord(false,$A.getCallback(function(){
                console.log('reload');
            }));
        }
    },
    save : function(component, event, helper) {        
        
    },
})
