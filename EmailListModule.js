/* Dependencies: jQuery, Knockout, DevExpress dxList, SendEmailModule.js, Scripts.js, FindWTEmailHistory Web Service, JTMLibrary*/

function EmailListModule() {
	var emailList, userURI, actionCode, emailID, anyID,
		listDiv, emailDiv, sendModule, lastEmail, emailListLog, listBackBtn;

	EmailListModule.prototype.Init = function (listDivID, emailDivID) {
  		lastEmail = null;
  		listDiv = $(listDivID);
  		emailDiv = $(emailDivID); emailDiv.hide();

        AdminVM.EmailVM = new FindWTEmailHistoryViewModel();

		EmailDataStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                    searchData = EmailListModule.prototype.Load(loadOptions);

                FindWTEmailHistory($.mobile.OLRPMobile.URL, $.mobile.OLRPMobile.Admin.UserGUID, searchData)
                    .done(function (data) {
                        if (data.d.Error) {
                            viewEmailLog.text(data.d.ErrorMessage).addClass('errorMessage').removeClass('successMessage').fadeIn();
                            $.mobile.silentScroll(0);
                            d.reject();
                        } else {
                            AdminVM.EmailVM.SetData(data.d.DataResult);
                            d.resolve(data.d.DataResult, {totalCount: data.d.TotalCount});
                        }
                    }).always(function () {
                        $(window).trigger('resize');        //in case no emails come back, keep JQM full screen
                    }).fail(JTMLibrary.AjaxError);

                return d.promise();
            },
            totalCount: function (options) {
                return null;
            }
        });

		AdminVM.EmailData = EmailDataStore;
	}

	EmailListModule.prototype.BindingsApplied = function () {
        //elements below created only after using knockout template/bindings
        EmailListModule.prototype.ClearList();
		emailListLog = $('#ViewEmailLog'); emailListLog.hide();
		listBackBtn = $('.btnHeadBtn');
		emailList = $('#EmailList').dxList('instance');
		emailList.on('itemClick', function (obj) {
			EmailListModule.prototype.ShowEmail(obj);
		});

		sendModule = new SendEmailModule();
		sendModule.Init(EmailListModule.prototype.SendEmailReturn, EmailListModule.prototype.EmailBackBtn);
	}

	EmailListModule.prototype.SetList = function (user, action, emailId, anyId) {
		EmailListModule.prototype.ClearList();
		userURI = user;
		actionCode = action;
		emailID = emailId;
		anyID = anyId;
		emailList.reload();
	}

    EmailListModule.prototype.ClearList = function () {
        //AdminVM.EmailVM.Emails([]);
    }

	EmailListModule.prototype.EmailBackBtn = function () {
		emailDiv.hide();
		listBackBtn.show();
		listDiv.show();
        if (lastEmail) {
            $.mobile.silentScroll($(lastEmail).offset().top - 150);
        }
        lastEmail = null;
	}

	EmailListModule.prototype.SendEmailReturn = function (data) {
    	emailDiv.hide();
    	listBackBtn.show();
		listDiv.show();
		emailListLog.text(AdminStringResource.Message.SendEmailSuccess).removeClass('errorMessage').addClass('successMessage').fadeIn();
		$(document).one('click', function () { emailListLog.hide(); });
		emailList.reload();
	}

	EmailListModule.prototype.ShowEmail = function (itemObj) {
		AdminVM.EmailVM.SetEmail(itemObj.itemIndex);
		sendModule.SetCurEmail(AdminVM.EmailVM.GetEmail());
		lastEmail = itemObj.itemElement;
		listDiv.hide();
		listBackBtn.hide();
        $.mobile.silentScroll(0);
		emailDiv.show();
	}

	EmailListModule.prototype.Load = function (loadOptions) {
        var searchData = {};
        searchData.searchFor = '';
        searchData.recordNeeded = loadOptions.skip;
        searchData.count = loadOptions.take;

        searchData.userURI = userURI;
        searchData.actionCode = actionCode;
        searchData.emailID = emailID;
        searchData.anyID = anyID;

        if (loadOptions.sort) {
            searchData.sortAscending = !loadOptions.sort[0].desc;
            searchData.sortColumnName = loadOptions.sort[0].selector;
        }

        searchData.key = 0;

        return searchData;
    }
}

function emailTemplate(data, index, el) {
    $(el).addClass('emailDiv');
    $('<div class="emailTo"></div>').text(data.Email).appendTo(el);
    $('<div class="sentDateTime"></div>').text(dateFormat(dateFromStr(data.SentDate), 'm/d/yyyy h:MM:ss TT')).appendTo(el);
    $('<div class="emailType"></div>').text(data.EmailSubject).appendTo(el);
    return el;
}