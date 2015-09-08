/*	expecting filters in two array forms
	filter = [field, comparison, value]
	or [filter, 'and', filter, 'and', filter]
	where each 0/even index is a filter array of the first form above

	Returns an XML string of the form
		<Parameter>
			<Start field1="value"1 field2="value2"/>
			<End field1="value1" field2="value2"/>
			<Compare field1="comparisonFunction" field2="comparisonFunction"/>
		</Parameter>
*/
var dataGridFilter = {
	dateFormatString: null,
	dateFormatFunc: null,
	processFilterArray: function(filterArray) {
		var self = this,
			startParam 	= '<Parameter>',
			endParam 	= '</Parameter>';
		var data = { start:{}, end:{}, compare:{} },
			conjunction;

		if(!filterArray) {
			return null;
		}
		if(Array.isArray(filterArray[0])) {
			filterArray.forEach(function(el, index, array) {
				if(self.isEven(index)) {
					if(Array.isArray(el[0])) { 
						self.processArray(el, data, conjunction);
					} else {
						self.processFilter(el, data, conjunction);
					}
				} else {
					conjunction = el;
				}
			});
		} else {
	        self.processFilter(filterArray, data, null);
	    }

	    //return data;
		return 	startParam 
				+ '<Start ' + self.processObjtoXML(data.start) + '/>' 
				+ '<End ' + self.processObjtoXML(data.end) + '/>'
				+ '<Compare ' + self.processObjtoXML(data.compare) + '/>' + endParam;
	},

	/* process individual filter array of the form [field, comparison, value] */
	processFilter: function (filter, data, conj) {
		if(Object.prototype.toString.call(filter[2]) === '[object Date]' && this.dateFormatFunc && this.dateFormatString) {
			filter[2] = this.dateFormatFunc(filter[2], this.dateFormatString);
		}
		if(data.start[filter[0]]) {	//if there is already one filter, add a second with a conjunction operator
			data.end[filter[0]] = filter[2];
			data.compare[filter[0]] = data.compare[filter[0]].toString().concat(this.conjOperator(conj), this.getComparisonFunc(filter[1]));
		} else {
			data.start[filter[0]] = filter[2];
			data.end[filter[0]] = '';
			data.compare[filter[0]] = parseInt(this.getComparisonFunc(filter[1])); //first comparison function does not require leading 0
		}
	},

	processArray: function (arr, data, conj) {
		var self = this;
		arr.forEach(function(el, index, array) {
			if(self.isEven(index)) {
				self.processFilter(el, data, conj);
			} else {
				conj = el;
			}
		});
		return;
	},

	processObjtoXML: function (obj) {
		var result = '';
		for (var i in obj) {
			result += i + '="' + obj[i] + '" ';
		}
		return result;
	},

	/* used to check even index in array for index n */
	isEven: function (n) {
		return n == parseFloat(n) && (n % 2 == 0);
	},

	/* comparison function from dxDataGrid translated to web service function codes */
	getComparisonFunc: function (func) {
	    switch(func) {
	        case '=': 			return '01';
	        case '<>': 			return '09';
	        case '>': 			return '02';
	        case '>=': 			return '03';
	        case '<': 			return '07';
	        case '<=': 			return '08';
	        case 'startswith': 	return '10';
	        case 'contains': 	return '00';
	        default: 			return '00';
	    }
	},

	conjOperator: function (op) {
		var conjCode;
		switch(op) {
			case 'and': return '1';
			case 'or': return '2';
			default: return '0';
		}
	}
}