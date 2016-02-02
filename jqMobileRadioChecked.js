/*
	Knockout binding for jQuery Mobile checkbox/radio buttons
	Automatically refreshes widgets with new values
*/

/* Dependencies: jquery, jquery mobile, knockout */
ko.bindingHandlers.jqMobileRadioChecked = {
	init: function (element, valueAccessor, allBindingsAccessor, data, context) {
		ko.bindingHandlers.checked.init(element, valueAccessor, allBindingsAccessor, data, context);
	},

	update: function (element, valueAccessor, allBindingsAccessor, data, context) {
		var $el = $(element);
		if($el.val() == ko.unwrap(valueAccessor)) {
			$el.prop('checked', true).checkboxradio('refresh');
		} else {
			$el.prop('checked', false).checkboxradio('refresh');
		}
	}
}