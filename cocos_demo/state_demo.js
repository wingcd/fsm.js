var sm = require('fms');

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

        this.hsm.init([idle,game],'idleState');
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.time += dt;

        this.hsm.onUpdate(dt);
    },

});
