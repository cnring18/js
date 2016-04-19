/* 
	Custom dxAutoCompleteGrid widget for DevExpress

	Combines use of dxTextBox, dxPopover, dxDataGrid

	Configured using DevExpress jQuery approach

	$('#id').dxAutoCompleteGrid({ config options });

	Config Options:
		widgetOptions - options object for the dxAutoCompleteGrid widget

			dataSource (recommended) - recommended for full widget use as the dxDataGrid depends on it

			searchExpr (optional) - option is available to determine which grid field is searched with textbox input

			valueExpr (required) - determines field of grid data to set as textbox value when a grid row is selected

			onValueChanged(value, data) (optional) - callback function for returning widget data object for given value
				. value returned on enter/row select/focusOut, is dxTextBox value
				. data object empty unless grid row selected

		dxTextBoxOptions - options object for the dxTextBox used within the widget

		dxPopoverOptions - options object for the dxPopover used within the widget

		dxDataGridOptions - options object for the dxDataGrid used within the widget


	For custom styling purposes, use the classes: 
		dx-autocompletegrid-textbox - textbox div contained by the widget
		dx-autocompletegrid-grid - grid div contained by the widget
		dx-autocompletegrid-popover - popover div contained by the widget
		dx-autocompletegrid-popover dx-popup-content - actual content did of the popover

	Dependencies: jQuery, dx.webappjs.js 
*/
$.fn.extend({
	dxAutoCompleteGrid: function (options = {}) {
		var widget = this;
		widget.BASECLASS = 'dx-autocompletegrid';
		widget.addClass(widget.BASECLASS);
		widget.data =  {};

	    widget.SetOptions = function (options = {}) {
	    	try {
		    	if(options.widgetOptions) {
			    	Object.keys(options.widgetOptions).forEach(function (key) {
			    		widget.widgetOptions[key] = options.widgetOptions[key];
			    	});
			    }
			    if(options.dxTextBoxOptions) {
			    	widget.dxTextBox.option( widget.RemovePresetKeys(options.dxTextBoxOptions) );
			    }
			    if(options.dxPopoverOptions) {
			    	widget.dxPopover.option( widget.RemovePresetKeys(options.dxPopoverOptions) );
			    }
			    if(options.dxDataGridOptions) {
			    	widget.dxDataGrid.option( widget.RemovePresetKeys(options.dxDataGridOptions) );
			    }
			} catch (e) {
				console.log(e);
			}
	    };

	    widget.Data = function () {
	    	return widget.data;
	    }

		widget.TextBoxInit = function (e) {
			widget.textBox = $(e.element);
			widget.dxTextBox = widget.textBox.dxTextBox('instance');
	    };

	    widget.PopoverInit = function (e) {
			widget.dxPopover = $(e.element).dxPopover('instance');
			widget.dxPopover.content().append(grid);
			$(grid).dxDataGrid(widget.GridConfig);
	    };

		widget.GridInit = function (e) {
			widget.dataGrid = $(e.element);
			widget.dxDataGrid = widget.dataGrid.dxDataGrid('instance');
		};

		widget.TextEnterKey = function (e) {
			widget.dxPopover.hide();
			if(widget.widgetOptions.onValueChanged) widget.widgetOptions.onValueChanged(widget.dxTextBox.option('text'), {});
		};

	    widget.TextValueChangeFunc = function (e) {
	        widget.textboxVal = widget.dxTextBox.option('text');
	        if(widget.widgetOptions.searchExpr) {
	        	widget.dxDataGrid.filter( [widget.widgetOptions.searchExpr, 'contains', widget.textboxVal + ''] );
	        } else {
		        //searchByText must take in string value, no other types allowed
		        widget.dxDataGrid.searchByText(widget.textboxVal + '');
		    }
	    };

	    widget.TextFocusInFunc = function (e) {
	    	widget.dxPopover.show(widget.textBox);
	    };

	    widget.TextFocusOutFunc =  function (e) {

	    };

	    widget.PopoverHide = function (e) {
	    	widget.dxDataGrid.clearFilter();
	    };

	    widget.GridRowClick = function (e) {
	    	if(!widget.widgetOptions.valueExpr) throw new Error('valueExpr option required for dxAutoCompleteGrid');
	    	widget.dxPopover.hide();
	    	widget.data = e.data;
	    	var value = widget.data[widget.widgetOptions.valueExpr];
	    	widget.dxTextBox.option('value', value);
	    	if(widget.widgetOptions.onValueChanged) widget.widgetOptions.onValueChanged(value, widget.data);
	    };

	    widget.GridContentReady = function (e) {
	    	var height;
	    	console.log(widget.dataGrid.height());
	    	if( ! ((height = widget.dataGrid.height()) === 0) ) {
	    		widget.dxPopover.option('height', height);
	    	}
	    };

	    widget.RemovePresetKeys = function (textOptions, popOptions, gridOptions) {
	    	if(textOptions) {
	    		if('onEnterKey' in textOptions) delete textOptions.onEnterKey;
	    		if('onFocusIn' in textOptions) delete textOptions.onFocusIn;
	    		if('onFocusOut' in textOptions) delete textOptions.onFocusOut;
	    		if('onInitialized' in textOptions) delete textOptions.onInitialized;
	    		if('onValueChanged' in textOptions) delete textOptions.onValueChanged;
	    		if('valueChangeEvent' in textOptions) delete textOptions.valueChangeEvent;
	    		return textOptions;
	    	}

	    	if(popOptions) {
	    		if('onHidden' in popOptions) delete popOptions.onHidden;
	    		if('onInitialized' in popOptions) delete popOptions.onInitialized;
	    		if('position' in popOptions) delete popOptions.position;
	    		return popOptions;
	    	}

	    	if(gridOptions) {
	    		if('columnAutoWidth' in gridOptions) delete gridOptions.columnAutoWidth;
	    		if('onInitialized' in gridOptions) delete gridOptions.onInitialized;
	    		if('onRowClick' in gridOptions) delete gridOptions.onRowClick;
	    		return gridOptions;
	    	}
	    }

		widget.widgetOptions = {};
		widget.dxTextBoxOptions = {};
		widget.dxPopoverOptions = {};
		widget.dxDataGridOptions = {};


		widget.widgetOptions.dataSource = null;
		widget.widgetOptions.valueExpr = null;
		widget.widgetOptions.searchExpr = null;
		widget.widgetOptions.onValueChanged = null;
		widget.textboxVal = null;
		widget.el = widget[0];

		if(options.widgetOptions) {
			Object.keys(options.widgetOptions).forEach(function (key) {
				widget.widgetOptions[key] = options.widgetOptions[key];
			});
		}

		if(options.dxTextBoxOptions) widget.dxTextBoxOptions = widget.RemovePresetKeys(options.dxTextBoxOptions, null, null);
		if(options.dxPopoverOptions) widget.dxPopoverOptions = widget.RemovePresetKeys(null, options.dxPopoverOptions, null);
		if(options.dxDataGridOptions) widget.dxDataGridOptions = widget.RemovePresetKeys(null, null, options.dxDataGridOptions);

	    widget.TextBoxConfig = {
	    	onEnterKey: widget.TextEnterKey,
	      	onFocusIn: widget.TextFocusInFunc,
	      	onFocusOut: widget.TextFocusOutFunc,
	    	onInitialized: widget.TextBoxInit,
	      	onValueChanged: widget.TextValueChangeFunc,
	       	valueChangeEvent: 'keyup'
	    };

	    widget.PopoverConfig = {
	    	minHeight: 100,
	    	onHidden: widget.PopoverHide,
	    	onInitialized: widget.PopoverInit,
	     	position: 'bottom',
	    };

	    widget.GridConfig = {
	    	columnAutoWidth: true,
	  		dataSource: widget.widgetOptions.dataSource,
	     	hoverStateEnabled: true,
	     	onContentReady: widget.GridContentReady,
	     	onInitialized: widget.GridInit,
	     	onRowClick: widget.GridRowClick,
	     	paging: {
	     		pageSize: 10
	     	}
	    };

	    //combine input widget options with preset options
	    $.extend(widget.TextBoxConfig, widget.dxTextBoxOptions);
	    $.extend(widget.PopoverConfig, widget.dxPopoverOptions);
	    $.extend(widget.GridConfig, widget.dxDataGridOptions);

	    //create divs to use for devexpress widgets
		var textBox = document.createElement('div');
		textBox.className = widget.BASECLASS + '-textbox';

		var popover = document.createElement('div');
		popover.className = widget.BASECLASS + '-popover';

		var grid = document.createElement('div');
		grid.className = widget.BASECLASS + '-grid';

		widget.el.appendChild(textBox);
		widget.el.appendChild(popover);

		//init devexpress widgets (grid init inside of popover after popover init)
		$(textBox).dxTextBox(widget.TextBoxConfig);
		$(popover).dxPopover(widget.PopoverConfig);

		return {
			options: widget.SetOptions,
			data: widget.Data
		};
	}
});
