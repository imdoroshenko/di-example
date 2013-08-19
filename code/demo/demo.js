DI.get('global-event-manager').addListener('application.init', function(){
    DI.get('template-manager').initWidgetManagers().init().render().appendTo(document.body);
    DI.get('global-event-manager').triggerEvent('application.start');
});