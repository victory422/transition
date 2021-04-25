<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<!DOCTYPE html>
<html>
<head>
<style>
.stopDiv {
	position: fixed;
	_position: absolute;
	left: 200px;
	top: 20px;
	width: 300px;
	height: 30px;
	background: #CCC;
	color : #000;
}

.bodyDiv {
	top : 200px;
	width: 100%;
	height: 5000px;
	background: #000;
	color : #FFF;
}


.moveDiv {
	position: absolute;
	left: 2%;
	width: 100px;
	height: 50px;
	background: #FFF;
	color : #FFF;
}


.move {
	transition-duration: 1s;
}


</style>
<link rel="stylesheet" href="/v/ipad-pro/ae/built/styles/main.built.css" type="text/css" />
<link rel="stylesheet" href="/v/ipad-pro/ae/built/styles/overview.built.css" type="text/css" />
<script text="javascript">

let screenHeight;
	window.onload = function() {
		screenHeight =screen.availHeight; 	
		console.log("���� ��ũ���� ũ�� : " + screenHeight);
	}
	
	window.addEventListener('scroll', () => {
		let scrollLocation = document.documentElement.scrollTop; // ���� ��ũ�ѹ� ��ġ (top)
		let windowHeight = window.innerHeight; // ��ũ�� â
		let fullHeight = document.body.scrollHeight; //  margin ���� ���� x
		let centerScrPosition = Math.round(scrollLocation + screenHeight/1) ; // 2�� ���� �� ���ͱ��� ��ũ�� ������
		
		console.log("�� ��ũ�� ������ : " + scrollLocation);
		
		document.querySelector(".stopDiv").innerHTML = "�� ��ũ�� ������ : " + scrollLocation;
		
		let moveDivs = document.querySelectorAll(".moveDiv");
		for(let i = 0 ; i < moveDivs.length; i++ ) {
			let _top = Math.round(moveDivs[i].getBoundingClientRect().top - screenHeight/2);
			console.log(_top);
			if ( _top < 0 ) { //ȭ�� ����� ���� ��
				moveDivs[i].style.setProperty("width", "90%");
				moveDivs[i].style.setProperty("color", "#000");
			
			}else {
				moveDivs[i].style.removeProperty("width");
				moveDivs[i].style.removeProperty("color");
			}
			
		
		}
		
	})

</script>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<div class="stopDiv"></div>
	<div class="bodyDiv">
		is home.
		
		
		<div class="moveDiv move" style="top:1500px;">top : 1500px</div>
		
		<div class="moveDiv move" style="top:2000px;">top : 2000px</div>
		
		<div class="moveDiv move" style="top:2500px;">top : 2500px</div>


	</div>
	

	



</body>
</html>