/*
    Universal validation script for JQM apps

    Dependencies: jquery, jquery mobile, StingResource.js

    validate([]) - pass in array of jquery form elements
    set 'type' or 'isRequired' using jquery $.data before passing in
    if new 'type' needed, add to validateType object and set validation function
    validateRequired/ validateType check requirements, set error messages using $.data as needed
    valid object in validate() tracks validity of each element
    each element has error message removed (if any), then checked, then error message shown if any were set
    if all valid in valid object, validate() returns true and form can submit in page module

    removeErrorMessages() is called from page modules to clear all error fields for all elements

*/

var $pass1, $account1, $email1;     //future: encapsulate these in a validation closure

function validate(formElements) {
    var i, formValid, valid = {};
    for (i = 0, l = formElements.length; i < l; i++) {
        var $el = formElements[i];
        removeErrorMessage($el);
        var isValid = validateTypes($el) && validateRequired($el);
        if (!isValid) {
            showErrorMessage($el);
        }
        valid[$el.attr('id')] = isValid;
    }

    for (var f in valid) {
        if (!valid[f]) {
            formValid = false;
            break;
        }
        formValid = true;
    }

    if (formValid) {
        return true;
    } else {
        return false;
    }
}


//VALIDATION FUNCTIONS
function validateRequired(el) {
    if (isRequired(el)) {
        var valid = el.val();
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateFieldRequired);
        }
        return valid;
    }
    return true;
}

function validateTypes(el) {
    if (!el.val()) return true;
    var type = $.data(el, 'type') || el.attr('type');
    if (typeof validateType[type] === 'function') {
        return validateType[type](el);
    } else {
        return true;
    }
}

function isRequired(el) {
    var required = $.data(el, 'isRequired');
    return required;
}


//ERROR MESSAGE FUNCTIONS
function setErrorMessage(el, message) {
    $.data(el, 'errorMessage', message);
}

function showErrorMessage(el) {
    var $el = $(el);
    var errorSpace = $el.closest('.ui-field-contain').find('.error');
    if (!errorSpace.length) {
        errorSpace = $('<div class="error messageSize"></div>').appendTo($el.closest('.ui-field-contain'));
    }
    errorSpace.text($.data(el, 'errorMessage'));
    $el.closest('.ui-field-contain').css("padding-bottom", "15px");
}

function removeErrorMessage(el) {
    var errorSpace = $(el).closest('.ui-field-contain').find('.error'); // Get the sibling of this form control used to hold the error message
    errorSpace.remove();
    $(el).closest('.ui-field-contain').css("padding-bottom", "");
}

function removeErrorMessages(form) {
    form.forEach(removeErrorMessage);
}

//object holding validation functions for different form inputs
var validateType = {
    email: function (el) {
        var email = el.val();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid = re.test(email);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateEmail);
        }
        return valid;
    },

    email2: function (el) {
        var email = $email1.val();
        var email2 = el.val();
        var valid = email === email2;
        if (!valid) {
            setErrorMessage(el, AdminStringResource.Message.ValidateEmailMatch);
        }
        return valid;
    },

    password1: function (el) {  //not just password or any input type=password will be checked
        var pass = el.val();
        var valid = pass.length >= 8 && /^[a-zA-Z0-9]*$/.test(pass);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidatePassword1);
        }
        return valid;
    },

    password2: function (el) {
        var pass1 = $pass1.val();
        var pass2 = el.val();
        var valid = pass1 === pass2;
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidatePassword2);
        }
        return valid;
    },

    accountNo: function (el) {
        var accountNo = el.val();
        var valid = /^[0-9]{3}-[0-9]{3}$/.test(accountNo);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateBillingAccountNo);
        }
        return valid;
    },

    acctNum2: function (el) {
        var acctNum = $account1.val();
        var acctNum2 = el.val();
        var valid = acctNum === acctNum2;
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateBankAccountNo);
        }
        return valid;
    },

    ssn4: function (el) {
        var ssn = el.val();
        var valid = /^[0-9]{4}$/.test(ssn);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateSSN);
        }
        return valid;
    },

    phoneNo: function (el) {
        var phoneNo = el.val();
        var valid = /^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/.test(phoneNo);    //(XXX)XXX-XXXX
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidatePhoneNo);
        }
        return valid;
    },

    routingNo: function (el) {
        var routing = el.val();
        var valid = /^[0-9]{9}$/.test(routing);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateRoutingNo);
        }
        return valid;
    },

    zipCode: function (el) {
        var zip = el.val();
        var valid = /^[0-9]{5}$/.test(zip);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateZipCode);
        }
        return valid;
    },

    cvv: function (el) {
        var cvv = el.val();
        var valid = /^[0-9]{3,4}$/.test(cvv);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateCVV);
        }
        return valid;
    },

    creditCard: function (el) {
        var cardNo = el.val();
        var valid = /^[0-9]{13,19}$/.test(cardNo);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateCreditCard);
        }
        return valid;
    },

    money: function (el) {
        var value = el.val();
        var valid = /^[1-9][0-9]*\.?[0-9]{0,2}$/.test(value);
        return valid;
    },

    money2: function (el) {
        var value = el.val();
        var valid = /^[1-9][0-9]*\.?[0-9]{0,2}$/.test(value);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateMoney2);
        }
        return valid;
    },

    keyName: function (el) {
        var name = el.val();
        var valid = /^\w{1,10}$/.test(name);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ValidateKeyName);
        }
        return valid;
    },

    expirationDate: function (el) {
        var value = el.val();
        var valid = /^[0-9]{2}\/[0-9]{4}$/.test(value);
        if (!valid) {
            setErrorMessage(el, StringResource.Message.ExpirationDate);
        } else {
            /* validating a future expiration date */
            var expInput = el.val().split('/'),
                now = new Date(),
    		    thisYear = now.getFullYear(),
    		    thisMonth = now.getMonth() + 1,
    		    month = parseInt(expInput[0]),
    		    year = parseInt(expInput[1]);

            /* + 20 only validates exp dates 20 years in advance */
            if (year >= thisYear && year <= thisYear + 20 && month >= 1 && month <= 12) {
                if (year > thisYear) {
                    valid = true;
                } else if (month >= thisMonth) {
                    valid = true;
                } else {
                    valid = false;
                }
            } else {
                valid = false;
                setErrorMessage(el, StringResource.Message.ExpirationDateFuture);
            }
        }
        return valid;
    },

    maintainBuildingFees: function (el) {
        var value = el.val();
        var valid = /^[0-9]*\.?[0-9]{0,2}$/.test(value);
        if (!valid) {
            setErrorMessage(el, AdminStringResource.Message.FeeFormat);
        }
        return valid;
    },

    maintainBuildingPcts: function (el) {
        var value = el.val();
        var valid = /^(0|0\.|\.)[0-9]{0,4}$/.test(value);
        if (!valid) {
            setErrorMessage(el, AdminStringResource.Message.PctFormat);
        }
        return valid;
    },

    settingsDates: function (el) {
        var value = el.val();
        var valid = /^[01]?[0-9]\/[0-3]?[0-9]\/[12][90][0-9][0-9]$/.test(value);
        if (!valid) {
            setErrorMessage(el, AdminStringResource.Message.DateFormat);
        }
        return valid;
    }
};