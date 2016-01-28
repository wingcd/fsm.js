#FMS_JS

this project copy from a unity finite state machine(FSM),and i use it in html5 game engine,such like cocoscreator;

How to use this:

  1.require this project as sm, create a new hierarchicalStateMachine to manager the states:
  ```javascript
  var sm = require('stateMachine');
  var hsm = new sm.hierarchicalStateMachine(this,true);
  ```
  2. write your own's state class extend from sm.state,override the state function to do what you want to do...:
  ```javascript
  function state1(){
    this.onUpdate=function(dt){
    //to do list...
    }
  }
  state1.prototype = new sm.state(this,this.hsm,'state1');
  
  function state2(){
   this.onUpdate=function(dt){
    //to do list...
    }
  }
  state2.prototype = new sm.state(this,this.hsm,'state2');
  
  var s1 = new state1();
  var s2 = new state2();
  ```
  3. regist the states into state manager,and set the default state:
  ```javascript
  this.hsm.init([s1,s2],'state1');
  ```
  4. finally,invoke the update function of state manchine mananger,then enjoy this:
  ```javascript
  this.hsm.onUpdate(dt);
  ```
  5. to total code like this:
  ```javascript
  var sm = require('stateMachine');

  function idleState(){
    var that = this;
    var time = 0;
    this.onEnter=function(){
        time = 0;
    };
    this.onUpdate=function(dt){
        time += dt;
        if(time > 10){
            this.getHSM().changeState('gameState');
        }
    };
  }

  function gameState(){
    var that = this;
    var time = 0;
    this.onEnter=function(){
        time = 0;
    };
    this.onUpdate=function(dt){
        time += dt;
        if(time > 10){
            this.getHSM().changeState('idleState');
        }
    };
  }

  // use this for initialization
  {
    hsm:null;
    //initialize the all states
    onLoad: function () {
        //open debug mode,so that can watch the log
        this.hsm = new sm.hierarchicalStateMachine(this,true);
  
        idleState.prototype = new sm.state(this,this.hsm,'idleState');
        var idle = new idleState();
  
        gameState.prototype = new sm.state(this,this.hsm,'gameState');
        var game = new gameState();
  
        this.hsm.init([idle,game],'idleState');
    },
  
    // what ever engine to invoke this function
    update: function (dt) {
       //must be
        this.hsm.onUpdate(dt);
    }
  }
  ```
  
  and,there had two demo about single state and composite state in cocos creator in this project!
