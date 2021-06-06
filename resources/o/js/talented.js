// image file resize 
var resizeImage = function (settings) {
    var file = settings.file;
    var maxSize = settings.maxSize;
    var reader = new FileReader();
    var image = new Image();
    var canvas = document.createElement('canvas');
    var dataURItoBlob = function (dataURI) {
        var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
            atob(dataURI.split(',')[1]) :
            unescape(dataURI.split(',')[1]);
        var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var max = bytes.length;
        var ia = new Uint8Array(max);
        for (var i = 0; i < max; i++)
            ia[i] = bytes.charCodeAt(i);
        //return new Blob([ia], { type: 'image/png'});
        return new Blob([ia], { type: mime});
    };
    
    var resize = function () {
        var width = image.width;
        var height = image.height;
        
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
            	// 세로로 긴 이미지 대응이 안되어 삭제
              //  width *= maxSize / height;
              //  height = maxSize;
            }
            if (width > maxSize) {
            	height *= maxSize / width;
                width = maxSize;
            }
        }
        canvas.width = width;
         canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        
	    var mime = image.src.split(',')[0].split(':')[1].split(';')[0];
        
        //var dataUrl = canvas.toDataURL('image/png');
	    var dataUrl = canvas.toDataURL(mime);
        return dataUrl;
    };
    
    return new Promise(function (ok, no) {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }
        reader.onload = function (readerEvent) {
            image.onload = function () { return ok(resize()); };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
    
};

// 이미지 업로드, afterFunction에 업로드 후 url 정보 처리
function uploadImageFile(imageJson, afterFunction) {
	var csrfName = $('#csrf_value').attr('name');
	var csrfValue = $('#csrf_value').attr('value');
	var url = '/member/uploadImage?' + csrfName + '=' + csrfValue;    	        	
	
	// 호출한 메소드명 확인 -> 포트폴리오 멀티미디어 데이터 업로드의 경우 예외처리
	var skipIsPossible = false;
	for (key in imageJson) {
		var methodName = imageJson[key].method;
		if (methodName != null && methodName == 'multimediaUpload') {
			skipIsPossible = true;
			break;
		}
	}
	
	var jsonParams = {};
	jsonParams['file'] = imageJson;
	jsonParams['_csrf'] = csrfValue;
  	
	$.ajax({
        url: url, 
        type: 'POST', 
        processData: false,  // Important!
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        data: JSON.stringify(jsonParams),
        beforeSend : function(xhr)
        {   
            xhr.setRequestHeader(csrfName, csrfValue); // 데이터를 전송하기 전에 헤더에 csrf값을 설정한다
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader("Cache-Control","no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma","no-cache"); 
        },
        success: function(data, textStatus, jqXHR)
        {
           if('upload complete' == data.result || skipIsPossible) {
        	   afterFunction(data);
     	   } else if ('no image file' == data.result) {
     		 $('#alertTextArea').html('이미지 파일을 등록해주세요.');$('#modal1').modal('show');
           } else {
        	  $('#alertTextArea').html('이미지가 업로드 되지 않았습니다. 다시 시도해주세요.');$('#modal1').modal('show');
     	   }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
        	//console.log("error : " + textStatus);
        }
      });
}

// 글자수 체크 . byte 단위
var getTextLength = function(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (escape(str.charAt(i)).length == 6) {
            len++;
        }
        len++;
    }
    return len;
}

//시스템 alert창 대체하는 레이어 메소드
function talAlert(text) {
	$('#alertTextArea').html(text);
	$('#modal1').modal('show');
}

//시스템 alert창 대체하는 레이어 메소드 . mvp버전  fadeOut됨
function divAlert(msg, type, dur, isHtml) {
	var alertDiv = $('#alertDiv');
		if (!isHtml) {
		    msg = escapeHtml(msg);
		    msg = msg.replace(/\n/g, '<br />');
		}
		//<div class="div_alert_title"><span class="t_logo">T</span><span class="t_title_text">탤런티드</span></div>
	//기본 색상 = red
	var elem = $('<div class="alertDiv ' + (type || 'red') + '" />').html(msg + '<div class="alertProgress ' + (type || 'red') + '" />').prependTo(alertDiv);
	var elem2 = $('<div class="div_alert_title"/>').html('<span class="t_logo">T</span><span class="t_title_text">탤런티드</span>').prependTo(alertDiv);
		elem.on('click', function () {
			$(this).remove();
			$(elem2).remove();
		});
	
	//노출 기본 값 = 3초 (3000)
	elem.slideDown(100, function () {
		$(this).find(".alertProgress").animate({
			'width': 0
		}, (dur || 3000), 'linear', function () {
			elem.slideUp(100, function () {
				$(this).remove();
				$(elem2).remove();
			});
	    });
	});
}

// html 태그 escaping
function escapeHtml(raw) {
	var regex = /[&<>"'` !@$%()=+{}[\]]/g;
	return raw.replace(regex, function onReplace(match) {
    return '&#' + match.charCodeAt(0) + ';';
  });
}


// SNS 공유하기
var snsModule = (function(){
    'use strict';
 
    var title   = $('meta[property="og:title"]').attr('content'), // 공유할 페이지 타이틀
    url         = $('meta[property="og:url"]').attr('content'),   // 공유할 페이지 URL
    tags        = "탤런티드",   // 공유할 태그
    imageUrl    = $('meta[property="og:image"]').attr('content'), // 공유할 이미지
    description = $('meta[property="og:description"]').attr('content'); // 공유할 설명
 
    var encodeTitle = encodeURIComponent(title),
    encodeUrl   = encodeURIComponent(url),
    encodeTags  = encodeURIComponent(tags),
    encodeImage = encodeURIComponent(imageUrl); // 공유할 이미지
 
    /*
    Kakao.init(' kakao api key '); // 카카오 인증 초기화
    */
 
    var snsModule = {
    	linkcopy:function() {
    		var linkAdd = document.createElement("textarea"); 
    		//document.body.appendChild(linkAdd);
    		document.getElementById('modal6').appendChild(linkAdd); // 모달창 에러 수정
    		linkAdd.value = window.document.location.href; 
    		linkAdd.select(); 
    		linkAdd.setSelectionRange(0, 9999); 
    		document.execCommand("copy"); 
    		//linkAdd.remove();
    		document.getElementById('modal6').removeChild(linkAdd);
    		$('#alertTextArea').html('링크가 클립보드에 저장되었습니다.');$('#modal1').modal('show');
    	},
        facebook:function(){
            window.open("http://www.facebook.com/share.php?u="+encodeUrl);
        },
        kakaotalk:function(){
            Kakao.Link.sendTalkLink({
                label: title+'\n'+url,
                image:{
                    src : imageUrl,
                    width : 200,
                    height : 200,
                },
            });
        },
        kakaostory:function(){
        	/*
            Kakao.Story.share({
                url: url,
                text: title,
            });
            */
        	window.open("https://story.kakao.com/s/share?url="+encodeUrl, "kakaostoryshare", "width=400, height=600, resizable=no");
        },
        band:function(){
            window.open("http://band.us/plugin/share?body="+encodeTitle+encodeURIComponent("\n")+encodeUrl+"&route="+encodeUrl, "band", "width=410, height=540, resizable=no");
        },
        twitter:function(){
        	window.open("http://www.twitter.com/intent/tweet?text="+encodeTitle+"&url="+encodeUrl+"&hashtags="+encodeTags, 'twitter', "width=500, height=450, resizable=no");
        },
        line : function(){
        	window.open("http://line.me/R/msg/text/?" + encodeURIComponent(title + "\r\n" + "출처 : 탤런티드\r\n") + encodeUrl);
        	//window.open("https://social-plugins.line.me/lineit/share?url=" + encodeUrl + "&title=" + encodeTitle);        	
        },
        naver:function(){
        	window.open("http://share.naver.com/web/shareView.nhn?url=" + encodeUrl + "&title=" +encodeTitle, "naver", "width=410, height=540, resizable=no");
        },
        pholar:function(){
            window.open("http://www.pholar.co/spi/rephol?title="+encodeTitle+"&url="+encodeUrl, "pholar", "width=410, height=540, resizable=no");
        },
        naverblog:function(){
            window.open("http://blog.naver.com/openapi/share?title="+encodeTitle+"&url="+encodeUrl, "naver blog", "width=410, height=540, resizable=no");
        },
        google:function(){
            window.open("https://plus.google.com/share?t="+encodeTitle+"&url="+encodeUrl, "google+", "width=500, height=550, resizable=no");
        },
        pinterest:function(){
            window.open("http://www.pinterest.com/pin/create/button/?url="+encodeUrl+"&media="+encodeImage+"&description="+encodeTitle, "pinterest", "width=800, height=550, resizable=no");
        },
        tumblr:function(){
        	window.open("http://www.tumblr.com/widgets/share/tool?posttype=photo&title="+encodeTitle+"&content="+encodeImage+"&canonicalUrl="+encodeUrl+"&tags="+encodeTags+"&caption="+encodeTitle+encodeURIComponent("\n")+encodeUrl,"tumblr", "width=540, height=600, resizable=no");
        },
        telegram : function(){
            window.open("https://telegram.me/share/url?url="+encodeUrl);
        }
    }; 
    return snsModule;
}());

function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}

function closeLayerWrap(event) {
	var clickClassName = event.target.className;
	if ('layer-wrap' == clickClassName) {
		$('#layer').fadeOut();
	}
}

function deleteSpecialWord(str) { // 필요없는 특수문자 제거
	var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
	return str.replace(regExp, "");
}

function changeHtmlEntity(text) {
	return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "&#39;").replace(/\//g, '&#47;').replace(/\\/g, '\\\\');
	//return text.replace(/[\"&'\/<>]/g, function (a) { return { '"': '&quot;', '&': '&amp;', "'": '&#39;', '/': '&#47;', '<': '&lt;', '>': '&gt;', '\\': '' }[a]; }); 
}

function changeHtmlEntityForTextArea(text) {
	return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "&#39;").replace(/\//g, '&#47;').replace(/\\/g, '\\\\').replace(/&lt;br&gt;/g, '<br>');
	//replace(/&/g, '&amp;'). 
}

function escapeHtmlEntity(text) {
	//return text.replace(/"/g, '&#34;').replace(/'/g, '&#39;'); 
	return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;'); 
}

function unEscapeHtmlEntity(text) {
	return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#47;/g, '/').replace(/\\\\/g, '\\');
}

// 단순 시간 스트링 (유니크값)
function _nowDateTimeString() {
	var now = new Date();
	return '' + (now.getMonth() + 1) + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds()
}

// 정렬용으로 사용하기 위해서 자릿수 맞춘버전
function _nowDateTimeStringForOrder() {
	var now = new Date();
	return '' + (now.getMonth() + 1) + ("0" + now.getDate()).slice(-2) + ("0" + now.getHours()).slice(-2) + ("0" + now.getMinutes()).slice(-2) + ("0" + now.getSeconds()).slice(-2)
}

function getTimeStamp(dateString, type) {
  var d = new Date(dateString);
  var s = '';
  if (type == 'minute') {
	  s =
		  leadingZeros(d.getFullYear(), 4) + '-' +
		  leadingZeros(d.getMonth() + 1, 2) + '-' +
		  leadingZeros(d.getDate(), 2) + ' ' +
		  
		  leadingZeros(d.getHours(), 2) + ':' +
		  leadingZeros(d.getMinutes(), 2); 
  } else if (type == 'second') {
	  s =
		  leadingZeros(d.getFullYear(), 4) + '-' +
		  leadingZeros(d.getMonth() + 1, 2) + '-' +
		  leadingZeros(d.getDate(), 2) + ' ' +
		  
		  leadingZeros(d.getHours(), 2) + ':' +
		  leadingZeros(d.getMinutes(), 2) 
		  + ':' +leadingZeros(d.getSeconds(), 2);
  } else if (type == 'day') {
	  s =
		  leadingZeros(d.getFullYear(), 4) + '-' +
		  leadingZeros(d.getMonth() + 1, 2) + '-' +
		  leadingZeros(d.getDate(), 2);
  }

  return s;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

function setCookie(name, value, exp) {
	var date = new Date();
    date.setTime(date.getTime() + exp*24*60*60*1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
}

function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value? value[2] : null;
}

//월별 날짜 계산
function calcSelectboxDateDay(type, dayString){
    var selectYear = $('[name=' + type +'_year] option:selected').val();
    var selectMonth = $('[name=' + type +'_month] option:selected').val();
    //var selectDay = $('[name=' + type +'_day] option:selected').val();
     
    maxDayArray = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

    if (selectMonth == '02') { 
        if ( (selectYear / 4) != parseInt(selectYear / 4) ) {
        	maxDayArray[1] = 28;
        } else { 
        	maxDayArray[1] = 29;
        } 
    } 
    
    var maxdays = maxDayArray[Number(selectMonth) - 1]; 

    $('[name=' + type + '_day]').html('');
    
    for(var i = 1;i <= maxdays;i++) { 
    	if(i < 10) {
            if(i == dayString) {
			    $('[name=' + type +'_day]').append('<option value="0' + i + '" selected>0' + i + '</option>');
            } else {
            	$('[name=' + type +'_day]').append('<option value="0' + i + '">0' + i + '</option>');
            } 
        }        
        else {
        	if(i == dayString) {
			    $('[name=' + type +'_day]').append('<option value="' + i + '" selected>' + i + '</option>');
            } else {
            	$('[name=' + type +'_day]').append('<option value="' + i + '">' + i + '</option>');
            }   
        }                     
   }
}

// 날짜 input 유효성체크 (input type="date" 호환 안되는 브라우저 대응)
function isValidDate(txtDate) {
    var currVal = txtDate;
    if (currVal == '') {
    	talAlert('년월일을 입력해주세요.');
    	return false;
    }
 
    var rxDatePattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;                  
    var dtArray = currVal.match(rxDatePattern);
    if (dtArray == null) {
    	talAlert('년월일을 2020-01-01 형태로 입력해주세요.');
    	return false;
    }
 
    dtYear = dtArray[1];
    dtMonth = dtArray[2];
    dtDay = dtArray[3];
  
    if (dtMonth < 1 || dtMonth > 12) {
    	talAlert('입력하신 날짜의 월을 확인해주세요.');
    	return false;
    } else if (dtDay < 1 || dtDay > 31) {
    	talAlert('입력하신 날짜의 일자를 확인해주세요.');
    	return false;
    } else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) {
    	talAlert('입력하신 날짜의 일자를 확인해주세요.');
    	return false;
    } else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap)) {
        	talAlert('입력하신 날짜의 일자를 확인해주세요.');
        	return false;
        }	
    }
    
    return true;
}