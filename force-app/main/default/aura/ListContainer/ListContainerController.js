({
    onInit : function(component, event, helper) {
        helper.getColumns(component);
        helper.getNotesLists(component,event,function(response){
            //Si el resultado fue satifactorio agregamos los datos a la vista y así desplegue la informacion a los usuarios
            component.set('v.data',response.getReturnValue());
            component.find('container').set('v.isLoading',false);
        });
    },
    newNoteList : function (component, event, helper){
        var button = event.getSource().getLocalId();
        var type = helper.LIST_OPTION;         
        if (button == helper.NOTE_OPTION){
            type = helper.NOTE_OPTION;
        }

        helper.fireCreateUpdateNoteListEvent(helper.NEW_LIST_NOTE_ACTION,type);


    }
})