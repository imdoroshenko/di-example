SERVICES['constructor']['template-manager'] = function(){
	var my = this,
	widgetModelsCollection = [],
	templateModel = null,
	toolsManager = null,
	editorManager = null,
	mainContainerRenderer = null;

    this.init = function(){
		return this;
	};

    this.initWidgetManagers = function(){
        this.getWidgetCollections().forEach(function(m){
            /**tools**/
            my.$getToolsManager().addModel(m);
            /**editor**/
            my.$getEditorManager().addModel(m);
            return true;
        });
        return this;
    };

    this.render = function(){
		var container = my.$getApplicationRenderer();
        my.$getToolsManager().render().appendTo(container.node.inner.el);
        my.$getEditorManager().render().appendTo(container.node.inner.el);
		return container;
	};
	/********** injections **********/
	
	/**setters**/
    this.addWidgetModel = function(obj){
        widgetModelsCollection.push(obj);
		return this;
	};
    this.setTemplateModel = function(obj){
		templateModel = obj;
		return this;
	};
    this.setToolsManager = function(obj){
		toolsManager = obj;
		return this;
	};
    this.setEditorManager = function(obj){
		editorManager = obj;
		return this;
	};
    this.setApplicationRenderer = function(obj){
        mainContainerRenderer = obj;
		return this;
	};
	/**getters**/
    this.getApplicationRenderer = function(obj){
        return mainContainerRenderer;
    };
    this.getWidgetCollections = function(){
		return widgetModelsCollection;
	};
    this.getToolsManager = function(){
		return toolsManager;
	};
    this.getEditorManager = function(){
		return editorManager;
	};
};