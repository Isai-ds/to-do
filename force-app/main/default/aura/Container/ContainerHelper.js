({    
    LIST_OPTION : 'list',
    NOTE_OPTION : 'note',
    showNote : function(component){
        if (!component.get('v.showNote')){
            component.set('v.showList',false);            
            component.set('v.showNote',true);                            
        }
    },
    showList : function(component){
        if (!component.get('v.showList')){
            component.set('v.showList',true);            
            component.set('v.showNote',false);                            
        }
    },
    loadRecord : function(component,type,recordId){        
        console.log('recordId method',recordId);
        component.find(type).loadRecord(recordId);         
    }
    
})