DEPENDENCY['application'] = {
    'template-manager' : {
        'addWidgetModel' : [
            {
                'service' : 'widget-model',
                'dependency' : { 'domainObject' : {'instance' : function(){return WidgetDO(incomingWidget);}}} /*TODO: remove this hack*/
            },
            {
                'service' : 'widget-model',
                'dependency' : { 'domainObject' : {'instance' : function(){return WidgetDO(incomingWidget2);}}} /*TODO: remove this hack*/
            }
        ],
        'toolsManager' : {
            'service' : 'widget-manager',
            'dependency' :{
                'addRenderer' : {
                    'service' : 'text-tools-renderer',
                    'dependency' : {
                        'richView' : {
                            'service-constructor' : 'rich-view',
                            'dependency': {
                                'setEventManager' : {
                                    'service' : 'event-manager',
                                    'dependency' : {
                                        'setContext' : {'poll' : 'rich-view'}
                                    }
                                },
                                'template' : {'value' : 'code/template/tools.html'}
                            }
                        }
                    }
                },
                'addHandler' : {'instance' : 'TextToolsHandler'},
                'containerRenderer' : {
                    'service' : 'rich-view',
                    'dependency': {
                        'setEventManager' : {
                            'service' : 'event-manager',
                            'dependency' : {
                                'setContext' : {'poll' : 'rich-view'}
                            }
                        },
                        'template' : {'value' : 'code/template/tools-container.html'}
                    }
                }
            }
        },
        'editorManager' : {
            'service' : 'widget-manager',
            'dependency' :{
                'addRenderer' : {
                    'service' : 'text-editor-renderer',
                    'dependency' : {
                        'globalEventManager' : {'service' : 'global-event-manager'},
                        'richView' : {
                            'service-constructor' : 'rich-view',
                            'dependency': {
                                'setEventManager' : {
                                    'service' : 'event-manager',
                                    'dependency' : {
                                        'setContext' : {'poll' : 'rich-view'}
                                    }
                                },
                                'template' : {'value' : 'code/template/editor.html'}
                            }
                        }
                    }
                },
                'addHandler' : {'instance' : 'TextEditorHandler'},
                'containerRenderer' : {
                    'service' : 'rich-view',
                    'dependency': {
                        'setEventManager' : {
                            'service' : 'event-manager',
                            'dependency' : {
                                'setContext' : {'poll' : 'rich-view'}
                            }
                        },
                        'template' : {'value' : 'code/template/editor-container.html'}
                    }
                }
            }
        },
        'applicationRenderer' : {
            'service' : 'rich-view',
            'dependency': {
                'setEventManager' : {
                    'service' : 'event-manager',
                    'dependency' : {
                        'setContext' : {'poll' : 'rich-view'}
                    }
                },
                'template' : {'value' : 'code/template/application.html'}
            }}
    },
    'widget-manager' : {},
    'widget-model' : {
        'eventManager' : {
            'service' : 'event-manager',
            'dependency' : {
                'setContext' : {'poll' : 'widget-model'}
            }
        }
    },
    'global-event-manager' : {
        'context' : {'object' : 'window'}
    }
};
SERVICES['config'] = {
    'global-event-manager' : {
        'singleton' : true
    }
};