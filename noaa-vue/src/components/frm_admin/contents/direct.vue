<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
	<jsp:include page="../../account/admin_common.jsp"></jsp:include>
<body>
	<p id="skipnav">
        <a href="">본문내용 바로가기</a>
    </p>
	<div class="wrap">
		<jsp:include page="../../account/admin_header.jsp"></jsp:include>
		<div class="main">
			<jsp:include page="../../account/admin_menu.jsp"></jsp:include>
			<main>
				<jsp:include page="../../account/admin_page_header.jsp"></jsp:include>
				<div id="scope_direct-coupon-">
					<keep-alive>
						  <router-view :key="$route.fullPath"></router-view>
					</keep-alive>
				</div>
			</main>
	    </div>
	</div>
   <script type="text/javascript" src="${pageContext.request.contextPath}/contents/noaa/js/model/vue/coupon_direct-controller.min.js"></script>
</body>
</html>