package com.optival.io.web;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.solr.common.SolrDocumentList;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.medplus.common.utility.UtilValidate;
import com.medplus.shutter.domain.Competitor;
import com.medplus.shutter.domain.CompetitorIncentives;
import com.medplus.shutter.domain.CompetitorInfo;
import com.medplus.shutter.domain.CompetitorSearchCriteria;
import com.medplus.shutter.domain.FieldAgent;
import com.medplus.shutter.domain.Shutter;
import com.medplus.shutter.domain.ShutterComments;
import com.medplus.shutter.domain.ShutterInfo;
import com.medplus.shutter.domain.ShutterSearchCriteria;
import com.medplus.shutter.exception.ShutterException;
import com.medplus.shutter.service.ShutterService;
import com.medplus.solr.core.impl.StoresCoreHelper;
import com.medplus.solr.core.pojo.EngineStores;
import com.medplus.solr.core.pojo.GoogleLocation;
import com.medplus.solr.core.service.GooglePlaceService;
import com.medplus.ums.exception.UserManagementException;
import com.medplus.ums.model.UserDetails;
import com.medplus.ums.service.UserService;
import com.medplus.ums.service.impl.LdapAuthenticationMangerImpl;
import com.optival.io.constants.CitiesData;
import com.optival.io.domain.DataTableObject;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Hyperlink;

import java.io.*;


@Controller
public class IntranetController {

	@Value("${com.medplus.standalone.workflowUrl}")
	private String workflowUrl;
	
	@Value("${com.medplus.standalone.loginUrl}")
	private String loginUrl;
	
	@Value("${com.medplus.standalone.username}")
	private String username;
	
	@Value("${com.medplus.standalone.password}")
	private String password;
	
	@Value("${com.medplus.standalone.isAdmin}")
	private Boolean isAdmin;
	
	@Value("${com.medplus.standalone.SMSUrl}")
	private String SMSUrl;
	
	@Value("${com.medplus.standalone.NotificationUrl}")
	private String NotificationUrl;
	
	@Value("${com.medplus.standalone.loginUrlExt}")
	private String loginUrlExt;
	
	@Value("${com.medplus.standalone.usernameExt}")
	private String usernameExt;
	
	@Value("${com.medplus.standalone.passwordExt}")
	private String passwordExt;
	
	@Value("${com.medplus.standalone.getStatesCities}")
	private String getStatesCities;
	
	Logger logger = LoggerFactory.getLogger(IntranetController.class);
	
	
	@Autowired
    ShutterService shutterService;
	
	@Autowired
	UserService userService;

	@Autowired
	GooglePlaceService googlePlaceService;	
	
	@Autowired
	LdapAuthenticationMangerImpl ldapAuthenticationMangerImpl;
		
	@RequestMapping(value = "/dashboard", method = RequestMethod.POST)
	public String dashboardDetails() {
		return "ccpDashboard";
	}
	
	@RequestMapping(value = "/loginCustomer", method = RequestMethod.POST)
	public String loginCustomer() {
		return "ccpDashboard";
	}
	
	@RequestMapping(value = "/dashboardOauth", method = RequestMethod.GET)
	public String dashboardDetailsOauth(HttpServletRequest request,HttpSession session) {
		String agentsystemip = "";
		if(request.getParameter("agentsystemip") !=null)
			agentsystemip = request.getParameter("agentsystemip");
		session.setAttribute("clientIpAddress", agentsystemip);
		return "ccpDashboard";
	}
	
	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	public String admindashboard(){
		return "admindashboard";
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String loginDetails(HttpServletRequest request){
		logger.info("Param: {}",request.getParameter("error"));
		return "ccpLogin";
	}
	
	
	@RequestMapping(value = "/authUser", method = RequestMethod.POST)
	public ModelAndView authUser(@RequestParam("j_username") String username,	@RequestParam("j_password") String password,HttpSession session) {
		ModelMap mav = new ModelMap();
		if (UtilValidate.isEmpty(username)) {
			mav.addAttribute("warning", "Invalid UserID");
			return new ModelAndView("ccpLogin","modal",mav);
		}
		//user type contains usertype and app version
		if (UtilValidate.isEmpty(password)) {
			mav.addAttribute("warning", "Invalid Password");
			return new ModelAndView("ccpLogin","modal",mav);
		}
		try {
			if (ldapAuthenticationMangerImpl.verifyPassword(username, password)) {
				
				UserDetails userDetails = userService.getUserDetails(username);
				session.setAttribute("userObj",userDetails);
				session.setAttribute("userId", username);
				
				return new ModelAndView("redirectToHome");				
			}else{
				mav.addAttribute("warning", "Bad credentials");
				return new ModelAndView("ccpLogin","modal",mav);
			}
		} catch (UserManagementException e) {
			logger.error("UserManagementException {} ", e.getMessage());
		} catch (Exception e) {
			logger.error("Exception", e);
		}
		mav.addAttribute("warning", "PLEASE TRY AFTER SOMETIME SERVER DOWN");
		return new ModelAndView("ccpLogin","modal",mav);
	}
	
	
	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public String homePage(HttpServletRequest request, HttpSession session,Model model){
		String userId = (String)session.getAttribute("userId");
		logger.info("The UserId of logged user is: {}", userId);
		UserDetails userDetails = null;
		userDetails = (UserDetails)session.getAttribute("userObj");
		session = request.getSession(true);
		
		if(UtilValidate.isEmpty(userId)){
			return "ccpLogin";
		}
		if(UtilValidate.isEmpty(userDetails)) {
			return "ccpLogin";
		}
		Set<String> roles = userService.getUserRoles(userId);
		if(UtilValidate.isNotEmpty(roles)) {
			userDetails.setRoles(roles);
//			session.setAttribute("userObj",userDetails);
		}
		session.setAttribute("userRoles",new Gson().toJson(roles));
		
		if(roles.contains("ROLE_CRM_LAB_VIEW") || roles.contains("ROLE_CRM_LAB_COLLECTION_CENTER_DASHBOARD")){
			System.out.println("No access");
		}
		return "home";
	}
	
	
	@RequestMapping(value = "/mylogout", method = RequestMethod.GET)
	public String logout(Model model,HttpServletRequest request,HttpSession session){
		if(session != null){
			session.removeAttribute("userId");
			session.removeAttribute("userObj");
			session.invalidate();
		}
		return "ccpLogin";
	}
	
	@RequestMapping(value = "/accessDenied", method = RequestMethod.GET)
	public String accessDenied(Model model,HttpServletRequest request,HttpSession session){
		return "accessDenied";
	}
	
	private List<HashMap<String, String>> getStatesDropdown(Set<String> statesCodesForUser) {
		HashMap<String, String> states = shutterService.getStates();
		
		List<HashMap<String, String>> statesDropdown = new ArrayList<>();
		List<String> statesCodes = new ArrayList<>();
		if(statesCodesForUser == null) {
			statesCodesForUser = states.keySet();						
		}
		for(String code: statesCodesForUser) {
			statesCodes.add(code);
		}
		for(String code: statesCodes) {
			HashMap<String, String> stateCodeNameMap = new HashMap<>();
			stateCodeNameMap.put(code, states.get(code));
			statesDropdown.add(stateCodeNameMap);
    	}
		
		return statesDropdown;
	}
	
	@RequestMapping(value = "/competitorDashboard", method = RequestMethod.GET)
	public ModelAndView competitorDashboard(HttpSession session){
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}
		
		ModelAndView mav = new ModelAndView("competitorDashboard");
		return mav;		
	}
	
	@RequestMapping(value = "/shutterDashboard", method = RequestMethod.GET)
	public ModelAndView shutterDashboard(HttpSession session){
		
		ModelMap model = new ModelMap();
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		
		String loggedInUserId = userDetails.getUserId();		
		HashMap<String, List<String>> statesCitiesMap = shutterService.getStatesOfLocalhead(loggedInUserId);
		if(statesCitiesMap.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}
	
		Gson gson = new Gson();
		model.addAttribute("statesCitiesMap", gson.toJson(shutterService.getCities("")));
		model.addAttribute("agentsMap", gson.toJson(shutterService.getAgents("", "", "")));
		
		ModelAndView mav = new ModelAndView("shutterDashboard", "model", model);
		return mav;
	}
	
	
	@RequestMapping(value = "/getShutterDetails",method = RequestMethod.GET)
	public @ResponseBody DataTableObject getShutterDetails(HttpServletRequest request, HttpSession session) {
		
		DataTableObject dataTableObject=new DataTableObject();
		UserDetails userDetails = null;
		userDetails = (UserDetails)session.getAttribute("userObj");
		HashMap<String, List<String>> statesCitiesMap = shutterService.getStatesOfLocalhead(userDetails.getUserId());
		Set<String> stateCodes = null;
		HashMap<String, String> states = shutterService.getStates();		
		if(statesCitiesMap.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			System.out.println("INVALID_USER");
			return dataTableObject;
		}
		List<String> statesList = new LinkedList<>();
		if(!statesCitiesMap.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			stateCodes = statesCitiesMap.keySet();
			for(String code: stateCodes) {
	    		statesList.add(states.get(code));
	    	}
		}
		
		String status=request.getParameter("status");
		String fromDate=request.getParameter("fromDate");
		String toDate=request.getParameter("toDate");
		String locality=request.getParameter("locality") == null ? "" : request.getParameter("locality");
		String shutterId=request.getParameter("shutterId");
		String iDisplayStart=request.getParameter("iDisplayStart");
		String iDisplayLength=request.getParameter("iDisplayLength");
		String sortType = request.getParameter("sSortDir_0");
		String city=request.getParameter("city");
		String agent = request.getParameter("agent");
		String[] orderHeaderCols = { "ShutterId","OwnerName","OwnerMobileNo", "Address","GeoAddress","UserId","DateCreated","Status","VerificationAgent"};
        int col= Integer.parseInt(request.getParameter("iSortCol_0"));
        
        if(!locality.isEmpty()) {
        	statesList.clear();
			statesList.add(states.get(locality));
		}
        
    	Set<String> statesSet = new HashSet<String>(statesList);
                
		if(UtilValidate.isNotEmpty(status) || (UtilValidate.isNotEmpty(fromDate) && UtilValidate.isNotEmpty(toDate)) || UtilValidate.isNotEmpty(locality) || UtilValidate.isNotEmpty(shutterId) ) {
			if(UtilValidate.isNotEmpty(fromDate) && !UtilValidate.isDate(fromDate, "yyyy-mm-dd HH:mm:ss"))
				return dataTableObject;
			if(UtilValidate.isNotEmpty(toDate) && !UtilValidate.isDate(toDate, "yyyy-mm-dd HH:mm:ss"))
				return dataTableObject;
			ShutterSearchCriteria	shutterSearchCriteria= new ShutterSearchCriteria();
				long startFrom = 0;
				long amount = 0;
				if(iDisplayStart != null)
					startFrom = Long.parseLong(iDisplayStart);
				if(iDisplayLength != null)
					amount = Long.parseLong(iDisplayLength);
				shutterSearchCriteria.setFromDate(fromDate);
				shutterSearchCriteria.setToDate(toDate);
				shutterSearchCriteria.setStatus(status);
				shutterSearchCriteria.setOrderBy(orderHeaderCols[col]);
				shutterSearchCriteria.setLimitFrom(startFrom);
				shutterSearchCriteria.setLimitTo(amount);
				shutterSearchCriteria.setSortType(sortType);
//				shutterSearchCriteria.setLocality(locality);
				shutterSearchCriteria.setState(statesSet);
				shutterSearchCriteria.setCity(city);
				shutterSearchCriteria.setFieldVerifiedBy(agent);
				if(UtilValidate.isNotEmpty(shutterId)) {
					shutterSearchCriteria.setShutterId(Long.parseLong(shutterId));
				}
				try{
					ShutterInfo shutterInfo = shutterService.getShutterInfo(shutterSearchCriteria);
					List<Shutter> shutterList= shutterInfo.getShutterInfoList();

					dataTableObject.setAaData(getShutterDataTableData(shutterList));
                	dataTableObject.setiTotalDisplayRecords(shutterInfo.getTolatRecords());
                	dataTableObject.setiTotalRecords(shutterInfo.getTolatRecords());
                	
                	HashMap<String, Long> statusCount = new HashMap<>();
					statusCount = shutterService.getShuttersCountByStatus(shutterSearchCriteria);
                	
                	dataTableObject.setStatusCount(statusCount);
                	dataTableObject.setListOfStates(getStatesDropdown(stateCodes));
				} catch(Exception e){
					logger.error(e.getMessage());
				}
			}
		return dataTableObject;
	}
	
	private List<List<Object>> getShutterDataTableData(List<Shutter> shuttersList){
		List<List<Object>> list = new ArrayList<>();
		try{
			if(UtilValidate.isNotEmpty(shuttersList)) {
			for(Shutter eachShutter : shuttersList){
				List<Object> eachRow = new ArrayList<>();
				String latlong = "";
				if(UtilValidate.isNotEmpty(eachShutter.getLatitude()) && UtilValidate.isNotEmpty(eachShutter.getLongitude())){
					latlong = "onclick=\"showShutterMap('"+eachShutter.getLatitude()+"','"+eachShutter.getLongitude() +"')\"><i class='icon-map-marker'></i>";
				}
				eachRow.add("<a data-toggle='modal' class='btn btn-success txtctr btn-mini' href='#shutterDetailsInfo'  rel='tooltip'  data-original-title='ShowDetails' onclick=\"showShutterDetailsModal('"+eachShutter.getShutterId()+"','"+eachShutter.getLocality()+"')\">"+eachShutter.getShutterId()+"</a>");
				eachRow.add(eachShutter.getOwnerName() !=null ? eachShutter.getOwnerName():"-");
				eachRow.add(eachShutter.getOwnerMobileNo() !=null ? eachShutter.getOwnerMobileNo():"-");
				eachRow.add((eachShutter.getAddress() !=null ? eachShutter.getAddress() : " " )+"&nbsp;<a data-toggle='modal' href='#shutterDetail' rel='tooltip' data-placement='top' data-original-title='ShowLocation' "+latlong +" </a>");
				eachRow.add((UtilValidate.isNotEmpty(eachShutter.getCity()) ? eachShutter.getCity() + " , " : "- ,") + eachShutter.getState());
				eachRow.add(eachShutter.getUserId() !=null ? eachShutter.getCreatorName() + "<br>(" + eachShutter.getUserId() + ")<br>" + eachShutter.getUserMobileNo() :"-");
				eachRow.add(eachShutter.getDateCreated() !=null ? eachShutter.getDateCreated().substring(0,19):"-");
				if(eachShutter.getStatus() !=null && eachShutter.getStatus().equalsIgnoreCase("I")) {
                  eachRow.add("<span id='status_"+eachShutter.getShutterId() +"'>Created</span>");
				}else if (eachShutter.getStatus().equalsIgnoreCase("F")) {
					eachRow.add("<span id='status_"+eachShutter.getShutterId() +"'>SentToField</span>");
				}else if (eachShutter.getStatus().equalsIgnoreCase("V")) {
	                  eachRow.add("<span id='status_"+eachShutter.getShutterId() +"'>FieldVerified</span><br><span>on "+ eachShutter.getDateModified() + "</span>");
				}else if (eachShutter.getStatus().equalsIgnoreCase("A")) {
	                  eachRow.add("<span id='status_"+eachShutter.getShutterId() +"'>ApprovedForSetup</span><br>AgreementDate: " + eachShutter.getAgreementDate());
				}else if (eachShutter.getStatus().equalsIgnoreCase("S")) {
	                  eachRow.add("<span id='status_"+eachShutter.getShutterId() +"'>SetupDone</span>");
				}else{
	                  eachRow.add("<span id='status_"+eachShutter.getShutterId() +"'>Rejected</span>");
				}
				eachRow.add(shutterService.getShutterComment(eachShutter.getShutterId(),""));
				eachRow.add(eachShutter.getFieldVerifiedBy() != null && !eachShutter.getFieldVerifiedBy().equals("-")
						? eachShutter.getFieldVerifiedByName() + "<br>(" + eachShutter.getFieldVerifiedBy() + ")<br>" + eachShutter.getFieldVerifiedByPhone() : "-");			
                eachRow.add("<a data-toggle='modal' href='#shutterImagesInfo' rel='tooltip' data-placement='top' onClick=showShutterImageModal('"+eachShutter.getShutterId()+"') data-original-title='ViewImages'><i class='icon-file'></i></a><br>"
                			+"<a data-toggle='modal' href='#editShutterDetails'  rel='tooltip'  data-original-title='Edit' onclick=\"editShutterDetailsModal('"+eachShutter.getShutterId()+"')\"><i class=\"icon-edit\"></i></a>");
			list.add(eachRow);
			}
		}
	} catch(Exception e){
		logger.error(e.getMessage());
	}
		return list;
	}
	
	public String getPincodeFromAddress(String address) {
		String zip = "";
		Pattern zipPattern = Pattern.compile("(\\d{6})");
		Matcher zipMatcher = zipPattern.matcher(address);
		if (zipMatcher.find()) {
		    zip = zipMatcher.group(1);
		}
		return zip;
	}
	
	@RequestMapping(value="/getShutterInfo",method = RequestMethod.GET)
	public @ResponseBody ModelMap getShutter(HttpServletRequest request,HttpSession session){
		ModelMap model = new ModelMap();
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		if(UtilValidate.isEmpty(userDetails)){
			return model;
		}
		HashMap<String, List<String>> statesCitiesMap = shutterService.getStatesOfLocalhead(userDetails.getUserId());
		if(statesCitiesMap.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}
		String shutterId = request.getParameter("shutterid");
		String isImageRequired =request.getParameter("isImageRequired");
		String locality=request.getParameter("locality");
		if(UtilValidate.isEmpty(shutterId) && !UtilValidate.isNumericId(shutterId)){
		    model.addAttribute("result", "INVALID_SHUTTER_ID");
			return model;
		}
		try {
			ShutterSearchCriteria shutterSearchCriteria= new ShutterSearchCriteria();
			shutterSearchCriteria.setShutterId(Long.valueOf(shutterId));
			if(isImageRequired.equalsIgnoreCase("Y")) {
			shutterSearchCriteria.setImageInfoRequired(true);
			}
			ShutterInfo shutterImagesInfo=shutterService.getShutterInfo(shutterSearchCriteria);
			
			List<ShutterComments> shutterComments=shutterService.getShutterComments(Long.valueOf(shutterId));
			model.addAttribute("shutterComments",shutterComments);
			if(UtilValidate.isEmpty(shutterImagesInfo)){
				model.addAttribute("result", "NO_IMAGE_FOUND");
				return model;
			}
			List<Shutter>  shutterImagesList=shutterImagesInfo.getShutterInfoList();
			if(UtilValidate.isEmpty(shutterImagesList)) {
				model.addAttribute("result", "NO_IMAGE_FOUND");
				return model;
			}
			List<Shutter> shutterHistory = shutterService.getShutterHistory(Long.valueOf(shutterId));
			model.addAttribute("shutterHistory",shutterHistory);

			if(UtilValidate.isNotEmpty(locality)){
				if(locality.length() > 2) {
					locality = CitiesData.getCityCode(locality);
				}
				
				HashMap<String, HashMap<String, List<FieldAgent>>> agentsData = shutterService.getAgents(locality, "", "");
				List<FieldAgent> fieldAgents = new LinkedList<>();
				HashMap<String, List<FieldAgent>> stateAgents = agentsData.get(locality);
				for(String cityName: stateAgents.keySet()) {
					fieldAgents.addAll(stateAgents.get(cityName));
				}
				if(UtilValidate.isNotEmpty(fieldAgents)){
					model.addAttribute("usersList",fieldAgents);
				}
			}
						
			model.addAttribute("shutter",shutterImagesList.get(0));
			model.addAttribute("listOfStates", getStatesDropdown(null));
			model.addAttribute("result", "SUCCESS");
			
		} catch (ShutterException e) { 
			logger.error("Shutter Error: ",e);
			model.addAttribute("result",e.getMessage());
			return model;
		} catch (Exception e) {
			logger.error("Error :",e);
			model.addAttribute("result", "PLEASE_TRY_AFTER_SOMETIME_SERVER_DOWN");
            return model; 			
		}
		return model;
	}

	@RequestMapping(value="/updateShutterStatus",method=RequestMethod.POST)
	public @ResponseBody String updateShutterStatus(HttpServletRequest request,HttpSession session){
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		if(UtilValidate.isEmpty(userDetails)){
			return "USER_NOT_LOGGEDIN";
		}
		
		HashMap<String, List<String>> statesCitiesMap = shutterService.getStatesOfLocalhead(userDetails.getUserId());
		if(statesCitiesMap.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			return "INVALID_USER";
		}
		
		String shutterId=request.getParameter("shutterid");
		String status=request.getParameter("status");
		String comment=request.getParameter("fieldComment");
		String address=request.getParameter("address");
		String ownerNo=request.getParameter("ownerNo");
		String ownerName=request.getParameter("ownerName");
		String shutterAgent=request.getParameter("shutterAgent");
		String agreementDate=request.getParameter("agreementDate");
		String storeId=request.getParameter("storeId");
		String userMobileNo=request.getParameter("userMobileNo");
		if(UtilValidate.isEmpty(session)){
			return "SESSION EXPIRED";
		}
		if(UtilValidate.isEmpty(shutterId) && !UtilValidate.isNumericId(shutterId)){
			return "INVALID_SHUTTER_ID";
		}
		if(UtilValidate.isEmpty(status)){
			return "STATUS_CANT_BE_EMPTY";
		}
		
		String [] shutterAgentInfo=null;
		if(UtilValidate.isNotEmpty(shutterAgent)) {
			shutterAgentInfo=shutterAgent.split(",");
		}
		try{
			Shutter shutter=new Shutter();
			shutter.setShutterId(Long.valueOf(shutterId));
			shutter.setStatus(status);
			shutter.setModifiedBy(userDetails.getUserId());
			if(UtilValidate.isNotEmpty(comment) && !comment.trim().equalsIgnoreCase("null")) {
			shutter.setComment(comment);	
			} else {
				return "PLEASE_PROVIDE_COMMENT";
			}
			String parameterString = "";
			if(UtilValidate.isNotEmpty(shutterAgentInfo) && status.equalsIgnoreCase("F")) {
				shutter.setFieldVerifiedBy(shutterAgentInfo[1]);
				if(UtilValidate.isEmpty(ownerName)) {
					ownerName="-";
				}
				parameterString = "Hi, ShutterId " + shutterId +" is assigned to you. Please visit the " + address +" and contact the owner:" + ownerName +" on:" + ownerNo;
			}
			if(status.equalsIgnoreCase("A")) {
				shutter.setAgreementDate(agreementDate);
				shutter.setStoreId(storeId);
			}

			int response=shutterService.updateShutterInfo(shutter);
			if(response > 0) {
				if(UtilValidate.isNotEmpty(shutterAgentInfo)) {					
					sendSMS(shutterAgentInfo[0], parameterString);
				}
				
				String userMessage = "";
				if (status.equalsIgnoreCase("F")) {
					userMessage = "ShutterId " + shutter.getShutterId() + " is Send to Field Verification.";
				} else if (status.equalsIgnoreCase("A")) {
					userMessage = "ShutterId " + shutter.getShutterId() + " is Approved for Setup.";
				} else if (status.equalsIgnoreCase("S")) {
					userMessage = "ShutterId " + shutter.getShutterId() + " Setup done.";
				} else if (status.equalsIgnoreCase("R")) {
					userMessage = "ShutterId " + shutter.getShutterId() + " is Rejected.";
				}
				
				sendSMS(userMobileNo, userMessage);

				
//				if (shutter.getStatus().equals("F")) {
//					triggerWorkflow(shutterId);
//				}
				
				return "SUCCESS";
			}else {
				return "FAILED_TO_UPDATE";
			}
		} catch(ShutterException e){
			 logger.error("Shutter Exception : ",e);
			return e.getMessage();
		} catch(Exception e){
			 logger.error("Error:",e);
			return "SHUTTER_UPDATION_FAILED";
		}
	}
	
	private String sendSMSCall(String accessToken, String phoneNumber, String message) {
		MultiValueMap<String, String> headersWorkflow = new LinkedMultiValueMap<String, String>();
		headersWorkflow.add("Authorization", "Bearer " + accessToken);
		headersWorkflow.add("Content-Type", "application/json");

		Gson gson = new Gson();

		JSONObject SMSDetails = new JSONObject();
		
		SMSDetails.put("phoneNumber", phoneNumber);
		SMSDetails.put("message", message);

		RestTemplate restTemplate = new RestTemplate();
		HttpEntity<String> entityWorkflow = new HttpEntity<String>(gson.toJson(SMSDetails), headersWorkflow);
		String result = restTemplate.postForObject(SMSUrl, entityWorkflow, String.class);
		
		return result;
	}
	
	
	public String sendSMS(String phoneNumber, String message) throws ShutterException {

		MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
		map.add("username", username);
		map.add("password", password);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		final HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(map, headers);
		JSONObject jsonObject = null;

		try {
			RestTemplate restTemplate = new RestTemplate();
			ResponseEntity<String> responseEntity = restTemplate.exchange(loginUrl, HttpMethod.POST, entity, String.class);

			if (responseEntity.getStatusCode() == HttpStatus.OK) {
				try {
					jsonObject = new JSONObject(responseEntity.getBody());
					String accessToken = jsonObject.getString("access");

					String answer = sendSMSCall(accessToken, phoneNumber, message);

					System.out.println(answer);

				} catch (JSONException e) {
					throw new RuntimeException("JSONException occurred");
				}
			}
		} catch (Exception e) {
			logger.error("Error :", e);
		}

		return "SUCCESS";
	}
	
	public String triggerWorkflow(String shutterId) throws ShutterException {

		String isImageRequired = "Y";

		ShutterSearchCriteria shutterSearchCriteria = new ShutterSearchCriteria();
		shutterSearchCriteria.setShutterId(Long.valueOf(shutterId));
		if (isImageRequired.equalsIgnoreCase("Y")) {
			shutterSearchCriteria.setImageInfoRequired(true);
		}
		ShutterInfo shutterImagesInfo = shutterService.getShutterInfo(shutterSearchCriteria);

		if (UtilValidate.isEmpty(shutterImagesInfo)) {
			return "NO_IMAGE_FOUND";
		}
		List<Shutter> shutterImagesList = shutterImagesInfo.getShutterInfoList();
		if (UtilValidate.isEmpty(shutterImagesList)) {
			return "NO_IMAGE_FOUND";
		}

		MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
		map.add("username", username);
		map.add("password", password);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		final HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(map,
				headers);
		JSONObject jsonObject = null;

		try {
			RestTemplate restTemplate = new RestTemplate();
			ResponseEntity<String> responseEntity = restTemplate.exchange(loginUrl, HttpMethod.POST, entity,
					String.class);

			if (responseEntity.getStatusCode() == HttpStatus.OK) {
				try {
					jsonObject = new JSONObject(responseEntity.getBody());
					String accessToken = jsonObject.getString("access");

					MultiValueMap<String, String> headersWorkflow = new LinkedMultiValueMap<String, String>();
					headersWorkflow.add("Authorization", "Bearer " + accessToken);
					headersWorkflow.add("Content-Type", "application/json");

					Gson gson = new Gson();

					JSONObject shutterDetails = new JSONObject(shutterImagesInfo.getShutterInfoList().get(0));

					HttpEntity<String> entityWorkflow = new HttpEntity<String>(gson.toJson(shutterDetails), headersWorkflow);
					String answer = restTemplate.postForObject(workflowUrl, entityWorkflow, String.class);

					System.out.println(answer);

				} catch (JSONException e) {
					throw new RuntimeException("JSONException occurred");
				}
			}
		} catch (Exception e) {
			logger.error("Error :", e);
		}

		return "SUCCESS";
	}

	@RequestMapping(value = "/getCompetitorDetails",method = RequestMethod.GET)
	public @ResponseBody DataTableObject getCompetitorDetails(HttpServletRequest request, HttpSession session) {
		DataTableObject dataTableObject=new DataTableObject();

		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			System.out.println("INVALID_USER");
			return dataTableObject;
		}
		
		String status=request.getParameter("status");
		String fromDate=request.getParameter("fromDate");
		String toDate=request.getParameter("toDate");
		String locality=request.getParameter("locality");
		String competitorId=request.getParameter("competitorId");
		String pincode=request.getParameter("pincode");
		String createdBy=request.getParameter("createdBy");
		String areaWise=request.getParameter("areaWise");
		String iDisplayStart=request.getParameter("iDisplayStart");
		String iDisplayLength=request.getParameter("iDisplayLength");
		String sortType = request.getParameter("sSortDir_0");
		String[] orderHeaderCols = { "CompetitorId", "OutletName", "Address", "UserId", "UserMobileNo", "DateCreated", "CompetitorStatus", "ModifiedBy"};
        int col= Integer.parseInt(request.getParameter("iSortCol_0"));
		if(UtilValidate.isNotEmpty(status) || (UtilValidate.isNotEmpty(fromDate) && UtilValidate.isNotEmpty(toDate)) || UtilValidate.isNotEmpty(locality) || UtilValidate.isNotEmpty(competitorId) ) {
			if(UtilValidate.isNotEmpty(fromDate) && !UtilValidate.isDate(fromDate, "yyyy-mm-dd HH:mm:ss"))
				return dataTableObject;
			if(UtilValidate.isNotEmpty(toDate) && !UtilValidate.isDate(toDate, "yyyy-mm-dd HH:mm:ss"))
				return dataTableObject;
			CompetitorSearchCriteria competitorSearchCriteria= new CompetitorSearchCriteria();
				long startFrom = 0;
				long amount = 0;
				if(iDisplayStart != null)
					startFrom = Long.parseLong(iDisplayStart);
				if(iDisplayLength != null)
					amount = Long.parseLong(iDisplayLength);	
				
				competitorSearchCriteria.setFromDate(fromDate);
				competitorSearchCriteria.setToDate(toDate);
				competitorSearchCriteria.setStatus(status);
				competitorSearchCriteria.setOrderBy(orderHeaderCols[col]);
				competitorSearchCriteria.setLimitFrom(startFrom);
				competitorSearchCriteria.setLimitTo(amount);
				competitorSearchCriteria.setSortType(sortType);
				competitorSearchCriteria.setLocality(locality);
				competitorSearchCriteria.setPincode(pincode);
				competitorSearchCriteria.setCreatedBy(createdBy);
				competitorSearchCriteria.setAreaWise(areaWise);
				if(UtilValidate.isNotEmpty(competitorId)) {
					competitorSearchCriteria.setCompetitorId(Long.parseLong(competitorId));
				}	
				try{
					CompetitorInfo competitorInfo = shutterService.getCompetitorInfo(competitorSearchCriteria);
					List<Competitor> competitorList= competitorInfo.getCompetitorInfoList();
                	dataTableObject.setAaData(getCompetitorDataTableData(competitorList, Integer.parseInt(iDisplayStart)));
                	dataTableObject.setiTotalDisplayRecords(competitorInfo.getTotalRecords());
                	dataTableObject.setiTotalRecords(competitorInfo.getTotalRecords());
                	dataTableObject.setListOfObjects(competitorList);

                	HashMap<String, Long> statusCount = new HashMap<>();
					statusCount = shutterService.getCompetitorsCountByStatus(competitorSearchCriteria);
                	
                	dataTableObject.setStatusCount(statusCount);
                	dataTableObject.setListOfStates(getStatesDropdown(null));
				} catch(Exception e){
					logger.error(e.getMessage());
				}
			}
		return dataTableObject;
	}
	
	private List<List<Object>> getCompetitorDataTableData(List<Competitor> competitorsList, Integer index){
		List<List<Object>> list = new ArrayList<>();
		try{
			if(UtilValidate.isNotEmpty(competitorsList)) {
			for(Competitor eachCompetitor : competitorsList){
				List<Object> eachRow = new ArrayList<>();
				String latlong = "";
				if(UtilValidate.isNotEmpty(eachCompetitor.getLatitude()) && UtilValidate.isNotEmpty(eachCompetitor.getLongitude())){
					latlong = "onclick=\"showCompetitorMap('"+eachCompetitor.getLatitude()+"','"+eachCompetitor.getLongitude() +"')\"><i class='icon-map-marker'></i>";
				}
//				eachRow.add("<a data-toggle='modal' class='btn btn-success txtctr btn-mini' href='#competitorDetailsInfo'  rel='tooltip'  data-original-title='ShowDetails' onclick=\"showCompetitorDetailsModal('"+eachCompetitor.getCompetitorId()+"','"+eachCompetitor.getLocality()+"')\">"+eachCompetitor.getCompetitorId()+"</a>");
				eachRow.add(index + list.size() + 1);
				eachRow.add(eachCompetitor.getOutletName() !=null ? eachCompetitor.getOutletName():"-");
				eachRow.add((eachCompetitor.getAddress() !=null ? eachCompetitor.getAddress() : " " )+"&nbsp;<a data-toggle='modal' href='#competitorDetail' rel='tooltip' data-placement='top' data-original-title='ShowLocation' "+latlong +" </a>");
				
				String capturedBy = null;
				if(eachCompetitor.getCreatorName() != null) {
					capturedBy = eachCompetitor.getCreatorName() + "<br>(" + eachCompetitor.getUserId() + ")";
				} else {
					capturedBy = eachCompetitor.getUserId() !=null ? eachCompetitor.getUserId() : "-";
				}
				
				eachRow.add(capturedBy);
				eachRow.add(eachCompetitor.getUserMobileNo() != null ? eachCompetitor.getUserMobileNo() : "-");
				eachRow.add(eachCompetitor.getDateCreated() !=null ? eachCompetitor.getDateCreated().substring(0,19):"-");
				
				String comment = "";
				if(eachCompetitor.getComment() != null) {
					comment = "<br>" + eachCompetitor.getComment();
				}
				
				if(eachCompetitor.getStatus() !=null && eachCompetitor.getStatus().equalsIgnoreCase("I")) {
                  eachRow.add("<span id='status_"+eachCompetitor.getCompetitorId() +"'>Created</span>");
				}else if (eachCompetitor.getStatus().equalsIgnoreCase("S")) {
	                  eachRow.add("<span id='status_"+eachCompetitor.getCompetitorId() +"'>Approved</span>");
				}else{
	                  eachRow.add("<span id='status_"+eachCompetitor.getCompetitorId() +"'>Rejected"+ comment +"</span>");
				}
				
				String modifiedBy = null;
				if(eachCompetitor.getModifiedByName() != null) {
					String modifiedByPhone = eachCompetitor.getModifiedByPhone() != null ? eachCompetitor.getModifiedByPhone() : "-"; 
					modifiedBy = eachCompetitor.getModifiedByName() + "<br>(" + eachCompetitor.getModifiedBy() + ")<br>" + modifiedByPhone;
				} else {
					modifiedBy = eachCompetitor.getModifiedBy() != null ? eachCompetitor.getModifiedBy() : "-";
				}
				
				eachRow.add(modifiedBy);
				
				String viewImage = "";
                if(!eachCompetitor.getCreatedBy().equals("Upload From Excel")) {
                	viewImage = "<a data-toggle='modal' href='#competitorImagesInfo' rel='tooltip' data-placement='top' onClick=\"showCompetitorImageModal('"+eachCompetitor.getCompetitorId()+"','"+eachCompetitor.getLocality()+"')\" data-original-title='ViewImages'><i class='icon-file'></i></a>";
                }
                eachRow.add(viewImage);
//				eachRow.add(viewImage + "<br><a data-toggle='modal' href='#competitorDetailsInfo'  rel='tooltip'  data-original-title='ChangeStatus/ShowDetails' onclick=\"showCompetitorDetailsModal('"+eachCompetitor.getCompetitorId()+"','"+eachCompetitor.getLocality()+"')\"><i class='icon-tags'></i></a>");
			list.add(eachRow);
			}
		}
	} catch(Exception e){
		logger.error(e.getMessage());
	}
		return list;
	}
	
	@RequestMapping(value="/getCompetitorInfo",method = RequestMethod.GET)
	public @ResponseBody ModelMap getCompetitor(HttpServletRequest request,HttpSession session){
		ModelMap model = new ModelMap();
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		if(UtilValidate.isEmpty(userDetails)){
			return model;
		}
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}
		String competitorId = request.getParameter("competitorId");
		String isImageRequired =request.getParameter("isImageRequired");
		String locality=request.getParameter("locality");
		if(UtilValidate.isEmpty(competitorId) && !UtilValidate.isNumericId(competitorId)){
		    model.addAttribute("result", "INVALID_COMPETITOR_ID");
			return model;
		}
		try {
			CompetitorSearchCriteria competitorSearchCriteria= new CompetitorSearchCriteria();
			competitorSearchCriteria.setCompetitorId(Long.valueOf(competitorId));
			if(isImageRequired.equalsIgnoreCase("Y")) {
				competitorSearchCriteria.setImageInfoRequired(true);
			}
			CompetitorInfo competitorImagesInfo=shutterService.getCompetitorInfo(competitorSearchCriteria);
			
			if(UtilValidate.isEmpty(competitorImagesInfo)){
				model.addAttribute("result", "NO_IMAGE_FOUND");
				return model;
			}
			List<Competitor> competitorImagesList=competitorImagesInfo.getCompetitorInfoList();
			if(UtilValidate.isEmpty(competitorImagesList)) {
				model.addAttribute("result", "NO_IMAGE_FOUND");
				return model;
			}
			List<Competitor> competitorHistory = shutterService.getCompetitorHistory(Long.valueOf(competitorId));
			model.addAttribute("competitorHistory",competitorHistory);
			
			model.addAttribute("competitor",competitorImagesList.get(0));
			model.addAttribute("result", "SUCCESS");
			
		} catch (ShutterException e) {
			logger.error("Competitor Error: ",e);
			model.addAttribute("result",e.getMessage());
			return model;
		} catch (Exception e) {
			logger.error("Error :",e);
			model.addAttribute("result", "PLEASE_TRY_AFTER_SOMETIME_SERVER_DOWN");
            return model; 			
		}
		return model;
	}
	
	public List<Competitor> checkDuplicates(CompetitorInfo competitorInfoList, String outletName) {
		List<Competitor> competitor = new ArrayList<Competitor>();
		if(competitorInfoList.getTotalRecords() > 0){
			List<Competitor> competitorList = competitorInfoList.getCompetitorInfoList();
			for(int competitorData = 0; competitorData < competitorList.size(); competitorData++) {
				outletName = nameExtractor(outletName);
				if(outletName.toLowerCase().contains(nameExtractor(competitorList.get(competitorData).getOutletName()).toLowerCase()) || nameExtractor(competitorList.get(competitorData).getOutletName()).toLowerCase().contains(outletName.toLowerCase())) {
					competitor.add(competitorList.get(competitorData));
				}
			}
		}
		return competitor;
	}
	
	public String nameExtractor(String name) {
		List<String> STORENAMES = Arrays.asList("Pharmacy", "Medicals", "Medical", "Store", "Stores", "Hall", "Druggists", "Chemists", "General", "Surgicals", "Surgical", "clinic", "clinics", "Agency", "Agencies", "Pharma", "Drug");

		for(int index = 0 ; index < STORENAMES.size() ; index++) {
			if(name.toLowerCase().contains(STORENAMES.get(index).toLowerCase())){
				name.replace("(?i)"+STORENAMES.get(index), "");
			}
		}
		return name;
	}
	
	@RequestMapping(value="/updateCompetitorStatus",method=RequestMethod.POST)
	public @ResponseBody ModelMap updateCompetitorStatus(HttpServletRequest request,HttpSession session){
		ModelMap model = new ModelMap();
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		String competitorId = request.getParameter("competitorId");
		String status = request.getParameter("status");
		Boolean verifyDuplicate = Boolean.valueOf(request.getParameter("checkDuplicate"));
		String compComment = request.getParameter("compComment");
		
		if(UtilValidate.isEmpty(userDetails)){
			model.addAttribute("result", "USER_NOT_LOGGEDIN");
			return model;
		}
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}		
		if(UtilValidate.isEmpty(session)){
			model.addAttribute("result", "SESSION EXPIRED");
			return model;
		}
		if(UtilValidate.isEmpty(competitorId) && !UtilValidate.isNumericId(competitorId)){
			model.addAttribute("result", "INVALID_COMPETITOR_ID");
			return model;
		}
		if(UtilValidate.isEmpty(status)){
			model.addAttribute("result", "STATUS_CANT_BE_EMPTY");
			return model;
		}
		
		try{
			
			if(status.equals("S")) {
				if(verifyDuplicate) {
					
					CompetitorSearchCriteria csc = new CompetitorSearchCriteria();
					csc.setCompetitorId(Long.valueOf(competitorId));
					CompetitorInfo competitorInfo = shutterService.getDuplicateCompetitorRecords(csc);
					Competitor competitor = competitorInfo.getCompetitorInfoList().get(0);
					
					csc.setCompetitorId(null);
					Double lat = Double.parseDouble(competitor.getLatitude());
					Double lng = Double.parseDouble(competitor.getLongitude());
					
					csc.setLatitude(Double.toString((int)(Math.pow(10, 5) *  lat)/Math.pow(10, 5)));
					csc.setLongitude(Double.toString((int)(Math.pow(10, 5) *  lng)/Math.pow(10, 5)));
					csc.setRadiusFlag(true);
					csc.setRadius("3");
					competitorInfo = shutterService.getDuplicateCompetitorRecords(csc);
					List<Competitor> duplicate = checkDuplicates(competitorInfo,competitor.getOutletName());
					if(duplicate.size() > 0) {
						model.addAttribute("result", "DUPLICATES_FOUND");
						model.addAttribute("data", duplicate);
						return model;
					}	
				}
			}
			
			Competitor competitor =  new Competitor();
			competitor.setCompetitorId(Long.valueOf(competitorId));
			competitor.setStatus(status);
			competitor.setModifiedBy(userDetails.getUserId());
			competitor.setComment(compComment);

			int resp=shutterService.updateCompetitorInfo(competitor);
			if(resp > 0) { 
				model.addAttribute("result", "SUCCESS");
				return model;
			}else {
				model.addAttribute("result", "FAILED_TO_UPDATE");
				return model;
			}
		} catch(ShutterException e){
			logger.error("Competitor Exception : ",e);
			model.addAttribute("error", e.getMessage());
			return model;
		} catch(Exception e){
			logger.error("Error:",e);
			model.addAttribute("error", "COMPETITOR_UPDATION_FAILED");
			return model;
		}
	}
	
	@RequestMapping(value = "/medplusCompetitorDashboard", method = RequestMethod.GET)
	public ModelAndView medplusCompetitorDashboard(HttpSession session){
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}
		
		ModelMap model = new ModelMap();
		Gson gson = new Gson();
		
		HashMap<String, List<String>> solrData = shutterService.getSolrData();		
		model.addAttribute("statesCitiesData", gson.toJson(solrData));
		model.addAttribute("listOfStates", gson.toJson(getStatesDropdown(null)));
		
		ModelAndView mav = new ModelAndView("medplusCompetitorDashboard", "model", model);
		return mav;
	}
	
	@RequestMapping(value="/getStoresByLocality", method=RequestMethod.GET)
	public @ResponseBody DataTableObject getStoresByLocality(HttpServletRequest request, HttpSession session){

		DataTableObject dataTableObject=new DataTableObject();
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			return dataTableObject;
		}
		
		List<HashMap<String, String>> list = new ArrayList<>();
		
		String city = (request.getParameter("city").isEmpty()) ? "HYDERABAD" : (String) request.getParameter("city");
		city = city.replaceAll("\\s+","");
		
		try {
			String searchQuery = "exactCity:" + city + " AND status_s:A";
			
			List<EngineStores> storeDetailsList = StoresCoreHelper.getStoreDetails(searchQuery, null, null);
			
			for (EngineStores eachstore : storeDetailsList) {
		
				String latitude = eachstore.getLocationLatLong().split(",")[0];
				String longitude = eachstore.getLocationLatLong().split(",")[1];
				
				if(!latitude.equals("0.00000000") || !longitude.equals("0.00000000")) {
					HashMap<String, String> data = new HashMap<String, String>();
					
					data.put("storeId", eachstore.getStoreId());
					data.put("name", eachstore.getStoreName());
					data.put("city", eachstore.getCity());
					data.put("pincode", eachstore.getPincode());
					data.put("address", eachstore.getAddress());
					data.put("latitude", latitude);
					data.put("longitude", longitude);
					list.add(data);
				}
			}
			
			dataTableObject.setAaData(getStoresDataTableData(list));
			dataTableObject.setiTotalDisplayRecords(list.size());
        	dataTableObject.setiTotalRecords(list.size());
			dataTableObject.setListOfStores(list);
	
		} catch(Exception e){
			logger.error(e.getMessage());
		}
		
		return dataTableObject;

	}

	private List<List<Object>> getStoresDataTableData(List<HashMap<String, String>> storeDetailsList){
		List<List<Object>> list = new ArrayList<>();
		try{
			if(UtilValidate.isNotEmpty(storeDetailsList)) {
			for(HashMap<String, String> eachStore : storeDetailsList){
				List<Object> eachRow = new ArrayList<>();
				eachRow.add(list.size() + 1);
				eachRow.add(eachStore.get("storeId"));
				eachRow.add(eachStore.get("name"));
				eachRow.add(eachStore.get("city"));
				eachRow.add(eachStore.get("pincode"));
				eachRow.add(eachStore.get("address"));
				
				eachRow.add("<button type='button' class='btn btn-primary view-comp-btn' onclick=\"getCompetitors('"+eachStore.get("storeId")+"') \">View Competitors</a><br>"
						+ "<button type='button' class='btn btn-danger refresh-comp-btn' onclick=\"refreshMapping('" + eachStore.get("latitude") + "," + eachStore.get("longitude") + "')\" title='Refresh Competitors to Medplus Store Mapping'>Refresh Mapping</button>");
				
			list.add(eachRow);
			}
		}
	} catch(Exception e){
		logger.error(e.getMessage());
	}
		return list;
	}
	
	@RequestMapping(value="/getNearbyCompetitors", method=RequestMethod.GET)
	public @ResponseBody ModelMap getNearbyCompetitors(HttpServletRequest request, HttpSession session) {
		ModelMap model = new ModelMap();
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}
		
		String storeId = request.getParameter("storeId");
		
		try {
			Map<String,Map<String,String>> solrDocumentList = StoresCoreHelper.getStoreDetailInfo(storeId);
			Map<String, String> eachstore = solrDocumentList.get(storeId);
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("storeId", eachstore.get("storeId_s"));
			data.put("name", eachstore.get("name_s"));
			data.put("city", eachstore.get("city_s"));
			data.put("pincode", eachstore.get("pincode_s"));
			data.put("address", eachstore.get("address_s"));
			data.put("latitude", eachstore.get("locationLatLong").split(",")[0]);
			data.put("longitude", eachstore.get("locationLatLong").split(",")[1]);
			
			CompetitorSearchCriteria competitorSearchCriteria = new CompetitorSearchCriteria();
			competitorSearchCriteria.setMedplusStoreId(storeId);
			competitorSearchCriteria.setStatus("S");
			
			CompetitorInfo competitorInfo = shutterService.getCompetitorInfo(competitorSearchCriteria);
			List<Competitor> competitorsList = competitorInfo.getCompetitorInfoList();
			
			model.addAttribute("store", data);
			model.addAttribute("competitors", competitorsList);
			
			
		}catch (Exception e) {
			logger.error("Error :",e);
			model.addAttribute("result", "PLEASE_TRY_AFTER_SOMETIME_SERVER_DOWN");
		}
		
		return model; 
	}
	
	@RequestMapping(value="/uploadFromExcel", method=RequestMethod.GET)
	public ModelAndView uploadFromExcel(HttpSession session){
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}
		
		ModelAndView mav = new ModelAndView("uploadFromExcel");
		return mav;
	}
	
	@RequestMapping(value="/uploadCompetitors", method=RequestMethod.POST)
	public @ResponseBody ModelMap uploadCompetitors(@RequestParam("file") MultipartFile file, HttpServletRequest request, HttpSession session) {
		ModelMap model = new ModelMap();

		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		String userId = userDetails.getUserId();
		String userMobile = userDetails.getPhone();
		if(UtilValidate.isEmpty(userId) || !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}
		
		if (file.isEmpty()) {
			model.addAttribute("result", "Please select a file to upload");
			return model;
		}
				
		try {
								
			XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
			XSSFSheet sheet = workbook.getSheetAt(0);
						
			Boolean headerFlag = false;
			Row header = sheet.getRow(0);
			if(	header.getCell(0).toString().equalsIgnoreCase("outletName") &&
				header.getCell(1).toString().equalsIgnoreCase("pharmacyChain") &&
				header.getCell(2).toString().equalsIgnoreCase("city") &&
				header.getCell(3).toString().equalsIgnoreCase("latitude") &&
				header.getCell(4).toString().equalsIgnoreCase("longitude") &&
				header.getCell(5).toString().equalsIgnoreCase("address")
			) {
				headerFlag = true;
			}
			
			if(headerFlag) {
				for (int i = 1; i <= sheet.getLastRowNum(); ++i) {
					Row row = sheet.getRow(i);
									
					Competitor competitor = new Competitor();
					
					competitor.setOutletName(row.getCell(0).toString());
					competitor.setLatitude(row.getCell(3).toString());
					competitor.setLongitude(row.getCell(4).toString());
					   
					CompetitorSearchCriteria cscLatLong = new CompetitorSearchCriteria();
					
					Double lat = Double.parseDouble(competitor.getLatitude());
					Double lng = Double.parseDouble(competitor.getLongitude());
					
					cscLatLong.setLatitude(Double.toString((int)(Math.pow(10, 5) *  lat)/Math.pow(10, 5)));
					cscLatLong.setLongitude(Double.toString((int)(Math.pow(10, 5) *  lng)/Math.pow(10, 5)));
					cscLatLong.setRadiusFlag(true);
					cscLatLong.setRadius("0.01");
					cscLatLong.setStatus("S");
					CompetitorInfo competitorInfoList = shutterService.getDuplicateCompetitorRecords(cscLatLong);
					List<Competitor> duplicate = checkDuplicates(competitorInfoList,competitor.getOutletName());
					if(duplicate.size() == 0) {
						
						String address = row.getCell(5).toString();
						String pharmacyChain = "other";
						
						if(UtilValidate.isNotEmpty(row.getCell(6))) {
							address += " - " + row.getCell(6).toString();
						}
						if(UtilValidate.isNotEmpty(row.getCell(7))) {
							address += " - " + row.getCell(7).toString();
						}
						
						if(UtilValidate.isNotEmpty(row.getCell(1))) {
							pharmacyChain = row.getCell(1).toString();
						}

						GoogleLocation googleLocation = googlePlaceService.getLocationForLatLong(competitor.getLatitude(), competitor.getLongitude());
						
						competitor.setPharmacyChain(pharmacyChain);
						competitor.setCity(row.getCell(2).toString());
						competitor.setAddress(address);
						competitor.setPincode(Integer.toString(googleLocation.getPinCode()));
						competitor.setStatus("S");
						competitor.setAgeOfShop(0);
						competitor.setCreatedBy("Upload From Excel");
						competitor.setUserId(userId);
						competitor.setUserMobileNo(userMobile);
						
						String latLong = competitor.getLatitude() + "," + competitor.getLongitude();
						SolrDocumentList solrDocumentList = StoresCoreHelper.getNearestStores(latLong, 1.5, null, true);
			            if(solrDocumentList.size() > 0) {	
				           competitor.setMedplusStoreId(solrDocumentList.get(0).get("storeId_s").toString());
						} else {
						   competitor.setMedplusStoreId("None");
						}
						
						shutterService.saveCompetitorInfo(competitor, null);
					}
					
				}
				
				model.addAttribute("result", "Uploaded Successfully");
				
			}else {
				model.addAttribute("result", "Incorrect order");
			}
			
			return model;
			
		}catch(Exception e) {
			model.addAttribute("error", e.toString());
			return model;
		}
				
	}
	
	@RequestMapping(value = "/refreshCompetitorStoreMapping", method = RequestMethod.GET)
	public @ResponseBody ModelMap refreshCompetitorStoreMapping(HttpServletRequest request, HttpSession session) {
		ModelMap model = new ModelMap();
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		String userId = userDetails.getUserId();
		if(UtilValidate.isEmpty(userId) || !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN") || !userDetails.getRoles().contains("ROLE_CMT_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}
		try {
			String lat = (String)request.getParameter("latitude");
			String lng = (String)request.getParameter("longitude");
			CompetitorSearchCriteria csc = new CompetitorSearchCriteria();
			List<Competitor> competitorList = new ArrayList<>();
			if(UtilValidate.isNotEmpty(lat) && UtilValidate.isNotEmpty(lng)) {
				csc.setLatitude(lat);
				csc.setLongitude(lng);
				csc.setRadius("10");
				csc.setStoreMapping(true);
				
			}else {
				csc.setStatus("S");
			}
			
			CompetitorInfo competitorInfoList = shutterService.getCompetitorInfo(csc);
			competitorList = competitorInfoList.getCompetitorInfoList();
			for(int i = 0; i < competitorList.size(); i++) {
				competitorList.get(i).setModifiedBy(userId);
				Competitor competitor = competitorList.get(i); 
				
				String latLong = competitor.getLatitude() + "," + competitor.getLongitude();
				SolrDocumentList solrDocumentList = StoresCoreHelper.getNearestStores(latLong, 1.5, null, true);
	            if(solrDocumentList.size() > 0) {	
		           competitor.setMedplusStoreId(solrDocumentList.get(0).get("storeId_s").toString());
				} else {
				   competitor.setMedplusStoreId("None");
				}
	            Competitor updatedCompetitor = shutterService.saveCompetitorLog(competitor);
	            if(updatedCompetitor.getCompetitorId() != null) {
					shutterService.updateCompetitorInfo(updatedCompetitor);
				}
			}
			model.addAttribute("result", "Mapping Successfull");
			return model;	
		} catch(Exception e) {
			model.addAttribute("error", e.toString());
			return model;
		}
	}
	
	
//	@RequestMapping(value = "/timeoutCompetitor", method = RequestMethod.GET)
	@Scheduled( cron = "0 0 1 * * * " ) //daily @ 1:00 AM
	public void competitorsRequestTimeout() {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.MONTH, -1);
		Date date = cal.getTime();
		SimpleDateFormat exp = new SimpleDateFormat("yyyy-MM-dd");
		CompetitorSearchCriteria csc = new CompetitorSearchCriteria();
		csc.setStatus("I");
		csc.setDateCreated(exp.format(date));
		
		try {
			CompetitorInfo competitorInfoList = shutterService.getCompetitorInfo(csc);
			List<Competitor> competitorList = competitorInfoList.getCompetitorInfoList();
			for(int i = 0; i < competitorList.size(); i++) {
				Competitor competitor = competitorList.get(i);
				competitor.setStatus("R");
				competitor.setModifiedBy("Timeout");
				shutterService.updateCompetitorInfo(competitor);
			}
		}catch(Exception e) {
			logger.error("Competitors Request Timeout",e.toString());
		}
	}
	
	@RequestMapping(value="/uploadFieldAgentsFromExcel", method=RequestMethod.GET)
	public ModelAndView uploadFieldAgentsFromExcel(HttpSession session){
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}
		
		ModelAndView mav = new ModelAndView("uploadFieldAgentsFromExcel");
		return mav;
	}
	
	@RequestMapping(value = "/uploadFieldAgents", method = RequestMethod.POST)
	public @ResponseBody ModelMap uploadFieldAgents(@RequestParam("file") MultipartFile file, HttpServletRequest request, HttpSession session) {
		ModelMap model = new ModelMap();

		UserDetails userDetails = (UserDetails) session.getAttribute("userObj");
		String userId = userDetails.getUserId();
		if (UtilValidate.isEmpty(userId) || !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}

		if (file.isEmpty()) {
			model.addAttribute("result", "Please select a file to upload");
			return model;
		}

		try {

			XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
			XSSFSheet sheet = workbook.getSheetAt(0);

			for (int i = 1; i <= sheet.getLastRowNum(); ++i) {
				Row row = sheet.getRow(i);

				FieldAgent fieldAgent = new FieldAgent();

				fieldAgent.setStateCode(row.getCell(0).toString());
				fieldAgent.setCity(row.getCell(1).toString());
				fieldAgent.setLocalHead(row.getCell(2).toString());
				fieldAgent.setManager(row.getCell(3).toString());
				fieldAgent.setManagerId(row.getCell(4).toString());
				
				DataFormatter fmt = new DataFormatter();
				String managerPhone = fmt.formatCellValue(row.getCell(5));
				
				fieldAgent.setManagerPhone(managerPhone);

				shutterService.saveFieldAgent(fieldAgent);

			}

			model.addAttribute("result", "Uploaded Successfully");
			return model;

		} catch (Exception e) {
			model.addAttribute("error", e.toString());
			return model;
		}

	}
	
	@RequestMapping(value = "/downloadExcelFile",method = RequestMethod.GET)
	public void downloadExcelFile(HttpServletRequest request,HttpServletResponse response, HttpSession session) {
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			System.out.println("INVALID_USER");
			logger.error("INVALID_USER");
		}
		
		List<Shutter> shutterList = new ArrayList<Shutter>();
		String status=request.getParameter("status");
		String fromDate=request.getParameter("fromDate");
		String toDate=request.getParameter("toDate");
		String locality=request.getParameter("locality") == null ? "" : request.getParameter("locality");
		String shutterId=request.getParameter("shutterId");
		String city=request.getParameter("city");
		String agent = request.getParameter("agent");
		
		HashMap<String, String> statusMap = new HashMap<>();
		statusMap.put("I", "Created");
		statusMap.put("F", "Sent to Field");
		statusMap.put("V", "Field Verified");
		statusMap.put("A", "Approved for Setup");
		statusMap.put("S", "Setup Done");
		statusMap.put("R", "Rejected");

		List<String> statesList = new LinkedList<>();
		if(!locality.isEmpty()) {
			HashMap<String, String> states = shutterService.getStates();
			statesList.add(states.get(locality));
		}
        
    	Set<String> statesSet = new HashSet<String>(statesList);
             
		if(UtilValidate.isNotEmpty(status) || (UtilValidate.isNotEmpty(fromDate) && UtilValidate.isNotEmpty(toDate)) || UtilValidate.isNotEmpty(locality) || UtilValidate.isNotEmpty(shutterId) ) {
			
			ShutterSearchCriteria	shutterSearchCriteria= new ShutterSearchCriteria();
				
				shutterSearchCriteria.setFromDate(fromDate);
				shutterSearchCriteria.setToDate(toDate);
				shutterSearchCriteria.setStatus(status);
				shutterSearchCriteria.setState(statesSet);
				shutterSearchCriteria.setCity(city);
				shutterSearchCriteria.setImageInfoRequired(true);;
				shutterSearchCriteria.setFieldVerifiedBy(agent);
				if(UtilValidate.isNotEmpty(shutterId)) {
					shutterSearchCriteria.setShutterId(Long.valueOf(shutterId));
				}
				try{
					ShutterInfo shutterInfo = shutterService.getShutterInfo(shutterSearchCriteria);
					shutterList= shutterInfo.getShutterInfoList();
				} catch(Exception e){
					logger.error(e.getMessage());
				}
			}
		
		Workbook wb = new XSSFWorkbook();
        CreationHelper createHelper = wb.getCreationHelper();
        XSSFFont font = (XSSFFont)wb.createFont();
        font.setBold(true);
        CellStyle style = wb.createCellStyle();;
        style.setFont(font);
		try {
			Sheet sheet = wb.createSheet("Shutters Data");
			Row row = sheet.createRow(0);
			Cell cell = row.createCell(0);
			cell.setCellValue("Shutter Id");
			cell = row.createCell(1);
			cell.setCellValue("Owner Name");
			cell = row.createCell(2);
			cell.setCellValue("Owner MobileNo");
			cell = row.createCell(3);
			cell.setCellValue("Address");
			cell = row.createCell(4);
			cell.setCellValue("City/State");
			cell = row.createCell(5);
			cell.setCellValue("Captured By");
			cell = row.createCell(6);
			cell.setCellValue("Date Created");
			cell = row.createCell(7);
			cell.setCellValue("Store Dimensions (in Sq.ft)");
			cell = row.createCell(8);
			cell.setCellValue("Store Depth (in feets)");
			cell = row.createCell(9);
			cell.setCellValue("Store Front Area (in feets)");
			cell = row.createCell(10);
			cell.setCellValue("Rent Per Month (in Rs.)");
			cell = row.createCell(11);
			cell.setCellValue("Advance To Be Paid(in Rs.)");
			cell = row.createCell(12);
			cell.setCellValue("Status Update Date");
			cell = row.createCell(13);
			cell.setCellValue("Shutter Status");
			cell = row.createCell(14);
			cell.setCellValue("AssignedTo");
			cell = row.createCell(15);
			cell.setCellValue("Field Verification Comment");
			cell = row.createCell(16);
			cell.setCellValue("Admin Comment");
			cell = row.createCell(17);
			cell.setCellValue("Agreement Date");
			cell = row.createCell(18);
			cell.setCellValue("Shutter URL(image 1)");
			cell = row.createCell(19);
			cell.setCellValue("image 2");
			cell = row.createCell(20);
			cell.setCellValue("image 3");
			cell = row.createCell(21);
			cell.setCellValue("image 4");
			for(int cellNo=0; cellNo < row.getLastCellNum(); cellNo++) {
				row.getCell(cellNo).setCellStyle(style);
			}
			for(int rowNo=0;rowNo < shutterList.size();rowNo++) {
				row = sheet.createRow(rowNo+1);
				Shutter shutter = new Shutter();
				shutter = shutterList.get(rowNo);
				cell = row.createCell(0);
				cell.setCellValue(shutter.getShutterId());
				cell = row.createCell(1);
				cell.setCellValue(shutter.getOwnerName());
				cell = row.createCell(2);
				cell.setCellValue(shutter.getOwnerMobileNo());
				cell = row.createCell(3);
				cell.setCellValue(shutter.getAddress());
				cell = row.createCell(4);
				String cityName = UtilValidate.isNotEmpty(shutter.getCity()) ? shutter.getCity() : "-";
				String stateName = UtilValidate.isNotEmpty(shutter.getState()) ? shutter.getState() : "-";
				cell.setCellValue(cityName + "/" + stateName);
				cell = row.createCell(5);
				cell.setCellValue(shutter.getCreatedBy());
				cell = row.createCell(6);
				cell.setCellValue(shutter.getDateCreated());
				if(UtilValidate.isNotEmpty(shutter.getStoreDimentions())) {
					cell = row.createCell(7);
					cell.setCellValue(shutter.getStoreDimentions());	
				}
				if(UtilValidate.isNotEmpty(shutter.getStoreDepth())) {
					cell = row.createCell(8);
					cell.setCellValue(shutter.getStoreDepth());
				}
				if(UtilValidate.isNotEmpty(shutter.getStoreFrontArea())) {
					cell = row.createCell(9);
					cell.setCellValue(shutter.getStoreFrontArea());
				}
				if(UtilValidate.isNotEmpty(shutter.getRentPerMonth())) {
					cell = row.createCell(10);
					cell.setCellValue(shutter.getRentPerMonth());
				}
				if(UtilValidate.isNotEmpty(shutter.getAdvanceToBePaid())) {
					cell = row.createCell(11);
					cell.setCellValue(shutter.getAdvanceToBePaid());	
				}
				if(UtilValidate.isNotEmpty(shutter.getDateModified())) {
					cell = row.createCell(12);
					cell.setCellValue(shutter.getDateModified());
				}
				if(UtilValidate.isNotEmpty(shutter.getStatus())) {
					cell = row.createCell(13);
					cell.setCellValue(statusMap.get(shutter.getStatus()));
				}
				if(UtilValidate.isNotEmpty(shutter.getFieldVerifiedBy())) {
					cell = row.createCell(14);
					cell.setCellValue(shutter.getFieldVerifiedBy());
				}
		        String[] statusValues = new String[]{"V", "S", "A", "R"};
		        List<String> statusList = Arrays.asList(statusValues);
		        String comment = "";
		        if(statusList.contains(shutter.getStatus()) && UtilValidate.isNotEmpty(shutter.getFieldVerifiedBy())) {
		        	comment = shutterService.getShutterComment(shutter.getShutterId(), shutter.getFieldVerifiedBy());
		        	if(UtilValidate.isNotEmpty(comment)) {
						cell = row.createCell(15);
						cell.setCellValue(comment);
					}
		        }
		        statusValues = new String[]{"S", "A", "R"};
		        statusList = Arrays.asList(statusValues);
		        if(statusList.contains(shutter.getStatus()) && UtilValidate.isNotEmpty(shutter.getModifiedBy())) {
		        	comment = shutterService.getShutterComment(shutter.getShutterId(), shutter.getModifiedBy());
		        	if(UtilValidate.isNotEmpty(comment)) {
						cell = row.createCell(16);
						cell.setCellValue(comment);
					}
		        }
				if(UtilValidate.isNotEmpty(shutter.getAgreementDate())) {
					cell = row.createCell(17);
					cell.setCellValue(shutter.getAgreementDate());
				}
				if(shutter.getImageInfoList() != null) {
					for(int image=0; image < shutter.getImageInfoList().size(); image++) {
						cell = row.createCell(18+image);
						Hyperlink link = createHelper.createHyperlink(Hyperlink.LINK_FILE);
						String address = shutter.getImageInfoList().get(image).getImagePath();
						link.setAddress(address);
						cell.setCellValue(address);
						cell.setHyperlink(link);
					}
				}else {
					cell = row.createCell(18);
					cell.setCellValue("IMAGE NOT AVAILABLE");
				}
			}
			
			response.setHeader("Content-disposition", "attachment;filename=" + "shuttersReport.xls");
	        response.setHeader("charset", "iso-8859-1");
	        response.setContentType("application/octet-stream");
	        response.setStatus(HttpServletResponse.SC_OK);
	        
	        ByteArrayOutputStream bos = new ByteArrayOutputStream();
	        try {
	            wb.write(bos);
	        } finally {
	            bos.close();
	        }
	        byte[] bytes = bos.toByteArray();
	        OutputStream outputStream = null;
	        try {
	            outputStream = response.getOutputStream();
	            outputStream.write(bytes, 0, bytes.length);
	            outputStream.flush();
	            outputStream.close();
	            response.flushBuffer();
	        } catch (Exception e) {
	        	logger.error("Exception", e.getMessage());
	        }
	        
		} catch (Exception e) {
			logger.error("Exception", e.getMessage());
		} 
	}
	
	@RequestMapping(value = "/shutterSummary", method = RequestMethod.GET)
	public ModelAndView shutterSummary(HttpSession session){
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		HashMap<String, List<String>> userStates = shutterService.getStatesOfLocalhead(userDetails.getUserId());
		if(userStates.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}
		
		ShutterSearchCriteria shutterSearchCriteria= new ShutterSearchCriteria();
		Set<String> stateCodes = null;
		if(!userStates.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			HashMap<String, String> states = shutterService.getStates();
			stateCodes = userStates.keySet();
			Set<String> userStateCodes = new HashSet<>(); 
			for(String code: stateCodes) {
				userStateCodes.add(states.get(code));
        	}
			shutterSearchCriteria.setState(userStateCodes);
		}

		HashMap<String, HashMap<String, HashMap<String, Integer>>> shutterSummary = shutterService.getShutterSummary(shutterSearchCriteria);
		System.out.println(shutterSummary);

		ModelMap model = new ModelMap();
		Gson gson = new Gson();
		model.addAttribute("shutterSummary", gson.toJson(shutterSummary));
		model.addAttribute("listOfStates", gson.toJson(getStatesDropdown(stateCodes)));
		
		ModelAndView mav = new ModelAndView("shutterSummary", "model", model);
		return mav;
	}
	
	@RequestMapping(value = "/shutterSummaryFilter", method = RequestMethod.GET)
	public @ResponseBody ModelMap shutterSummaryFilter(HttpServletRequest request, HttpSession session){
		
		ModelMap model = new ModelMap();

		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		HashMap<String, List<String>> userStates = shutterService.getStatesOfLocalhead(userDetails.getUserId());
		if(userStates.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}
		List<String> statesList = new LinkedList<>();
		if(!userStates.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			HashMap<String, String> states = shutterService.getStates();
			for(String code: userStates.keySet()) {
        		statesList.add(states.get(code));
        	}
		}
		
		try {
			String fromDate=request.getParameter("fromDate");
			String toDate=request.getParameter("toDate");
			String locality=request.getParameter("locality") == null ? "" : request.getParameter("locality");
			
	        if(!locality.isEmpty()) {
	        	statesList.clear();
				statesList.add(locality);
			}
	        
	    	Set<String> statesSet = new HashSet<String>(statesList);
			
			ShutterSearchCriteria shutterSearchCriteria= new ShutterSearchCriteria();		
			shutterSearchCriteria.setFromDate(fromDate);
			shutterSearchCriteria.setToDate(toDate);		
			shutterSearchCriteria.setState(statesSet);
					
			HashMap<String, HashMap<String, HashMap<String, Integer>>> shutterSummary = shutterService.getShutterSummary(shutterSearchCriteria);
			System.out.println(shutterSummary);
			Gson gson = new Gson();
			model.addAttribute("shutterSummary", gson.toJson(shutterSummary));
		}catch (Exception e) {
			logger.error("Error :",e);
			model.addAttribute("result", "PLEASE_TRY_AFTER_SOMETIME_SERVER_DOWN");
		}
		
		return model;
	}
	
	private String getStatesCitiesMapForNotification() {
		MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
		map.add("username", usernameExt);
		map.add("password", passwordExt);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		final HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(map, headers);
		JSONObject jsonObject = null;
		String statesCitiesMap = null;
		
		try {
			RestTemplate restTemplate = new RestTemplate();
			ResponseEntity<String> responseEntity = restTemplate.exchange(loginUrlExt, HttpMethod.POST, entity, String.class);

			if (responseEntity.getStatusCode() == HttpStatus.OK) {
				try {
					jsonObject = new JSONObject(responseEntity.getBody());
					String accessToken = jsonObject.getString("access");

					MultiValueMap<String, String> headersWorkflow = new LinkedMultiValueMap<String, String>();
					headersWorkflow.add("Authorization", "Bearer " + accessToken);
					headersWorkflow.add("Content-Type", "application/json");

					HttpEntity<String> entityWorkflow = new HttpEntity<String>("", headersWorkflow);
					statesCitiesMap = restTemplate.postForObject(getStatesCities, entityWorkflow, String.class);
					
				} catch (JSONException e) {
					throw new RuntimeException("JSONException occurred");
				}
			}
		} catch (Exception e) {
			logger.error("Error :", e);
			System.out.println(e.getMessage());
			return e.getMessage();
		}
		return statesCitiesMap;
	}
	
	@RequestMapping(value="/notificationForm", method=RequestMethod.GET)
	public ModelAndView sendMessage(HttpSession session) {
		
		ModelMap model = new ModelMap();
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		HashMap<String, List<String>> userStates = shutterService.getStatesOfLocalhead(userDetails.getUserId());
		if(userStates.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}
		Set<String> stateCodes = null;
		if(!userStates.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			stateCodes = userStates.keySet();
		}
		
		try {			
			Gson gson = new Gson();
			
			model.addAttribute("statesCitiesMap", gson.toJson(getStatesCitiesMapForNotification()));
			model.addAttribute("listOfStates", gson.toJson(getStatesDropdown(stateCodes)));

		} catch (Exception e) {
			logger.error("Error :", e);
			model.addAttribute("error", e.getMessage());
		}
		
		ModelAndView mav = new ModelAndView("notificationForm", "model", model);
		return mav;		
	}
	
	@RequestMapping(value = "/sendMessage", method = RequestMethod.POST)
	public @ResponseBody String sendMessage(HttpServletRequest request, HttpSession session) {
		UserDetails userDetails = (UserDetails) session.getAttribute("userObj");
		if (UtilValidate.isEmpty(userDetails)) {
			return "USER_NOT_LOGGEDIN";
		}
		HashMap<String, List<String>> userStates = shutterService.getStatesOfLocalhead(userDetails.getUserId());
		if(userStates.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			return "INVALID_USER";
		}
		
		String message = request.getParameter("message");
		String stateCode = request.getParameter("stateCode");
		String cityCode = request.getParameter("cityCode");
		
		MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
		map.add("username", username);
		map.add("password", password);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		final HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(map, headers);
		JSONObject jsonObject = null;

		try {
			RestTemplate restTemplate = new RestTemplate();
			ResponseEntity<String> responseEntity = restTemplate.exchange(loginUrl, HttpMethod.POST, entity, String.class);

			if (responseEntity.getStatusCode() == HttpStatus.OK) {
				try {
					jsonObject = new JSONObject(responseEntity.getBody());
					String accessToken = jsonObject.getString("access");

					MultiValueMap<String, String> headersWorkflow = new LinkedMultiValueMap<String, String>();
					headersWorkflow.add("Authorization", "Bearer " + accessToken);
					headersWorkflow.add("Content-Type", "application/json");

					Gson gson = new Gson();

					JSONObject SMSDetails = new JSONObject();
					
					SMSDetails.put("stateCode", stateCode);
					SMSDetails.put("cityCode", cityCode);
					SMSDetails.put("message", message.replace("%27", "'"));

					HttpEntity<String> entityWorkflow = new HttpEntity<String>(gson.toJson(SMSDetails), headersWorkflow);
					String answer = restTemplate.postForObject(NotificationUrl, entityWorkflow, String.class);

					System.out.println(answer);

				} catch (JSONException e) {
					throw new RuntimeException("JSONException occurred");
				}
			}
		} catch (Exception e) {
			logger.error("Exception", e.getMessage());
			return "ERROR";
		}
		return "SUCCESS";
	}
		
	private String updateShutterDetails(UserDetails userDetails, String shutterId, String updatedCity, String updatedState,
			String updatedStatus, String updatedComment) {
		
		if (UtilValidate.isEmpty(shutterId) && !UtilValidate.isNumericId(shutterId)) {
			return "INVALID_SHUTTER_ID";
		}
		if (UtilValidate.isEmpty(updatedCity) && UtilValidate.isEmpty(updatedState) && UtilValidate.isEmpty(updatedStatus)) {
			return "INVALID_DATA";
		}
		if (UtilValidate.isEmpty(updatedComment)) {
			return "COMMENT_REQUIRED";
		}
		
		try {
			Shutter shutter = new Shutter();
			shutter.setShutterId(Long.valueOf(shutterId));			
			if (UtilValidate.isNotEmpty(updatedCity)) {
				shutter.setCity(updatedCity);
			}
			if (UtilValidate.isNotEmpty(updatedState) && updatedState.length()==2) {
				HashMap<String, String> states = shutterService.getStates();
				shutter.setState(states.get(updatedState));
				shutter.setLocality(updatedState.toUpperCase());
			}
			if (UtilValidate.isNotEmpty(updatedStatus)) {
				shutter.setStatus(updatedStatus);
			}
			shutter.setComment(updatedComment);
			shutter.setModifiedBy(userDetails.getUserId());

			int response = shutterService.updateShutterInfo(shutter);

			if (response > 0) {
				return "SUCCESS";
			} else {
				return "FAILED_TO_UPDATE";
			}
		} catch (ShutterException e) {
			logger.error("Shutter Exception : ", e);
			return e.getMessage();
		}
	}

	@RequestMapping(value = "/updateShutterData", method = RequestMethod.POST)
	public @ResponseBody String updateShutterData(HttpServletRequest request, HttpSession session) {
		UserDetails userDetails = (UserDetails) session.getAttribute("userObj");
		if (UtilValidate.isEmpty(userDetails)) {
			return "USER_NOT_LOGGEDIN";
		}
		if (!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			return "INVALID_USER";
		}
		if (UtilValidate.isEmpty(session)) {
			return "SESSION EXPIRED";
		}
		
		String shutterId = request.getParameter("shutterid");
		String updatedCity = request.getParameter("updatedCity");
		String updatedState = request.getParameter("updatedState");
		String updatedStatus = request.getParameter("updatedStatus");
		String updatedComment = request.getParameter("updatedComment");
		
		try {
			return updateShutterDetails(userDetails, shutterId, updatedCity, updatedState, updatedStatus, updatedComment);
		} catch (Exception e) {
			logger.error("Error:", e);
			return "SHUTTER_UPDATION_FAILED";
		}
	}

	@RequestMapping(value = "/uploadUpdatedShutterData", method = RequestMethod.GET)
	public ModelAndView uploadUpdatedShutterData(HttpSession session) {
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}
		
		ModelAndView mav = new ModelAndView("uploadUpdatedShutterData");
		return mav;
	}

	@RequestMapping(value = "/shutterUpdatedData", method = RequestMethod.POST)
	public @ResponseBody ModelMap shutterUpdatedData(@RequestParam("file") MultipartFile file, HttpServletRequest request, HttpSession session) {

		ModelMap model = new ModelMap();

		UserDetails userDetails = (UserDetails) session.getAttribute("userObj");
		String userId = userDetails.getUserId();
		if (UtilValidate.isEmpty(userId) || !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}
		if (file.isEmpty()) {
			model.addAttribute("result", "Please select a file to upload");
			return model;
		}

		try {

			XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
			XSSFSheet sheet = workbook.getSheetAt(0);

			Boolean headerFlag = false;
			Row header = sheet.getRow(0);
			if (header.getCell(0).toString().equalsIgnoreCase("shutterId")
				&& header.getCell(1).toString().equalsIgnoreCase("city")
				&& header.getCell(2).toString().equalsIgnoreCase("state")) {
				headerFlag = true;
			}

			if (headerFlag) {
				for (int i = 1; i <= sheet.getLastRowNum(); ++i) {
					Row row = sheet.getRow(i);

					DataFormatter fmt = new DataFormatter();
					String shutterId = fmt.formatCellValue(row.getCell(0));
					String updatedCity = null;
					String updatedState = null;
					if(row.getCell(1) != null) {
						updatedCity = row.getCell(1).toString();
					}
					if(row.getCell(2) != null) {
						updatedState = row.getCell(2).toString();
					}

					updateShutterDetails(userDetails, shutterId, updatedCity, updatedState, null, "Data Updated");
				}
				model.addAttribute("result", "Uploaded Successfully");
			} else {
				model.addAttribute("result", "Incorrect order");
			}
			return model;
		} catch (Exception e) {
			model.addAttribute("error", e.toString());
			return model;
		}
	}
	
	@RequestMapping(value = "/downloadCompIncentivesData",method = RequestMethod.GET)
	public void downloadCompIncentivesData(HttpServletRequest request,HttpServletResponse response, HttpSession session) {
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		HashMap<String, List<String>> userStates = shutterService.getStatesOfLocalhead(userDetails.getUserId());
		if(userStates.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			System.out.println("INVALID_USER");
			logger.error("INVALID_USER");
		}
		
		List<CompetitorIncentives> competitorInfo = new ArrayList<CompetitorIncentives>();
		
		String status=request.getParameter("status");
		String fromDate=request.getParameter("fromDate");
		String toDate=request.getParameter("toDate");
		String locality=request.getParameter("locality");
		String competitorId=request.getParameter("competitorId");
		String createdBy=request.getParameter("createdBy");
		String pincode = request.getParameter("pincode");
		String areaWise = request.getParameter("areaWise");

		if(UtilValidate.isNotEmpty(status) || (UtilValidate.isNotEmpty(fromDate) && UtilValidate.isNotEmpty(toDate)) || UtilValidate.isNotEmpty(locality) || UtilValidate.isNotEmpty(competitorId) ) {
			
			CompetitorSearchCriteria competitorSearchCriteria= new CompetitorSearchCriteria();
				
			competitorSearchCriteria.setFromDate(fromDate);
			competitorSearchCriteria.setToDate(toDate);
			competitorSearchCriteria.setStatus(status);
			competitorSearchCriteria.setLocality(locality);
			competitorSearchCriteria.setPincode(pincode);
			competitorSearchCriteria.setCreatedBy(createdBy);
			competitorSearchCriteria.setAreaWise(areaWise);
			if(UtilValidate.isNotEmpty(competitorId)) {
				competitorSearchCriteria.setCompetitorId(Long.parseLong(competitorId));
			}
			try{
				competitorInfo = shutterService.getCompIncentivesData(competitorSearchCriteria);
			} catch(Exception e){
				logger.error(e.getMessage());
			}
		}
		
		Workbook wb = new XSSFWorkbook();
        XSSFFont font = (XSSFFont)wb.createFont();
        font.setBold(true);
        CellStyle style = wb.createCellStyle();;
        style.setFont(font);
		try {
			Sheet sheet = wb.createSheet("Incentives info");
			Row row = sheet.createRow(0);
			Cell cell = row.createCell(0);
			cell.setCellValue("UserId");
			cell = row.createCell(1);
			cell.setCellValue("Name");
			cell = row.createCell(2);
			cell.setCellValue("MobileNo");
			cell = row.createCell(3);
			cell.setCellValue("Initiated");
			cell = row.createCell(4);
			cell.setCellValue("Approved");
			cell = row.createCell(5);
			cell.setCellValue("Rejected");
			cell = row.createCell(6);
			cell.setCellValue("Total");
			
			for(int rowNo=0;rowNo < competitorInfo.size();rowNo++) {
				row = sheet.createRow(rowNo+1);
				CompetitorIncentives eachRow = new CompetitorIncentives();
				eachRow = competitorInfo.get(rowNo);
				cell = row.createCell(0);
				cell.setCellValue(eachRow.getUserId());
				cell = row.createCell(1);
				cell.setCellValue(eachRow.getCreatorName());
				cell = row.createCell(2);
				cell.setCellValue(eachRow.getCreatorPhone());
				cell = row.createCell(3);
				cell.setCellValue(eachRow.getInitiatedCount());
				cell = row.createCell(4);
				cell.setCellValue(eachRow.getApprovedCount());
				cell = row.createCell(5);
				cell.setCellValue(eachRow.getRejectedCount());
				cell = row.createCell(6);
				cell.setCellValue(eachRow.getTotal());				
			}
			
			response.setHeader("Content-disposition", "attachment;filename=" + "IncetivesReport.xls");
	        response.setHeader("charset", "iso-8859-1");
	        response.setContentType("application/octet-stream");
	        response.setStatus(HttpServletResponse.SC_OK);
	        
	        ByteArrayOutputStream bos = new ByteArrayOutputStream();
	        try {
	            wb.write(bos);
	        } finally {
	            bos.close();
	        }
	        byte[] bytes = bos.toByteArray();
	        OutputStream outputStream = null;
	        try {
	            outputStream = response.getOutputStream();
	            outputStream.write(bytes, 0, bytes.length);
	            outputStream.flush();
	            outputStream.close();
	            response.flushBuffer();
	        } catch (Exception e) {
	        	logger.error("Exception", e.getMessage());
	        }
	        
		} catch (Exception e) {
			logger.error("Exception", e.getMessage());
		} 
	}
	
	@RequestMapping(value = "/downloadShutterSummary",method = RequestMethod.GET)
	public void downloadShutterSummary(HttpServletRequest request,HttpServletResponse response, HttpSession session) {
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		HashMap<String, List<String>> userStates = shutterService.getStatesOfLocalhead(userDetails.getUserId());
		if(userStates.isEmpty() && !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			System.out.println("INVALID_USER");
			logger.error("INVALID_USER");
		}
		
		HashMap<String, HashMap<String, HashMap<String, Integer>>> shutterSummary = new HashMap<>();
		try{
			String fromDate=request.getParameter("fromDate");
			String toDate=request.getParameter("toDate");
			String locality=request.getParameter("locality") == null ? "" : request.getParameter("locality");
					
			List<String> statesList = new LinkedList<>();
	        
	        if(!locality.isEmpty()) {
	        	statesList.clear();
				statesList.add(locality);
			}
	        
	    	Set<String> statesSet = new HashSet<String>(statesList);
			
			ShutterSearchCriteria shutterSearchCriteria= new ShutterSearchCriteria();		
			shutterSearchCriteria.setFromDate(fromDate);
			shutterSearchCriteria.setToDate(toDate);		
			shutterSearchCriteria.setState(statesSet);
					
			shutterSummary = shutterService.getShutterSummary(shutterSearchCriteria);
		} catch(Exception e){
			logger.error(e.getMessage());
		}		
		
		Workbook wb = new XSSFWorkbook();
        XSSFFont font = (XSSFFont)wb.createFont();
        font.setBold(true);
        CellStyle style = wb.createCellStyle();;
        style.setFont(font);
		try {
			Sheet sheet = wb.createSheet("Summary");
			Row row = sheet.createRow(0);
			Cell cell = row.createCell(0);
			cell.setCellValue("S.No");
			cell = row.createCell(1);
			cell.setCellValue("State");
			cell = row.createCell(2);
			cell.setCellValue("City");
			cell = row.createCell(3);
			cell.setCellValue("Created");
			cell = row.createCell(4);
			cell.setCellValue("Rejected");
			cell = row.createCell(5);
			cell.setCellValue("SentToField");
			cell = row.createCell(6);
			cell.setCellValue("FieldVerified");
			cell = row.createCell(7);
			cell.setCellValue("ApprovedForSetup");
			cell = row.createCell(8);
			cell.setCellValue("SetupDone");
			cell = row.createCell(9);
			cell.setCellValue("Total");
			
			Integer serialNo = 1;
			HashMap<String, Integer> totalData = new HashMap<>();
			
			for(Entry<String, HashMap<String, HashMap<String, Integer>>> record: shutterSummary.entrySet()) {				
				String stateName = record.getKey();
				if(stateName != "TOTAL_DETAILS") {
					Set<String> cities = record.getValue().keySet();
					List<String> citiesList = new LinkedList<>();
					for(String city: cities) {
						citiesList.add(city);
		        	}
					for(int rowNo=0;rowNo < citiesList.size();rowNo++) {
						String cityName = citiesList.get(rowNo);
						HashMap<String, Integer> cityValues = record.getValue().get(cityName);
						row = sheet.createRow(serialNo);
						cell = row.createCell(0);
						cell.setCellValue(serialNo);
						cell = row.createCell(1);
						cell.setCellValue(stateName);
						cell = row.createCell(2);
						cell.setCellValue(cityName);
						cell = row.createCell(3);
						cell.setCellValue(cityValues.get("CREATED"));
						cell = row.createCell(4);
						cell.setCellValue(cityValues.get("REJECTED"));
						cell = row.createCell(5);
						cell.setCellValue(cityValues.get("SENT_TO_FIELD"));
						cell = row.createCell(6);
						cell.setCellValue(cityValues.get("FIELD_VERIFIED"));
						cell = row.createCell(7);
						cell.setCellValue(cityValues.get("APPROVED_FOR_SETUP"));
						cell = row.createCell(8);
						cell.setCellValue(cityValues.get("SETUP_DONE"));
						cell = row.createCell(9);
						cell.setCellValue(cityValues.get("TOTAL"));
						serialNo += 1;
					}
				} else {
					totalData = record.getValue().get("TOTAL");
				}
			}
			
			row = sheet.createRow(serialNo);
			cell = row.createCell(0);
			cell.setCellValue(serialNo);
			cell = row.createCell(1);
			cell = row.createCell(2);
			cell.setCellValue("TOTAL");
			cell = row.createCell(3);
			cell.setCellValue(totalData.get("CREATED"));
			cell = row.createCell(4);
			cell.setCellValue(totalData.get("REJECTED"));
			cell = row.createCell(5);
			cell.setCellValue(totalData.get("SENT_TO_FIELD"));
			cell = row.createCell(6);
			cell.setCellValue(totalData.get("FIELD_VERIFIED"));
			cell = row.createCell(7);
			cell.setCellValue(totalData.get("APPROVED_FOR_SETUP"));
			cell = row.createCell(8);
			cell.setCellValue(totalData.get("SETUP_DONE"));
			cell = row.createCell(9);
			cell.setCellValue(totalData.get("TOTAL")); 
			
			response.setHeader("Content-disposition", "attachment;filename=" + "ShutterSummary.xls");
	        response.setHeader("charset", "iso-8859-1");
	        response.setContentType("application/octet-stream");
	        response.setStatus(HttpServletResponse.SC_OK);
	        
	        ByteArrayOutputStream bos = new ByteArrayOutputStream();
	        try {
	            wb.write(bos);
	        } finally {
	            bos.close();
	        }
	        byte[] bytes = bos.toByteArray();
	        OutputStream outputStream = null;
	        try {
	            outputStream = response.getOutputStream();
	            outputStream.write(bytes, 0, bytes.length);
	            outputStream.flush();
	            outputStream.close();
	            response.flushBuffer();
	        } catch (Exception e) {
	        	logger.error("Exception", e.getMessage());
	        }
	        
		} catch (Exception e) {
			logger.error("Exception", e.getMessage());
		} 
	}
	
	@RequestMapping(value = "/fieldAgentsForm", method = RequestMethod.GET)
	public ModelAndView fieldAgentsForm(HttpSession session){
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}
		
		ModelAndView mav = new ModelAndView("fieldAgentsForm");
		return mav;
	}
	
	@RequestMapping(value = "/getFieldAgentsData", method = RequestMethod.GET)
	public @ResponseBody ModelMap getFieldAgentsData(HttpServletRequest request, HttpSession session){
		
		ModelMap model = new ModelMap();
		
		try {
			UserDetails userDetails = (UserDetails)session.getAttribute("userObj");
			if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
				model.addAttribute("result", "INVALID_USER");
				return model;
			}
			
			String filterBy = request.getParameter("filterBy");
			
			List<FieldAgent> tableData = shutterService.getFieldAgentsTable(filterBy);
			
			model.addAttribute("tableDataSummary", tableData);
		} catch(Exception e) {
			model.addAttribute("error", e.toString());
		}
		
		return model;
	}
	
	@RequestMapping(value="/deleteFieldAgentRecord",method=RequestMethod.POST)
	public @ResponseBody ModelMap deleteFieldAgentRecord(HttpServletRequest request,HttpSession session){
		ModelMap model = new ModelMap();
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");		
		if(UtilValidate.isEmpty(userDetails)){
			model.addAttribute("result", "USER_NOT_LOGGEDIN");
			return model;
		}
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}		
		if(UtilValidate.isEmpty(session)){
			model.addAttribute("result", "SESSION EXPIRED");
			return model;
		}
		
		Integer recordId = Integer.parseInt(request.getParameter("recordId"));
		String filterBy = request.getParameter("filterBy");
		
		try{			
			
			int response=shutterService.deleteFieldAgentsRecord(recordId);
			if(response > 0) {
				List<FieldAgent> tableData = shutterService.getFieldAgentsTable(filterBy);
				
				model.addAttribute("tableDataSummary", tableData);
				model.addAttribute("result", "SUCCESS");
			}else {
				model.addAttribute("result", "FAILED_TO_UPDATE");
			}
			
		} catch(Exception e){
			logger.error("Error:",e);
			model.addAttribute("error", e.getMessage());
		}
		
		return model;
	}
	
	@RequestMapping(value="/addFieldAgentRecord",method=RequestMethod.POST)
	public @ResponseBody ModelMap addFieldAgentRecord(HttpServletRequest request,HttpSession session){
		ModelMap model = new ModelMap();
		
		UserDetails userDetails = (UserDetails)session.getAttribute("userObj");		
		if(UtilValidate.isEmpty(userDetails)){
			model.addAttribute("result", "USER_NOT_LOGGEDIN");
			return model;
		}
		if(!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}		
		if(UtilValidate.isEmpty(session)){
			model.addAttribute("result", "SESSION EXPIRED");
			return model;
		}
		
		String manager = request.getParameter("name");
		String managerId = request.getParameter("userId");
		String managerPhone = request.getParameter("phoneNo");
		String stateCode = request.getParameter("stateCode");
		String city = request.getParameter("city");
		String category = request.getParameter("category");
		String localHead = request.getParameter("localHead");
		String filterBy = request.getParameter("filterBy");

		if(category == "FIELD_AGENT" && localHead.isEmpty()) {
			model.addAttribute("error", "Local Head Name Required");
			return model;
		}
		
		try{
			
			FieldAgent fieldAgent = new FieldAgent();
			
			String localHeadValue = (category.equals("FIELD_AGENT")) ? localHead : category;
			
			fieldAgent.setStateCode(stateCode);
			fieldAgent.setCity(city);
			fieldAgent.setLocalHead(localHeadValue);
			fieldAgent.setManager(manager);
			fieldAgent.setManagerId(managerId);
			fieldAgent.setManagerPhone(managerPhone);
			
			int response = shutterService.saveFieldAgent(fieldAgent);
			if(response > 0) {
				List<FieldAgent> tableData = shutterService.getFieldAgentsTable(filterBy);
				
				model.addAttribute("tableDataSummary", tableData);
				model.addAttribute("result", "SUCCESS");
			}else {
				model.addAttribute("result", "FAILED_TO_CREATE");
			}
			
		} catch(Exception e){
			logger.error("Error:",e);
			model.addAttribute("error", e.getMessage());
		}
		
		return model;
	}

	@RequestMapping(value = "/sendSMSForm", method = RequestMethod.GET)
	public ModelAndView sendSMSForm(HttpSession session) {
		ModelMap model = new ModelMap();

		UserDetails userDetails = (UserDetails) session.getAttribute("userObj");
		if (!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			ModelAndView mav = new ModelAndView("accessDenied");
			return mav;
		}

		try {
			Gson gson = new Gson();

			model.addAttribute("statesCitiesMap", gson.toJson(getStatesCitiesMapForNotification()));
			model.addAttribute("listOfStates", gson.toJson(getStatesDropdown(null)));

		} catch (Exception e) {
			logger.error("Error :", e);
			model.addAttribute("error", e.getMessage());
		}

		ModelAndView mav = new ModelAndView("sendSMSForm", "model", model);
		return mav;
	}

	@RequestMapping(value = "/downloadUsersByCity", method = RequestMethod.GET)
	public void downloadUsersByCity(HttpServletRequest request, HttpServletResponse response, HttpSession session) {

		UserDetails userDetails = (UserDetails) session.getAttribute("userObj");
		if (!userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			System.out.println("INVALID_USER");
			logger.error("INVALID_USER");
		}

		HashMap<String, HashMap<String, String>> usersByCity = new LinkedHashMap<>();

		String stateCode = request.getParameter("stateCode");
		String cityCode = request.getParameter("cityCode");

		if (UtilValidate.isNotEmpty(stateCode) && UtilValidate.isNotEmpty(cityCode)) {
			try {
				usersByCity = shutterService.getUsersByCity(stateCode, cityCode);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}
		}

		Workbook wb = new XSSFWorkbook();
		XSSFFont font = (XSSFFont) wb.createFont();
		font.setBold(true);
		CellStyle style = wb.createCellStyle();
		style.setFont(font);
		try {
			Sheet sheet = wb.createSheet("Users By City");
			Row row = sheet.createRow(0);
			Cell cell = row.createCell(0);
			cell.setCellValue("UserId");
			cell = row.createCell(1);
			cell.setCellValue("EmployeeId");
			cell = row.createCell(2);
			cell.setCellValue("Name");
			cell = row.createCell(3);
			cell.setCellValue("Department");
			cell = row.createCell(4);
			cell.setCellValue("JobTitle");
			cell = row.createCell(5);
			cell.setCellValue("Phone");

			int rowNo = 0;
			for (String userID: usersByCity.keySet()) {
				row = sheet.createRow(rowNo + 1);
				HashMap<String, String> eachRow = new HashMap<>();
				eachRow = usersByCity.get(userID);
				cell = row.createCell(0);
				cell.setCellValue(eachRow.get("UserId"));
				cell = row.createCell(1);
				cell.setCellValue(eachRow.get("EmployeeId"));
				cell = row.createCell(2);
				cell.setCellValue(eachRow.get("Name"));
				cell = row.createCell(3);
				cell.setCellValue(eachRow.get("Department"));
				cell = row.createCell(4);
				cell.setCellValue(eachRow.get("JobTitle"));
				cell = row.createCell(5);
				cell.setCellValue(eachRow.get("Phone"));
				
				rowNo++;
			}

			response.setHeader("Content-disposition", "attachment;filename=" + "UsersByCity.xls");
			response.setHeader("charset", "iso-8859-1");
			response.setContentType("application/octet-stream");
			response.setStatus(HttpServletResponse.SC_OK);

			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			try {
				wb.write(bos);
			} finally {
				bos.close();
			}
			byte[] bytes = bos.toByteArray();
			OutputStream outputStream = null;
			try {
				outputStream = response.getOutputStream();
				outputStream.write(bytes, 0, bytes.length);
				outputStream.flush();
				outputStream.close();
				response.flushBuffer();
			} catch (Exception e) {
				logger.error("Exception", e.getMessage());
			}

		} catch (Exception e) {
			logger.error("Exception", e.getMessage());
		}
	}

	@RequestMapping(value = "/sendSMSNotification", method = RequestMethod.POST)
	public @ResponseBody ModelMap sendSMSNotification(@RequestParam("file") MultipartFile file,
			HttpServletRequest request, HttpSession session) {
		ModelMap model = new ModelMap();

		UserDetails userDetails = (UserDetails) session.getAttribute("userObj");
		String userId = userDetails.getUserId();
		if (UtilValidate.isEmpty(userId) || !userDetails.getRoles().contains("ROLE_CRM_SHUTTER_ADMIN")) {
			model.addAttribute("result", "INVALID_USER");
			return model;
		}

		if (file.isEmpty()) {
			model.addAttribute("result", "Please select a file to upload");
			return model;
		}

		String message = request.getParameter("message");
		String stateCode = request.getParameter("stateCode");
		String cityCode = request.getParameter("cityCode");

		if (message.isEmpty()) {
			model.addAttribute("result", "Please enter valid message");
			return model;
		}
		HashMap<String, HashMap<String, String>> usersByCity = new LinkedHashMap<>();
		if (UtilValidate.isNotEmpty(stateCode) && UtilValidate.isNotEmpty(cityCode)) {
			try {
				usersByCity = shutterService.getUsersByCity(stateCode, cityCode);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}
		}

		try {

			XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
			XSSFSheet sheet = workbook.getSheetAt(0);

			Boolean headerFlag = false;
			Row header = sheet.getRow(0);
			if (header.getCell(0).toString().equalsIgnoreCase("UserId")
					&& header.getCell(1).toString().equalsIgnoreCase("EmployeeId")
					&& header.getCell(2).toString().equalsIgnoreCase("Name")
					&& header.getCell(3).toString().equalsIgnoreCase("Department")
					&& header.getCell(4).toString().equalsIgnoreCase("JobTitle")
					&& header.getCell(5).toString().equalsIgnoreCase("Phone")) {
				headerFlag = true;
			}

			if (headerFlag) {

				MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
				map.add("username", username);
				map.add("password", password);

				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

				final HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<MultiValueMap<String, String>>(map, headers);
				JSONObject jsonObject = null;
				List<String> phoneNumberIncorrect = new ArrayList<>();
				List<String> userIdMissmatch = new ArrayList<>();

				try {
					RestTemplate restTemplate = new RestTemplate();
					ResponseEntity<String> responseEntity = restTemplate.exchange(loginUrl, HttpMethod.POST, entity, String.class);

					if (responseEntity.getStatusCode() == HttpStatus.OK) {
						try {
							jsonObject = new JSONObject(responseEntity.getBody());
							String accessToken = jsonObject.getString("access");
							
							for (int i = 1; i <= sheet.getLastRowNum(); ++i) {
								Row row = sheet.getRow(i);
								String userID = row.getCell(0).toString();
								DataFormatter fmt = new DataFormatter();
								String phoneNumber = fmt.formatCellValue(row.getCell(5));
								
								try {								
									HashMap<String, String> userIdDetails = usersByCity.get(userID);
									if(userIdDetails.get("Phone").equals(phoneNumber)) {
										sendSMSCall(accessToken, phoneNumber, message);
									} else {
										phoneNumberIncorrect.add(userID);
									}
								} catch (Exception e) {
									userIdMissmatch.add(userID);
								}

							}

						} catch (JSONException e) {
							throw new RuntimeException("JSONException occurred");
						}
					}
				} catch (Exception e) {
					logger.error("Error :", e);
				}
				model.addAttribute("result", "Message Sent");
				model.addAttribute("phoneNumberIncorrect", phoneNumberIncorrect);
				model.addAttribute("userIdMissmatch", userIdMissmatch);
				
			} else {
				model.addAttribute("result", "Incorrect order");
			}

			return model;

		} catch (Exception e) {
			model.addAttribute("error", e.toString());
			return model;
		}

	}
}
