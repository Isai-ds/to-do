({
    handleCreationEvent : function(component, event, helper) {
        var type = event.getParam('type');        
        console.log('<-handleCreationEvent->');
        console.log('type',type);

        if (type == helper.NOTE_OPTION){
            helper.showNote(component);
            component.find('note').newRecord();         
        }else if (type == helper.LIST_OPTION){            
            helper.showList(component);
            component.find('list').newRecord();         
        }
    },
    handleSelectedRecordEvent : function(component, event, helper) {
        var type = event.getParam('type');        
        var recordId = event.getParam('recordId');
        console.log('<-handleSelectedRecordEvent->');
        console.log('type',type);
        console.log('recordId',recordId);

        if (type == helper.NOTE_OPTION){
            helper.showNote(component);
            helper.loadRecord(component, helper.NOTE_OPTION,recordId);         
        }else if (type == helper.LIST_OPTION){   
            helper.showList(component);
            helper.loadRecord(component, helper.LIST_OPTION,recordId);                     
        }
    }
})