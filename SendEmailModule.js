/* 
	Dependencies: Validation.js, Knockout

	Send/View individual email module using email template with Knockout
	Can be used on its own with single email data, does not need EmailListModule

*/

function SendEmailModule() {
	var emailInputs, sendEmailLog, sendEmailBtn,
		sendCallback, backCallback,
		submitEmailValidate = false,
		curEmailData;

	SendEmailModule.prototype.Init = function (sendEmailCallback, backButtonCallback) {
		//Callbacks set by page module that email module created for (template binding)
		sendCallback = sendEmailCallback;
		backCallback = backButtonCallback;

		emailInputs = [$('#ToEmail'), $('#CCEmail')];
		sendEmailBtn = $('#SendEmailBtn');
		sendEmailLog = $('#SendEmailLog'); sendEmailLog.hide();
		submitEmailValidate =  false;

		$.data(emailInputs[0], 'type', 'email');
		$.data(emailInputs[0], 'isRequired', 'true');
		$.data(emailInputs[1], 'type', 'email');

		//focus/blur events for each element used for real time validation
		$.each(emailInputs, function () {
            var $el = this;
            $el.on('focus', function () {
                removeErrorMessage($el);
                sendEmailLog.hide();
            });
            $el.on('blur', function () {
                if (submitEmailValidate) {
                    if (!(validateTypes($el) && validateRequired($el))) showErrorMessage($el);
                } else {
                    if (!validateTypes($el)) showErrorMessage($el);
                }
            });
        });

        sendEmailBtn.on('click', function (e) {
        	e.preventDefault();
			e.target.blur();
			sendEmailLog.hide();
			SendEmailModule.prototype.Validate();
        });

        $('#EmailViewBackBtn').on('click', function (e) {
            e.preventDefault();
            e.target.blur();
            backCallback();
            sendEmailLog.hide();
            submitEmailValidate = false;
			emailInputs[1].val('');
			removeErrorMessages(emailInputs);
        })
	}

	//setting current email to be viewed with knockout bindings
	SendEmailModule.prototype.SetCurEmail = function (data) {
		curEmailData = data;
	}

	//validating inputs
	SendEmailModule.prototype.Validate = function () {
		submitEmailValidate = true;
		if (validate(emailInputs)) {
			submitEmailValidate = false;
			SendEmailModule.prototype.SendEmail();
		} else {
		}
	}

	// resending current open email
	SendEmailModule.prototype.SendEmail = function () {
		var emailData = {};
		emailData.userURI = curEmailData.UserURI;
		emailData.message = curEmailData.EmailMessage;
		emailData.email = emailInputs[0].val();
		emailData.subject = curEmailData.EmailSubject;
		emailData.actionCode = curEmailData.actionCode;
		emailData.ccEmail = emailInputs[1].val();

		SendAdminEmail($.mobile.OLRPMobile.URL, $.mobile.OLRPMobile.Admin.UserGUID, emailData)
			.done(SendEmailModule.prototype.SendEmailReturn)
			.fail(JTMLibrary.AjaxError);;
	}

	//send email web service return, returns to email list on success
	SendEmailModule.prototype.SendEmailReturn = function (data) {
		$.mobile.silentScroll(0);
        if (data.d.Fatal) {
            JTMLibrary.FatalError(data.d);
        } else if (data.d.Error) {
            sendEmailLog.text(data.d.ErrorMessage).addClass('errorMessage').removeClass('successMessage').fadeIn();
        } else {
            sendCallback(data);
        }
    }
}