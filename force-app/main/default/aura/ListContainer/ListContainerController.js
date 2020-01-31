({
    doInit : function(component, event, helper) {
        helper.getNotesLists(component,event,function(response){
            //Si el resultado fue satifactorio agregamos los datos a la vista y así desplegue la informacion a los usuarios
            component.set('v.data',response.getReturnValue());
            component.find('container').set('v.isLoading',false);
        });
    }
})
