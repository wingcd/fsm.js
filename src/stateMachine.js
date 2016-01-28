stateMachine={
    state:function(owner,hsm,name){
        var _name = name;
        var _hsm = hsm;
        var _owner = owner;
        var that = this;
        this.isCompositeState=function(){
           return false;  
        };
        
        this.init=function(){
            
        };
        this.onEnter=function(){
            
        };
        this.onExit=function(){
            
        };
        this.onStateChange=function(stateName){
            
        };
        this.onUpdate=function(dt){
            
        };
        this.onLaterUpdate=function(dt){
            
        };
        this.getName = function(){
            return _name;  
        };
        
        this.getHierachicalName=function(){
            return _name;  
        };
        this.getHSM=function(){
           return _hsm;  
        };
        this.getOwner=function(){
           return _owner;  
        };
        
        return this;
    },
    compositeState:function(owner,hsm,name){
        var _name = name;
        var _hsm = hsm;
        var _owner = owner;
        var _hierachicalName = "";
        
        var _currentState=null;
        var _defaultStateName=""; //string
        var _nameDictionary={};
        
        this.isCompositeState=function(){
           return true;  
        };
        this.init=function(states,defaultStateName){
            if(!(states instanceof Array)){
                console.log("states must be array data!");
                return;
            }
            
            _currentOverwriteFlag = false;
            for(var i in states){
                var state = states[i];
                _nameDictionary[state.getName()] = state;
            }
            
            _defaultStateName = defaultStateName;
        };
        this.getCurrentState=function(){
           return _currentState;  
        },
        this.onEnter=function(){
            //set to default state
            _currentState = this.getStateByName(_defaultStateName);
            if(!_currentState){
                console.log("Invalid state name:" + _defaultStateName);
                return;
            }
            
            if(_hsm.enableDebug){
                console.log("CompositeState::onEnter " + _currentState.getName());
            }
            
            if(_currentState && _currentState.onEnter){
                _currentState.onEnter();
            }
        };
        this.onExit=function(){
            if(_currentState && _currentState.onExit){
                _currentState.onExit();
            }
            
            if(_hsm.enableDebug){
                console.log("CompositeState::onExit " + _currentState.getName());
            }
            
            _currentState = null;
        };
        this.onStateChange=function(stateName){
            if(_currentState && _currentState.onExit){
                //exit current state
                _currentState.onExit();
                
            }
            //set new state
            var newState = this.getStateByName(stateName);
            if(!newState){
                console.log("Invalid state name: " + stateName);
                return;
            }
            
            if(_hsm.enableDebug){
                console.log("Change sub state from " + _currentState?_currentState.getName():"_empty_" + " to " + newState.getName());
            }
            
            _currentState = newState;
            
            //enter new state
            if(_currentState.onEnter){
                _currentState.onEnter();
            }
        };
        this.onUpdate=function(dt){
            if(_currentState && _currentState.onUpdate){
                _currentState.onUpdate(dt);
            }
        };
        this.onLaterUpdate=function(dt){
            if(_currentState && _currentState.onUpdate){
                _currentState.onLaterUpdate(dt);
            }
        };
        this.getName=function(){
           return _name;  
        };
        this.getHierachicalName=function(){
            if(_currentState){
                return getName() + "::" + _currentState.getHierachicalName();
            }else{
                return _name;  
            }
        };
        this.getStateByName=function(stateName){
            return _nameDictionary[stateName];
        };
        this.getHSM=function(){
           return _hsm;  
        };
        this.getOwner=function(){
           return _owner;  
        };
        
        return this;
    },
    hierarchicalStateMachine:function(owner,enableDebug){
        this.owner=owner;
        this.onStateChanged;
        this.enableDebug=enableDebug || false;
        
        var _currentState=null;
        var _previousState=null;
        var _nameDictionary={};
        var _pendingStateChange=null; //string
        var _currentOverwriteFlag=false;
        var _self = this;
        
        this.getCurrentState=function(){
            return _currentState;
        };
        this.getPreviousState=function(){
            return _previousState;
        };
        this.init=function(states,defaultStateName){
            if(!(states instanceof Array)){
                console.log("states must be array data!");
                return;
            }
            
            _currentOverwriteFlag = false;
            
            for(var i in states){
                var state = states[i];
                _nameDictionary[state.getName()] = state;
            }
            
            //to default state
            doChangeState(defaultStateName);
        };
        this.onUpdate=function(dt){
            if(_pendingStateChange){
                doChangeState(_pendingStateChange);
                
                //clean state
                _pendingStateChange = null;
            }
            
            //reset flag
            _currentOverwriteFlag = true;
            
            //update current state
            if(_currentState && _currentState.onUpdate){
                _currentState.onUpdate(dt);
            }
        };
        this.onLaterUpdate = function(dt){
            onUpdate(dt);  
        };
        this.cleanPendingState = function(){
            _pendingStateChange = null;
            _currentOverwriteFlag = true;
        };
        this.forceChangeState=function(stateName){
            doChangeState(stateName);
            
            //reset flag
            cleanPendingState();
        };
        this.changeState = function(stateName,overwriteFlag){
            overwriteFlag = overwriteFlag || true;
            //check current flag
            if(_currentOverwriteFlag){
                //enable overwrite
                if(_pendingStateChange && enableDebug){
                    console.log("ChangeState will replace state " + _pendingStateChange + " with " + stateName);
                }
                
                _pendingStateChange = stateName;
            }else{
                //disable overwrite
                if(_pendingStateChange){
                    if(enableDebug){
                        console.log("Reject state changing from " + _pendingStateChange + " to " + stateName);
                    }
                    
                    return;
                }
                
                _pendingStateChange = stateName;
            }
            
            //save flag
            _currentOverwriteFlag = overwriteFlag;
        };
        this.getStateByName=function(stateName){
            return _nameDictionary[stateName];
        };
        
        function doChangeState(stateName){
            //save old state
            _previousState = _currentState;
            var names=stateName.split("::");
            
            if(names.length == 1){
                var name = names[0];
                if(_currentState && _currentState.onExit){
                    _currentState.onExit();
                }
                var newState = _nameDictionary[stateName];
                if(!newState){
                    console.log("Invalid state name: " + stateName);
                    return;
                }
                
                if(enableDebug){
                    console.log("Change state from: " + 
                    (_currentState?_currentState.getName():"_empty_") + 
                    " to: " + newState.getName());
                }
                
                _currentState = newState;
                
                if(_currentState.onEnter)
                    _currentState.onEnter();
            }else if(names.length == 2){
                //composite state
                var parentStateName = names[0];
                //find parent state
                var parentState = _self.getStateByName(parentStateName);
                if(!parentState){
                    console.log("Invalid state name: " + parentStateName);
                    return;
                }
                
                //check if parent state is current state
                if(parentState != _currentState){
                    if(_currentState && _currentState.onExit){
                        //exit current state
                        _currentState.onExit();
                        
                        //waring
                        if(enableDebug){
                            console.log("Transfer to internal state!");
                        }
                    }  
                }
                
                //let state to handle it
                var subStateName = names[1];
                parentState.onStateChange(subStateName);
            }else{
                console.log("Invalid state name: " + stateName);
            }
            
            if(_self.onStateChanged){
                _self.onStateChanged(_previousState.getHierachicalName(),_currentState.getHierachicalName());
            }
        }
    }
};

module.exports = stateMachine;