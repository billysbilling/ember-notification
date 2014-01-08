module.exports = function(container) {
    container.register('component:notification', require('./notification-component'));
    
    function notify(message, type) {
        var notification = container.lookup('component:notification');
        notification.set('message', message);
        notification.set('type', type);
        notification.show();
    }

    return {
        notify: notify,
        success: function(text) {
            notify(text, 'success');
        },
        warn: function(text) {
            notify(text, 'warn');
        }
    };
};