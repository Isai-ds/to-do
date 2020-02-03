({
    onInit : function(component, event, helper) {
        helper.subscribe(component,event,helper);
        helper.getColumns(component);
        helper.getNotesLists(component);
        helper.getUserInfo(component);
    },
    newNoteList : function (component, event, helper){
        var button = event.getSource().getLocalId();
        var type = helper.LIST_OPTION;         
        if (button == helper.NOTE_OPTION){
            type = helper.NOTE_OPTION;
        }

        helper.fireNewRecordEvent(type);
    },    
    getSelectedRows : function(component,event,helper){
        var selectedRows = event.getParam('selectedRows')[0];      
        var type = helper.LIST_OPTION;        
        if (selectedRows.Type__c == 'Nota'){
            type =  helper.NOTE_OPTION;
        }
        helper.fireSelectedRecordEvent(type,selectedRows.Id);
    }
})