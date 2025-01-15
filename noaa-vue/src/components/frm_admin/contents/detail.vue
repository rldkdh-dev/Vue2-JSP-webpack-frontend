<%--
#*
 *  파 일 명  : CPA0003.jsp
 *  설    명   : 쿠폰관리 - 상세
 *  작 성 자  : 김병찬
 *  작 성 일  : 2018.02.22
 *  버    전   : 1.0
 *  기타사항 :
 *  Copyrights 2011 by ㈜ 유비원. All right reserved.
*#
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/include/pageCommon.jsp" %>
<%@ page import="com.ubone.ubmeta.page.util.JspUtils"%>
<%@ page import="com.ubone.framework.data.DataList"%>
<%@ page import="com.ubone.framework.util.ViewUtil"%>
<%@ page import="com.ubone.framework.ConfigHolder"%>
<%@ page import="com.ubone.framework.ConstantHolder"%>
<%@ page import="com.ubone.framework.util.UserUtil"%>
<%@ include file="/WEB-INF/jsp/include/pageTagLibs.jsp"%>
<%@ page import="com.ubone.framework.data.Parameter"%>
<%@ page import="java.util.Map"%>
<%@ page import="org.apache.commons.lang.StringUtils"%>
<%@ page import="com.ubone.ubmeta.page.util.JspUtils"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core"   prefix="c" %>

<%
	DataList _dl_Coupon_getCouponDetail = ViewUtil.getResult().getDataList("CouponManage.getCouponDetail");
	
	String _dl_SEQ_CP_NUM 	= _dl_Coupon_getCouponDetail.getString(0, "SEQ_CP_NUM");		//쿠폰일련번호번호 	SEQ_CP_NUM
	String _dl_SO_CP_VAL 	= _dl_Coupon_getCouponDetail.getString(0, "SO_CP_VAL");			//쿠폰값 	SO_CP_VAL
	String _dl_NM_CP 		= _dl_Coupon_getCouponDetail.getString(0, "NM_CP");				//쿠폰명 	NM_CP
	String _dl_DS_CP_USE 	= _dl_Coupon_getCouponDetail.getString(0, "DS_CP_USE");			//쿠폰용도 	DS_CP_USE
	String _dl_DS_SOA 		= _dl_Coupon_getCouponDetail.getString(0, "DS_SOA");			//적용대상 	DS_SOA
	String _dl_DS_NOTE 		= _dl_Coupon_getCouponDetail.getString(0, "DS_NOTE");			//유의사항 	DS_NOTE
	String _dl_ID_USE 		= _dl_Coupon_getCouponDetail.getString(0, "ID_USE");			//사용처	ID_USE
	String _dl_ID_REG_USER 	= _dl_Coupon_getCouponDetail.getString(0, "NM_REG_USER");		//등록자 	ID_REG_USER
	String _dl_DT_REG 		= _dl_Coupon_getCouponDetail.getString(0, "DT_REG");			//등록일자 	DT_REG
	String _dl_ID_UPT_USER 	= _dl_Coupon_getCouponDetail.getString(0, "NM_UPT_USER");		//수정자  	ID_UPT_USER
	String _dl_DT_UPT 		= _dl_Coupon_getCouponDetail.getString(0, "DT_UPT");			//수정일자 	DT_UPT
	
	//SelectBox 
	DataList _dl_CD_CP_PYOT		= ViewUtil.getResult().getDataList("Code.CD_CP_PYOT"); 		//발행처
	DataList _dl_CD_WAY 		= ViewUtil.getResult().getDataList("Code.CD_WAY");			//발행방법
	DataList _dl_CD_DA_DVSN 	= ViewUtil.getResult().getDataList("Code.CD_DA_DVSN");		//권종
	DataList _dl_CD_CP_DVSN 	= ViewUtil.getResult().getDataList("Code.CD_CP_DVSN");		//쿠폰구분
	DataList _dl_CD_CP_STATUS 	= ViewUtil.getResult().getDataList("Code.CD_CP_STATUS");	//쿠폰상태	CD_CP_STATUS
%>
<!--  ========================================================================
  This page is generated with the UB-META™ ver4.0 
 
   - PAGE ID 	: CPA0003R00
   - PAGE TYPE 	: JSP
 
  Copyright ⓒ UBONE Co., Ltd. All rights reserved.
 ========================================================================
--> 

<!-- layout-1 Start -->
<h1 class="ub-control title">쿠폰 상세</h1>
<div class="ub-layout button top">
	<span class="ub-control button top icon" id="listBtn">
	    <a href="#none" title="목록">
	    	<span class="ico-list"></span>목록
	    </a>
	</span>
</div>

<div class="ub-layout detail">
    <span class="search-ltbg"></span>
    <span class="search-rtbg"></span>
    <span class="search-lbbg"></span>
    <span class="search-rbbg"></span>
<form id="updateForm" name="updateForm">
<table class="ub-control table normal ">
<colgroup>
	<col width="160px"/>
	<col width="380px"/>
	<col width="160px"/>
	<col />
</colgroup>
<tbody>

	<tr>
		<th>
			<label class="ub-control label" for="SO_CP_VAL">번호</label>
		</th>
		<td colspan="5">
			<input type="hidden" name="SEQ_CP_NUM" value="<%=_dl_SEQ_CP_NUM%>">
			<input type="text"  class="ub-control input-text " id="SEQ_CP_NUM" name="SEQ_CP_NUM"  value="<%=_dl_SEQ_CP_NUM%>"  metaessential="1" style="text-align:left;width:110px;" disabled="true">
		</td>
	</tr>

	<tr>
		<th>
			<label class="ub-control label" for=CD_CP_PYOT>발행처</label>
		</th>
		
		<td>
			<select id="CD_CP_PYOT" name="CD_CP_PYOT" class="ub-control select " style="width:120px;" size="1" metaessential="1">
			<%
				if(!"전체".equals("")){
					out.println("<OPTION VALUE=\"\">전체</OPTION>\r\n");    
				}
				  if(_dl_CD_CP_PYOT != null){
					for(int codeIdx=0; codeIdx < _dl_CD_CP_PYOT.getRowCount(); codeIdx++){
						String code = _dl_CD_CP_PYOT.getString(codeIdx, ConstantHolder.CODE_COLUMN_CODE);
						String name = _dl_CD_CP_PYOT.getString(codeIdx, ConstantHolder.CODE_COLUMN_NAME); 
						String selected = code.equals(JspUtils.getDefaultValue(_dl_Coupon_getCouponDetail, "CD_CP_PYOT"))?"selected":"";
						out.println("<option VALUE=\""+code+"\" "+selected+">"+name+"</option>\r\n");        
				  }
				}
			%>
			</select>
		</td>
		<th>
			<label class="ub-control label" for="CD_WAY">발행방법</label>
		</th>
		<td>
			<select id="CD_WAY" name="CD_WAY" class="ub-control select " style="width:120px;" size="1" datacid="CD_WAY" defaultvalue="${paramMap.CD_WAY}" metaessential="1">
			<%
				if(!"전체".equals("")){
					out.println("<OPTION VALUE=\"\">전체</OPTION>\r\n");    
				}
				  if(_dl_CD_WAY != null){
					for(int codeIdx=0; codeIdx < _dl_CD_WAY.getRowCount(); codeIdx++){
						String code = _dl_CD_WAY.getString(codeIdx, ConstantHolder.CODE_COLUMN_CODE);
						String name = _dl_CD_WAY.getString(codeIdx, ConstantHolder.CODE_COLUMN_NAME); 
						String selected = code.equals(JspUtils.getDefaultValue(_dl_Coupon_getCouponDetail, "CD_WAY"))?"selected":"";
						out.println("<option VALUE=\""+code+"\" "+selected+">"+name+"</option>\r\n");        
				  }
				}
			%>
			</select>
		</td>
	</tr>
	

	<tr>
		<th>
			<label class="ub-control label" for=CD_DA_DVSN>권종</label>
		</th>
		
		<td>
			<select id="CD_DA_DVSN" name="CD_DA_DVSN" class="ub-control select " style="width:120px;" size="1" datacid="CD_DA_DVSN" defaultvalue="${paramMap.CD_DA_DVSN}" metaessential="1">
			<%
				if(!"전체".equals("")){
					out.println("<OPTION VALUE=\"\">전체</OPTION>\r\n");    
				}
				  if(_dl_CD_DA_DVSN != null){
					for(int codeIdx=0; codeIdx < _dl_CD_DA_DVSN.getRowCount(); codeIdx++){
						String code = _dl_CD_DA_DVSN.getString(codeIdx, ConstantHolder.CODE_COLUMN_CODE);
						String name = _dl_CD_DA_DVSN.getString(codeIdx, ConstantHolder.CODE_COLUMN_NAME); 
						String selected = code.equals(JspUtils.getDefaultValue(_dl_Coupon_getCouponDetail, "CD_DA_DVSN"))?"selected":"";
						out.println("<option VALUE=\""+code+"\" "+selected+">"+name+"</option>\r\n");        
				  }
				}
			%>
			</select>
		</td>
		<th>
			<label class="ub-control label" for="CD_CP_DVSN">쿠폰구분</label>
		</th>
		<td>
			<select id="CD_CP_DVSN" name="CD_CP_DVSN" class="ub-control select " style="width:120px;" size="1" datacid="CD_CP_DVSN" defaultvalue="${paramMap.CD_CP_DVSN}" metaessential="1">
			<%
				if(!"전체".equals("")){
					out.println("<OPTION VALUE=\"\">전체</OPTION>\r\n");    
				}
				  if(_dl_CD_CP_DVSN != null){
					for(int codeIdx=0; codeIdx < _dl_CD_CP_DVSN.getRowCount(); codeIdx++){
						String code = _dl_CD_CP_DVSN.getString(codeIdx, ConstantHolder.CODE_COLUMN_CODE);
						String name = _dl_CD_CP_DVSN.getString(codeIdx, ConstantHolder.CODE_COLUMN_NAME); 
						String selected = code.equals(JspUtils.getDefaultValue(_dl_Coupon_getCouponDetail, "CD_CP_DVSN"))?"selected":"";
						out.println("<option VALUE=\""+code+"\" "+selected+">"+name+"</option>\r\n");        
				  }
				}
			%>
			</select>
		</td>
	</tr>
	
	
	<tr>
		<th>
			<label class="ub-control label" for="SO_CP_VAL">쿠폰값</label>
		</th>
		<td>
			<input type="text"  class="ub-control input-text " id="SO_CP_VAL" name="SO_CP_VAL"  value="<%=_dl_SO_CP_VAL%>"  metaessential="1" style="text-align:left;width:110px;">
		</td>
		
		<th>
			<label class="ub-control label" for="CD_CP_STATUS">쿠폰상태</label>
		</th>
		<td>
			<select id="CD_CP_STATUS" name="CD_CP_STATUS" class="ub-control select " style="width:120px;" size="1" datacid="CD_CP_STATUS" defaultvalue="${paramMap.CD_CP_STATUS}" metaessential="1">
			<%
				if(!"전체".equals("")){
					out.println("<OPTION VALUE=\"\">전체</OPTION>\r\n");    
				}
				  if(_dl_CD_CP_STATUS != null){
					for(int codeIdx=0; codeIdx < _dl_CD_CP_STATUS.getRowCount(); codeIdx++){
						String code = _dl_CD_CP_STATUS.getString(codeIdx, ConstantHolder.CODE_COLUMN_CODE);
						String name = _dl_CD_CP_STATUS.getString(codeIdx, ConstantHolder.CODE_COLUMN_NAME); 
						String selected = code.equals(JspUtils.getDefaultValue(_dl_Coupon_getCouponDetail, "CD_CP_STATUS"))?"selected":"";
						out.println("<option VALUE=\""+code+"\" "+selected+">"+name+"</option>\r\n");        
				  }
				}
			%>
			</select>
		</td>
		
	</tr>
	
	<tr>
		<th>
			<label class="ub-control label" for="NM_CP">쿠폰명</label>
		</th>
		<td>
			<input type=text  class="ub-control input-text " id="NM_CP" name="NM_CP"  value="<%=_dl_NM_CP%>" metaessential="1" style="text-align:left;width:650px;">
		</td>
	</tr>
	
	
	<tr>
		<th>
			<label class="ub-control label" for="DS_CP_USE">쿠폰용도</label></th>
		<td colspan="4">
			<textarea class="ub-control textarea " id="DS_CP_USE" name="DS_CP_USE" style="width:650px; height: 150px; " rows="25"  metaessential="1" rows="25"><%=_dl_DS_CP_USE%></textarea>
		</td>
	</tr>

	<tr>
		<th>
			<label class="ub-control label" for="DS_SOA">적용대상</label></th>
		<td colspan="4">
			<textarea class="ub-control textarea " id="DS_SOA" name="DS_SOA" style="width:650px; height: 150px; " rows="25"  metaessential="1" rows="25"><%=_dl_DS_SOA%></textarea>
		</td>
	</tr>
	
	<tr>
		<th>
			<label class="ub-control label" for="DS_NOTE">유의사항</label></th>
		<td colspan="4">
			<textarea class="ub-control textarea " id="DS_NOTE" name="DS_NOTE" style="width:650px; height: 150px; " rows="25"  metaessential="1" rows="25"><%=_dl_DS_NOTE%></textarea>
		</td>
	</tr>

	<tr>
		<th>
			<label class="ub-control label" for=ID_USE>사용처</label>
		</th>
		<td colspan="4">
			<input type=text  class="ub-control input-text " id="ID_USE" name="ID_USE"  value="<%=_dl_ID_USE%>" metaessential="1" style="text-align:left;width:650px;">
		</td>
	</tr>
	
	
	
	
	
	<tr>
		<th>
			<label class="ub-control label">등록자</label>
		</th>
		<td><%=_dl_ID_REG_USER%></td>
		<th>
			<label class="ub-control label">등록일자</label>
		</th>
		<td><%=_dl_DT_REG%></td>
	</tr>
	<tr>
		<th>
			<label class="ub-control label">수정자</label>
		</th>
		<td><%=_dl_ID_UPT_USER %></td>
		<th>
			<label class="ub-control label">수정일자</label>
		</th>
		<td><%=_dl_DT_UPT%></td>
		
	</tr>
	
	
		
</tbody>
</table>
</form>
</div>
<div class="ub-layout button bottom">
	<span class="ub-control button bottom icon" id="updateBtn">
    	<a href="#none" title="Update">
    		<span class="ico-save"></span>수정
		</a>
	</span>
	<span class="ub-control button bottom icon" id="deleteBtn">
    	<a href="#none" title="Delete">
    		<span class="ico-save"></span>삭제
		</a>
	</span>
</div>
<!-- layout-1 End -->

