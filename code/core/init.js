document.addEventListener('DOMContentLoaded', function(e){
	DI.get('global-event-manager').triggerEvent('application.init', e);
}, false);
