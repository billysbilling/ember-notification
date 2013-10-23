var stack = [];

function register(message) {
    deregister(message);
    var last = stack.get('lastObject');
    if (last) {
        message.set('zIndex', last.get('zIndex') + 10);
    } else {
        message.set('zIndex', 3000);
    }
    stack.push(message);
}

function deregister(message) {
    stack.removeObject(message);
}

module.exports = Em.Component.extend({
    template: require('../templates/notification-component'),
    
    classNames: ['notification'],
    
    attributeBindings: ['style'],

    zIndex: null,
    
    type: null,
    
    message: null,
    
    containerSelector: '.notification-container',

    opacity: 0,
    
    stack: stack,

    style: function() {
        var s = [],
            zIndex = this.get('zIndex');
        s.push('z-index:' + zIndex + ';');
        s.push('top:' + this.get('topOffset') + 'px;');
        s.push('opacity:' + this.get('opacity') + ';');
        return s.join(' ');
    }.property('zIndex', 'topOffset', 'opacity'),

    topOffset: function() {
        return stack.indexOf(this) * 40 + 57 - 30/2; //TODO: Calculate this in a better way
    }.property('stack.@each'),

    registerMe: function() {
        register(this);
    }.on('init'),

    show: function() {
        var self = this;
        this.appendTo(Billy.get('rootElement'));
        this.setHideTimeout();
        Em.run.next(function(){
            self.set('opacity', 1);
        });
    },

    moveToContainer: function() {
        var container = $(this.get('containerSelector'));
        container = container.length ? container.first() : this.container.lookup('application:main').get('rootElement');
        this.$().appendTo(container);
    }.on('didInsertElement'),

    hide: function() {
        clearTimeout(this._hideTimeoutId);
        var self = this;
        this.set('opacity', 0);
        setTimeout(function() {
            Em.run(function() {
                deregister(self);
                self.destroy();
            });
        }, 200);
    },

    setHideTimeout: function() {
        var self = this;
        this._hideTimeoutId = setTimeout(function() {
            Em.run(function() {
                self.hide();
            });
        }, 5000);
    },

    mouseEnter: function() {
        clearTimeout(this._hideTimeoutId);
    },
    
    mouseLeave: function() {
        this.setHideTimeout();
    },

    actions: {
        hide: function() {
            this.hide();
        }
    }
});