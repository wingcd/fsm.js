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
            this.getHSM().changeState('group::gameState');
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
            this.getHSM().changeState('group::idleState');
        }
    };
}

cc.Class({
    extends: cc.Component,
    hsm:null,
    properties: {
        time:{
            default:0,
            visible:false,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.hsm = new sm.hierarchicalStateMachine(this,true);

        idleState.prototype = new sm.state(this,this.hsm,'idleState');
        var idle = new idleState();

        gameState.prototype = new sm.state(this,this.hsm,'gameState');
        var game = new gameState();

        var group = new sm.compositeState(this,this.hsm,"group");
        group.init([idle,game],"idleState");

        this.hsm.init([group],'group');
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.time += dt;

        this.hsm.onUpdate(dt);
    },

});
