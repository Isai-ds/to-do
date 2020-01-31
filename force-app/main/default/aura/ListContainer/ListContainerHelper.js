({
    getColumns : function (component,helper){
        component.set('v.columns',[
            {label : 'Nombre', fieldName :'Name',type :'text'},
            {label : 'Tipo', fieldName :'Type__c',type :'text'},
            {label : 'Creado por', fieldName :'Owner.Name',type : 'text'},
            {label : 'Creado por', fieldName :'Owner.Name',type : 'date-local'}
        ]);
    },
    getNotesLists : function(component,event,callback) {

        //Hacemos que aparezca un icono de carga
        component.find('container').set('v.isLoading',true);

        //realizamos la llamada a nuestro backend para obtener las notas y listas
        var action = component.get('c.ListController');
        action.setCallback(this,function(response){
            if (response.getState() == 'SUCCESS'){
                callback(response);
            }else if (response.getState() == 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    }
})
