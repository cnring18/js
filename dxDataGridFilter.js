/*	expecting filters in two array forms
	filter = [field, comparison, value]
	or [filter, 'and', filter, 'or', filter]
	where each 0/even index is a filter array of the first form above

	* when adding filters from scripts using grid.filter(filterArray) be sure to add 'and' as an array element to keep the form outlined above

	* the dateFormatString is specified for whatever the web service needs
	* the dateFormatFunc uses the format string to return a formatted string from a js Date (currently using date.format.js)
	* these must be specified in the code using this filter

	Returns an XML string of the form
		<Parameter>
			<Start field1="value"1 field2="value2" .../>
			<End field1="value1" field2="value2" .../>
			<Compare field1="comparisonFunction" field2="comparisonFunction" .../>
		</Parameter>
	where fields are JSON properties from the web service
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
					//some date arrays two levels deep
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
			//single filter in array form
	        self.processFilter(filterArray, data, null);
	    }

	    self.processCompare(data.compare);

	    //return filter xml string
		return 	startParam 
				+ '<Start ' + self.processObjtoXML(data.start) + '/>' 
				+ '<End ' + self.processObjtoXML(data.end) + '/>'
				+ '<Compare ' + self.processObjtoXML(data.compare) + '/>' + endParam;
	},

	/* process individual filter array of the form [field, comparison, value] */
	processFilter: function (filter, data, conj) {
		//date's have special filter logic for web service filter
		if(Object.prototype.toString.call(filter[2]) === '[object Date]') {
			if (this.dateFormatFunc && this.dateFormatString) filter[2] = this.dateFormatFunc(filter[2], this.dateFormatString);
			
			if(data.start[filter[0]]) {
				data.compare[filter[0]].conj = this.conjOperator(conj);
				data.end[filter[0]] = this.dateFormatFunc(filter[2], this.dateFormatString);
				return;
			} else {
				if (filter[1] === '<') {
					data.start[filter[0]] = this.dateFormatFunc(new Date(1753, 0, 1), this.dateFormatString);
					data.compare[filter[0]] = { op1: '3', op2: '07', conj:'1'};
					data.end[filter[0]] = this.dateFormatFunc(filter[2], this.dateFormatString);
					return;
				} else if (filter[1] === '>=' || filter[1] === '>') {
					data.start[filter[0]] = this.dateFormatFunc(filter[2], this.dateFormatString);
					data.compare[filter[0]] = { op1: '3', op2: '08', conj:'1'};
					data.end[filter[0]] = this.dateFormatFunc(new Date().setFullYear(9999), this.dateFormatString);
					return;
				}
			}
		}

		//boolean filters change to 1/0 value
		if(typeof filter[2] === 'boolean') {
			(filter[2]) ? filter[2] = 1 : filter[2] = 0;
		}

		if(data.start[filter[0]]) {	//if there is already one filter, add a second with a conjunction operator
			data.end[filter[0]] = filter[2];

			data.compare[filter[0]].conj = this.conjOperator(conj);
			data.compare[filter[0]].op2 = this.getComparisonFunc(filter[1]);
		} else {
			data.start[filter[0]] = filter[2];
			data.end[filter[0]] = '';

			data.compare[filter[0]] = { op1: '', op2: '', conj:''};
			data.compare[filter[0]].op1 = parseInt(this.getComparisonFunc(filter[1]));
			//number field filter requires this second comparison function and conjunction operator
			if(typeof filter[2] === 'number') {
				data.compare[filter[0]].conj = '0';
				data.compare[filter[0]].op2 = '00';
			}
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

	//combining compare functions with conjuction operators for each field (strings)
	processCompare: function (compObj) {
		for (var i in compObj) {
			compObj[i] = compObj[i].op1 + compObj[i].conj + compObj[i].op2;
		}
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
		return n === parseFloat(n) && (n % 2 === 0);
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

	/* conjunction operator from dxDataGrid translated to web service codes */
	conjOperator: function (op) {
		switch(op) {
			case 'and': return '1';
			case 'or': return '2';
			default: return '0';
		}
	}
}