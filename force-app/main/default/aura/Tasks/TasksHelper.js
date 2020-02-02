({
    getColumns : function (component,helper){
        component.set('v.columns',[
            {label : 'Asunto', fieldName :'Subject',type :'text'},
            {label : 'Fecha de tarea', fieldName :'ActivityDate',type :'text'},
            {label : 'Estado', fieldName :'Status',type : 'text'},
            {label : 'Encargado', fieldName :'Owner.Name',type : 'text'},
            {label : 'Fecha de creación', fieldName :'CreatedDate',type : 'date-local'}
        ]);
    },
    getTasks : function(component,event) {

        //Hacemos que aparezca un icono de carga
       // component.find('tasks').set('v.isLoading',true);

        //realizamos la llamada a nuestro backend para obtener las notas y listas
        var action = component.get('c.getTasks');
        action.setParams({
            'recordId' : component.get('v.recordId')
        });
        action.setCallback(this,function(response){
            if (response.getState() == 'SUCCESS'){
                component.set('v.data',response.getReturnValue());
                //component.find('tasks').set('v.isLoading',false);                
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
    },
})