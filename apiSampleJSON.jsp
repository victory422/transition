<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style>
/* 바탕 배경 이미지 */
.pop-address-search { background-image: url(http://www.0000.com/img/backImg.png);}
/* 회사 로고 이미지 */
.pop-address-search .pop-address-search-inner .logo { background: url(http://www.0000.com/img/logo.png) no-repeat; background-position:center; }

/* 바탕 배경색상 */
.pop-address-search { background-color:#ECECEC; }
/* 검색창 바탕 배경색상 */
.pop-address-search .pop-address-search-inner .search-wrap { background-color:#DCF3F4; }
/* 검색창 색상 */
.pop-address-search .pop-address-search-inner .wrap input { background-color:#FFFFFF; }
/* 검색버튼 색상 */
.pop-address-search .pop-address-search-inner .wrap { background-color:#FFFFFF; }
/* 본문 배경색(홀수) */
.pop-address-search .pop-address-search-inner .result table.data-col tbody tr:nth-child(odd) td {background:#FFFFFF}
/* 본문 배경색(짝수) */
.pop-address-search .pop-address-search-inner .result table.data-col tbody tr:nth-child(even) td {background:#FFFFFF}
						
input[type=text] {
    min-width: 234px;
    font-size: 13px;
    line-height: 2.714em;
    border: 1px solid #d9d9d9;
 }					

</style>

<link rel="stylesheet" href="/resources/base.css">
<link rel="stylesheet" href="/resources/common.css">

<script type="text/JavaScript" src="/resources/jquery-1.8.3.min.js" ></script>

<script language="javascript">
var g_roadAddr = "";
var g_dong = "";

function getAddr(){
	// 적용예 (api 호출 전에 검색어 체크) 	
	if (!checkSearchedWord(document.form.keyword)) {
		return ;
	}

	$.ajax({
		 url :"https://www.juso.go.kr/addrlink/addrLinkApiJsonp.do"  //인터넷망
		,type:"post"
		,data:$("#form").serialize()
		,dataType:"jsonp"
		,crossDomain:true
		,success:function(jsonStr){
			$("#list").html("");
			var errCode = jsonStr.results.common.errorCode;
			var errDesc = jsonStr.results.common.errorMessage;
			if(errCode != "0"){
				alert(errCode+"="+errDesc);
			}else{
				if(jsonStr != null){
					makeListJson(jsonStr);
				}
			}
		}
	    ,error: function(xhr,status, error){
	    	alert("에러발생");
	    }
	});
}


function fn_checkAdress(val) {
	var arr = document.querySelectorAll("#tableBody > tr > td > a");
	for( var i = 0 ; i<arr.length; i++) {
		arr[i].setAttribute("onclick", "javascript:fn_check('"+val+"')");
	}
	
}

function fn_check(id){
	console.log(id);
	
	
	alert(id+" 사시는군요 체크하는 로직을 좀 짜볼게요");
}



function makeListJson(jsonStr){
	var htmlStr = "";
	$(jsonStr.results.juso).each(function(){
		console.log($(jsonStr.results.juso));
		htmlStr += "<tr>";
		htmlStr += "<td>"+this.liNm+"</td>";
		htmlStr += "<td><a style='cursor:pointer'>"+this.roadAddr+"</td>";
		htmlStr += "<tr>";
		
		document.getElementById("tableBody").innerHTML += htmlStr;
		document.querySelector(".information_use_wrap").setAttribute("style","display:block");
		fn_checkAdress(this.emdNm);
	});
	
}

//특수문자, 특정문자열(sql예약어의 앞뒤공백포함) 제거
function checkSearchedWord(obj){
	if(obj.value.length >0){
		//특수문자 제거
		var expText = /[%=><]/ ;
		if(expText.test(obj.value) == true){
			alert("특수문자를 입력 할수 없습니다.") ;
			obj.value = obj.value.split(expText).join(""); 
			return false;
		}
		
		//특정문자열(sql예약어의 앞뒤공백포함) 제거
		var sqlArray = new Array(
			//sql 예약어
			"OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
             		 "UNION",  "FETCH", "DECLARE", "TRUNCATE" 
		);
		
		var regex;
		for(var i=0; i<sqlArray.length; i++){
			regex = new RegExp( sqlArray[i] ,"gi") ;
			
			if (regex.test(obj.value) ) {
			    alert("\"" + sqlArray[i]+"\"와(과) 같은 특정문자로 검색할 수 없습니다.");
				obj.value =obj.value.replace(regex, "");
				return false;
			}
		}
	}
	return true ;
}

function enterSearch() {
	var evt_code = (window.netscape) ? ev.which : event.keyCode;
	if (evt_code == 13) {    
		event.keyCode = 0;  
		getAddr(); 
	} 
}

</script>
<title>Insert title here</title>
</head>
<body>
<form name="form" id="form" method="post">
	<input type="hidden" name="currentPage" value="1"/> <!-- 요청 변수 설정 (현재 페이지. currentPage : n > 0) -->
	<input type="hidden" name="countPerPage" value="10"/><!-- 요청 변수 설정 (페이지당 출력 개수. countPerPage 범위 : 0 < n <= 100) -->
	<input type="hidden" name="resultType" value="json"/> <!-- 요청 변수 설정 (검색결과형식 설정, json) --> 
	<input type="hidden" name="confmKey" value="U01TX0FVVEgyMDIxMTEyNjE4MTM0NzExMTk1OTU="/><!-- 요청 변수 설정 (승인키) -->
	<input type="text" name="keyword" value="" onkeydown="enterSearch();"/><!-- 요청 변수 설정 (키워드) -->
	<input type="button" onClick="getAddr();" value="주소검색하기"/>
	<div id="list" ></div><!-- 검색 결과 리스트 출력 영역 -->
</form>

<div class="container" >
	<div class="contents" id="contents">
            <div class="content">
                <div class="body">
                    <div class="body_content_wrap">
                        <div class="information_use_wrap" style="display:none">
                             <table class="notice_table" summary="" >
                                <colgroup>
                                    <col width="10%">
                                    <col width="90%">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col">번호</th>
                                        <th scope="col">주소</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">
                                </tbody>
                            </table>
                            <a href="#none" class="btn_styleLine1">더보기 (<strong>1</strong>/<span>10</span>)</a>
                        </div>
                    </div>
                </div>
            </div>
		</div>
	</div>


                            
</body>
</html>


