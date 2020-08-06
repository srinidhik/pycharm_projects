package com.optival.io.web;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
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
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.medplus.accounts.store.service.impl.CommonService;
import com.medplus.common.utility.UtilValidate;
//import com.medplus.constants.SmsTemplates;
import com.medplus.imageapi.constants.ImageType;
import com.medplus.imageapi.domain.ImageFile;
import com.medplus.imageapi.domain.ImageInfo;
import com.medplus.imageapi.domain.ImageServer;
import com.medplus.imageapi.exception.ImageProcessingException;
import com.medplus.imageapi.service.ImageProcessService;
import com.medplus.shutter.domain.Competitor;
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
import com.medplus.ums.model.UserDetails;
import com.medplus.ums.service.UserService;
import com.medplus.ums.service.impl.LdapAuthenticationMangerImpl;
import com.optival.io.domain.CompetitorResponse;

import redis.clients.jedis.Jedis;

@Controller
@RequestMapping("/shutter-app")
public class MobileShutterController {
	
	@Value("${com.medplus.standalone.loginUrl}")
	private String loginUrl;
	
	@Value("${com.medplus.standalone.username}")
	private String username;
	
	@Value("${com.medplus.standalone.password}")
	private String password;
	
	@Value("${com.medplus.standalone.SMSUrl}")
	private String SMSUrl;
	
	@Value("${com.medplus.standalone.usageReportUrl}")
	private String usageReportUrl;
	
	@Value("${com.medplus.standalone.isProduction}")
	private Boolean isProduction;
	
private static final Logger LOGGER = LoggerFactory.getLogger(MobileShutterController.class);
	
	@Autowired
	LdapAuthenticationMangerImpl ldapAuthenticationMangerImpl;
	
	@Autowired
	UserService userService;
	
	@Autowired
	ShutterService shutterService;
	
	@Autowired
	CommonService commonService;
	
	@Autowired
	GooglePlaceService googlePlaceService;
	
	@Autowired
	ImageProcessService imageProcessService;
	
	private static final String STATUS = "STATUS";
	private static final String FAILURE = "FAILURE";
	private static final String SUCCESS = "SUCCESS";
	private static final String PENDING = "PENDING";
	private static final String DATA = "DATA";
	private static final String TOTAL_RECORDS = "TOTAL_RECORDS";
	private static final String STATUS_COUNT = "STATUS_COUNT";
	private static final String PHARMACY_CHAIN_MATCH = "PHARMACY_CHAIN_MATCH";
	private static final String COMPETITORS = "COMPETITORS";
	private static final List<String> STORENAMES = Arrays.asList("Pharmacy", "Medicals", "Medical", "Store", "Stores", "Hall", "Druggists", "Chemists", "General", "Surgicals", "Surgical", "clinic", "clinics", "Agency", "Agencies", "Pharma", "Drug");

	@RequestMapping(value = "/authUser", method = RequestMethod.POST)
	public @ResponseBody Map<String, String> authenticateUser(@RequestBody UserDetails userDetails) {
//		Map<String, String> response = new HashMap<>(); 
//		if (UtilValidate.isEmpty(userDetails)) {
//			response.put(STATUS, FAILURE);
//			response.put(DATA, "Invalid UserDetails");
//			return response;
//		}
//		//user type contains usertype and app version
//		if (UtilValidate.isEmpty(userDetails.getUserType())) {
//			response.put(STATUS, FAILURE);
//			response.put(DATA, "Please Update your app to login");
//			return response;
//		}
//		try {
//			if (ldapAuthenticationMangerImpl.verifyPassword(userDetails.getUserId(), userDetails.getPassword())) {
//				UserDetails userInfo = userService.getUserDetails(userDetails.getUserId(),"crm");
//				LOGGER.debug("userinfffo {}",userInfo);
//				if(UtilValidate.isNotEmpty(userInfo) && UtilValidate.isNotEmpty(userInfo.getRoles()) && userInfo.getRoles().contains("ROLE_CRM_SHUTTER_FIELD_VERIFICATION")) {
//					response.put("USERTYPE","A");						
//			     }else {
//					response.put("USERTYPE","U");
//		       	}
//				response.put(STATUS, SUCCESS);
//				response.put(DATA, "User validated Successfully");
//			}else{
//				response.put(STATUS, FAILURE);
//				response.put(DATA, "Authentication failed.");
//			}
//		} catch (UserManagementException e) {
//			response.put(STATUS, FAILURE);
//			response.put(DATA, e.getMessage());
//			LOGGER.error("UserManagementException {} ", e.getMessage());
//		} catch (Exception e) {
//			LOGGER.error("Exception", e);
//			response.put(STATUS, FAILURE);
//			response.put(DATA, "Server Experiancing Some Problem while Authenticating");
//		}
//		return response;
		
		Map<String, String> response = new HashMap<>(); 
		response.put(STATUS, FAILURE);
		response.put(DATA, "Please use OHS Outlet Operations");
		return response;
		
	}
	
	@RequestMapping(value = "/saveShutterInfo", method = RequestMethod.POST)
	public @ResponseBody Map<String, String> saveShutterInfo(
			@RequestBody Map<String,Object> shutterInfoMap) {
		
		LOGGER.debug("shutterInfoMap {}", shutterInfoMap);
		
		usageReport("Shutter", "Shutter Upload");
		
		Map<String, String> response = new HashMap<>();
		if (UtilValidate.isEmpty(shutterInfoMap)) {
			response.put(STATUS, FAILURE);
			response.put(DATA, "Empty Shutter Data");
			return response;
		}
		String shutterInfo = (String)shutterInfoMap.get("shutterInfo");
		if (UtilValidate.isEmpty(shutterInfo)) {
			response.put(STATUS, FAILURE);
			response.put(DATA, "Inavalid Data");
			return response;
		}
		
		List<Map<String,Object>> imageFilesList= (List<Map<String,Object>>)shutterInfoMap.get("images");
		if(UtilValidate.isEmpty(imageFilesList)){
			response.put(STATUS, FAILURE);
			response.put(DATA, "Empty image Info");
			return response;
		}
		List<ImageInfo> imageInfoList = new ArrayList<>();
		imageFilesList.forEach(eachImage -> {
			ImageInfo imageFileInfo = new ImageInfo();
			imageFileInfo.setImagePath((String) eachImage.get("imagePath"));
			imageFileInfo.setImageServerName((String) eachImage.get("imageServerName"));
			imageFileInfo.setOriginalImageName((String) eachImage.get("originalImageName"));
			imageFileInfo.setThumbnailPath((String) eachImage.get("thumbnailPath"));
			imageFileInfo.setStatus("A");
			imageInfoList.add(imageFileInfo);
		}
        );
		
		try{
			List<MultipartFile> imageFileList = new ArrayList<>();
			Shutter shutter =  new Gson().fromJson(shutterInfo, Shutter.class);
			if(UtilValidate.isEmpty(shutter) || UtilValidate.isEmpty(shutter.getLocality())){
				response.put(STATUS, FAILURE);
				response.put(DATA, "Invalid Shutter or Locality info");
				return response;
			}
			LOGGER.info("shutter:{} , imageFileList: {} ",shutter,imageFileList);
			ImageFile imageFile = new ImageFile();
			imageFile.setImageServerName(imageInfoList.get(0).getImageServerName());
			imageFile.setImageInfoList(imageInfoList);
			imageFile.setImageType(ImageType.STORE_SHUTTER_IMAGE);
			imageFile.setCreatedBy(shutter.getUserId());
			shutter.setUserType("I");
			shutter.setStatus("I");
			shutter.setCreatedBy(shutter.getUserId());
			if(UtilValidate.isEmpty(shutter.getUserMobileNo())) {
				UserDetails userInfo = userService.getUserDetails(shutter.getUserId(),"crm");
				shutter.setUserMobileNo(UtilValidate.isNotEmpty(userInfo) && UtilValidate.isNotEmpty(userInfo.getPhone()) ? userInfo.getPhone() : null);
			}
			String locality=shutter.getLocality();
			Map<String,String> statesList=commonService.getStates();
            if(UtilValidate.isNotEmpty(statesList) && statesList.containsKey(locality.toUpperCase())){
            	shutter.setLocality(statesList.get(locality.toUpperCase()));
            } else if (UtilValidate.isNotEmpty(statesList) && statesList.containsValue(locality.toUpperCase())){
            	shutter.setLocality(locality);
            }
            String state = null;
            if(!locality.isEmpty() && locality.length() == 2) {
    			HashMap<String, String> states = shutterService.getStates();
    			state = states.get(locality);
    		} else {
    			state = locality;
    		}
            shutter.setState(state);
            GoogleLocation googleLocation = googlePlaceService.getLocationForLatLong(shutter.getLatitude(), shutter.getLongitude());
			LOGGER.info("googleLocation :{}",googleLocation);
			shutter.setGeoAddress(UtilValidate.isNotEmpty(googleLocation) && UtilValidate.isNotEmpty(googleLocation.getLocation()) ? googleLocation.getLocation() : null);
            shutterService.saveShutterInfo(shutter, imageFile);
			
    		newShutterSMS(shutter);

            
		}catch(ShutterException se){
			LOGGER.error("Exception in save Shutter Image Info: {}", se.getMessage());
			response.put(STATUS, FAILURE);
			response.put(DATA, "Faild to Uploded Shutter Info");
			return response;
		}catch(Exception e){
			LOGGER.error("Exception in save Shutter Image Info", e);
			response.put(STATUS, FAILURE);
			response.put(DATA, "Faild to Uploded Shutter Info.");
			return response;
		}
		response.put(STATUS, SUCCESS);
		response.put(DATA, "Uploded Successfully");		
		return response;
	}
	
	private static BufferedImage decodeToImage(String imageString) {

		BufferedImage image = null;
		try {
			if (UtilValidate.isNotEmpty(imageString)) {
				ByteArrayInputStream bis = new ByteArrayInputStream(new Base64().decode(imageString.getBytes()));
				image = ImageIO.read(bis);
				bis.close();
			}
		} catch (Exception e) {
			LOGGER.error("Exception ", e);
		}
		return image;
	}
	
	@RequestMapping(value="/getShutterRecords", method = RequestMethod.POST)
	public @ResponseBody Map<String,Object> getShutterRecords(@RequestBody ShutterSearchCriteria ssc){
		LOGGER.info("ShutterSearchCriteria:{} ",ssc);
		
		Long startLimit = new Long(0);
		if(ssc.getLimitFrom().equals(startLimit)) {
			usageReport("Shutter", "Shutter Dashboard");
		}
		
		Map<String,Object> response= new HashMap<>();
		if(UtilValidate.isEmpty(ssc)){
			response.put(STATUS,FAILURE);
			response.put(DATA,"Unable to process your request");
			return response;
		}
		try {
			ssc.setImageInfoRequired(true);
			ShutterInfo shutterInfo = shutterService.getShutterInfo(ssc);
			
			if(UtilValidate.isNotEmpty(shutterInfo)){
				response.put(STATUS, SUCCESS);
				response.put(DATA, shutterInfo.getShutterInfoList());
				response.put(STATUS_COUNT, shutterService.getShuttersCountByStatus(ssc));
				response.put(TOTAL_RECORDS, shutterInfo.getTolatRecords());
				return response;
			}
		}catch(ShutterException se){
			LOGGER.error("Exception in get Shutter Info: {}", se.getMessage());
			response.put(STATUS, FAILURE);
			response.put(DATA, "Faild to Uploded Shutter Info.");
			return response;
		}catch(Exception e){
			LOGGER.error("Exception in get Shutter Info", e);
			response.put(STATUS, FAILURE);
			response.put(DATA, "Unable to process your request.");
			return response;
		}
		response.put(STATUS,FAILURE);
		response.put(DATA,"Unable to process your request");
 		return response;
 	}
	
	@RequestMapping(value = "/updateShutterInfo", method = RequestMethod.POST)
	public @ResponseBody Map<String, String> updateShutterInfo(
			@RequestBody Map<String,Object> shutterInfoMap) {
		
		LOGGER.debug("shutterInfoMap {}", shutterInfoMap);
		Map<String, String> response = new HashMap<>();
		if (UtilValidate.isEmpty(shutterInfoMap)) {
			response.put(STATUS, FAILURE);
			response.put(DATA, "Empty Shutter Data");
			return response;
		}
		String shutterInfo = (String)shutterInfoMap.get("shutterInfo");
		if (UtilValidate.isEmpty(shutterInfo)) {
			response.put(STATUS, FAILURE);
			response.put(DATA, "Inavalid Data");
			return response;
		}
		List<Map<String,Object>> imageFilesList= (List<Map<String,Object>>)shutterInfoMap.get("images");

		List<String> deleteImageIds=(List<String>)shutterInfoMap.get("imageIds");		
		try{
			List<MultipartFile> imageFileList = new ArrayList<>();
			ImageFile imageFile = new ImageFile();
			Shutter shutter =  new Gson().fromJson(shutterInfo, Shutter.class);
			if(UtilValidate.isNotEmpty(imageFilesList)) {
				List<ImageInfo> imageInfoList = new ArrayList<>();
				imageFilesList.forEach(eachImage -> {
					ImageInfo imageFileInfo = new ImageInfo();
					imageFileInfo.setImagePath((String) eachImage.get("imagePath"));
					imageFileInfo.setImageServerName((String) eachImage.get("imageServerName"));
					imageFileInfo.setOriginalImageName((String) eachImage.get("originalImageName"));
					imageFileInfo.setThumbnailPath((String) eachImage.get("thumbnailPath"));
					imageFileInfo.setStatus("A");
					imageInfoList.add(imageFileInfo);
				});
						LOGGER.debug(" imageIds: {}",deleteImageIds);
						imageFile.setImageInfoList(imageInfoList);
						if(UtilValidate.isNotEmpty(imageInfoList)) {
						imageFile.setImageServerName(imageInfoList.get(0).getImageServerName());
						}
						imageFile.setRecordId(shutter.getShutterId());
						imageFile.setImageType(ImageType.STORE_SHUTTER_IMAGE);
						imageFile.setCreatedBy(shutter.getModifiedBy());
						imageFile.setSubfolderName("shutterimages");
				 }
			shutterService.saveShutterImageInfo(imageFile,deleteImageIds,shutter);
    		newShutterSMS(shutter);

		}catch(ShutterException se){
			LOGGER.error("Exception in save Shutter Image Info: {}", se.getMessage());
			response.put(STATUS, FAILURE);
			response.put(DATA, "Faild to Uploded Shutter Info");
			return response;
		}catch(Exception e){
			LOGGER.error("Exception in save Shutter Image Info", e);
			response.put(STATUS, FAILURE);
			response.put(DATA, "Faild to Uploded Shutter Info.");
			return response;
		}
		response.put(STATUS, SUCCESS);
		response.put(DATA, "Uploded Successfully");
		return response;
	}
	
	@RequestMapping(value="/getShutterComments", method = RequestMethod.POST)
	public @ResponseBody Map<String,Object> getShutterComments(@RequestBody Map<String,String> requestMap){
		Map<String,Object> response= new HashMap<>();
		String shutterId=requestMap.get("shutterId");
		if(UtilValidate.isEmpty(shutterId)){
			response.put(STATUS,FAILURE);
			response.put(DATA,"Unable to process your request");
			return response;
		}
		try {
			List<ShutterComments> shutterComments = shutterService.getShutterComments(Long.valueOf(shutterId));
			if(UtilValidate.isNotEmpty(shutterComments)){
				response.put(STATUS, SUCCESS);
				response.put(DATA, shutterComments);
				return response;
			}
		}catch(ShutterException se){
			LOGGER.error("Exception in get Shutter Info: {}", se.getMessage());
			response.put(STATUS, FAILURE);
			response.put(DATA, "Failed to get Shutter Comments.");
			return response;
		}catch(Exception e){
			LOGGER.error("Exception in get Shutter Info", e);
			response.put(STATUS, FAILURE);
			response.put(DATA, "Unable to process your request.");
			return response;
		}
		response.put(STATUS,FAILURE);
		response.put(DATA,"Unable to process your request");
 		return response;
 	}
	@RequestMapping(value="/getGeoAddress", method = RequestMethod.POST)
	public @ResponseBody Map<String,Object> getGeoAddress(@RequestBody Map<String,String> requestMap){
		Map<String,Object> response= new HashMap<>();
		String latitude=requestMap.get("latitude");
		String longitude=requestMap.get("longitude");
		//latitude, longitude
		if(UtilValidate.isEmpty(longitude)){
			response.put(STATUS,FAILURE);
			response.put(DATA,"Unable to process your request");
			return response;
		}
		try {
			GoogleLocation googleLocation = googlePlaceService.getLocationForLatLong(latitude, longitude);
			LOGGER.info("googleLocation :{}",googleLocation);
			if(UtilValidate.isNotEmpty(googleLocation)){
				response.put(STATUS, SUCCESS);
				response.put(DATA, googleLocation);
				return response;
			}
		}catch(Exception e){
			LOGGER.error("Exception in get Shutter Info", e);
			response.put(STATUS, FAILURE);
			response.put(DATA, "Unable to process your request.");
			return response;
		}
		response.put(STATUS, FAILURE);
		response.put(DATA, "Unable to process your request.");
		return response;
 	}
	
	@GetMapping(value="/getImageServer")
	public @ResponseBody ImageServer getImageServer(HttpServletRequest request){
		String imageType = request.getParameter("imageType");
		ImageServer imageServer = null;
		try {
			if(imageType.equalsIgnoreCase("SI"))
				imageServer = imageProcessService.getImageServer("SHUTTER", "MOBILE_APP", ImageType.STORE_SHUTTER_IMAGE);	
			else
				imageServer = imageProcessService.getImageServer("SHUTTER", "MOBILE_APP", ImageType.COMPETITOR_IMAGE);
		} catch (ImageProcessingException e) {
			LOGGER.error("Exception", e);
			if(isProduction) {
				Jedis jedis = new Jedis("10.119.0.27");
				System.out.println("Connection to server sucessfully");
				System.out.println("Server is running: " + jedis.ping());
				jedis.select(3);
				jedis.lpush("AVAILABLE_IMAGE_SERVERS:1", "img1");
	
		 		List<String> list = jedis.lrange("AVAILABLE_IMAGE_SERVERS:1", 0, 5);
				for (int i = 0; i < list.size(); i++) {
					System.out.println("Stored string in redis:: " + list.get(i));
				}
				
				jedis.close();
			}
		}
		return imageServer;
	}

	
	@RequestMapping(value = "/saveCompetitorInfo", method = RequestMethod.POST)
	public @ResponseBody Map<String, String> saveCompetitorInfo(
			@RequestBody Map<String,Object> competitorInfoMap) {
		
//		LOGGER.debug("CompetitorInfoMap {}", competitorInfoMap);
		
		usageReport("Competitor", "Competitor Upload");
		
		Map<String, String> response = new HashMap<>();
		if (UtilValidate.isEmpty(competitorInfoMap)) {
			response.put(STATUS, FAILURE);
			response.put(DATA, "Empty Shutter Data");
			return response;
		}
		String competitorInfo = (String)competitorInfoMap.get("competitorInfo");
		Competitor competitor =  new Gson().fromJson(competitorInfo, Competitor.class);
		Boolean verifyDuplicate = (Boolean)competitorInfoMap.get("checkDuplicate");
		if (UtilValidate.isEmpty(competitorInfo)) {
			response.put(STATUS, FAILURE);
			response.put(DATA, "Inavalid Data");
			return response;
		}
		
		List<Map<String,Object>> imageFilesList= (List<Map<String,Object>>)competitorInfoMap.get("images");
		if(UtilValidate.isEmpty(imageFilesList)){
			response.put(STATUS, FAILURE);
			response.put(DATA, "Empty image Info");
			return response;
		}
		
		if(verifyDuplicate) {
			CompetitorSearchCriteria cscLatLong = new CompetitorSearchCriteria();
			Double lat = Double.parseDouble(competitor.getLatitude());
			Double lng = Double.parseDouble(competitor.getLongitude());
			
			cscLatLong.setLatitude(Double.toString((int)(Math.pow(10, 5) * lat)/Math.pow(10, 5)));
			cscLatLong.setLongitude(Double.toString((int)(Math.pow(10, 5) * lng)/Math.pow(10, 5)));
			cscLatLong.setRadiusFlag(true);
			cscLatLong.setRadius("3");
			cscLatLong.setStatus("S");
			CompetitorInfo competitorInfoList = getDuplicateCompetitorRecords(cscLatLong);
			CompetitorResponse duplicate = checkDuplicates(competitorInfoList,competitor.getOutletName(),competitor.getPharmacyChain());
			if(duplicate.getDuplicates().size() > 0) {
				Gson gson = new Gson();
				response.put(STATUS, PENDING);
				response.put("COMPETITORS_STATUS", duplicate.getStatus());
				response.put(DATA, gson.toJson(duplicate.getDuplicates().get(0)));
				return response;
			}		
		}
		
		List<ImageInfo> imageInfoList = new ArrayList<>();
		imageFilesList.forEach(eachImage -> {
			ImageInfo imageFileInfo = new ImageInfo();
			imageFileInfo.setImagePath((String) eachImage.get("imagePath"));
			imageFileInfo.setImageServerName((String) eachImage.get("imageServerName"));
			imageFileInfo.setOriginalImageName((String) eachImage.get("originalImageName"));
			imageFileInfo.setThumbnailPath((String) eachImage.get("thumbnailPath"));
			imageFileInfo.setStatus("A");
			imageInfoList.add(imageFileInfo);
		}
        );
		
		try{
			List<MultipartFile> imageFileList = new ArrayList<>();
			if(UtilValidate.isEmpty(competitor) || UtilValidate.isEmpty(competitor.getLocality())){
				response.put(STATUS, FAILURE);
				response.put(DATA, "Invalid Shutter or Locality info");
				return response;
			}
			
			LOGGER.info("competitor:{} , imageFileList: {} ",competitor,imageFileList);
			ImageFile imageFile = new ImageFile();
			imageFile.setImageServerName(imageInfoList.get(0).getImageServerName());
			imageFile.setImageInfoList(imageInfoList);
			imageFile.setImageType(ImageType.COMPETITOR_IMAGE);
			imageFile.setCreatedBy(competitor.getUserId());
			competitor.setUserType("I");
			competitor.setStatus("I");
			competitor.setCreatedBy(competitor.getUserId());
			if(UtilValidate.isEmpty(competitor.getUserMobileNo())) {
				UserDetails userInfo = userService.getUserDetails(competitor.getUserId(),"crm");
				competitor.setUserMobileNo(UtilValidate.isNotEmpty(userInfo) && UtilValidate.isNotEmpty(userInfo.getPhone()) ? userInfo.getPhone() : null);
			}
			String locality=competitor.getLocality();
			Map<String,String> statesList=commonService.getStates();
            if(UtilValidate.isNotEmpty(statesList) && statesList.containsKey(locality.toUpperCase())){
            	competitor.setLocality(statesList.get(locality.toUpperCase()));
            } else if (UtilValidate.isNotEmpty(statesList) && statesList.containsValue(locality.toUpperCase())){
            	competitor.setLocality(locality);
            }
           GoogleLocation googleLocation = googlePlaceService.getLocationForLatLong(competitor.getLatitude(), competitor.getLongitude());
//			LOGGER.info("googleLocation :{}",googleLocation);
            competitor.setGeoAddress(UtilValidate.isNotEmpty(googleLocation) && UtilValidate.isNotEmpty(googleLocation.getLocation()) ? googleLocation.getLocation() : null);			
            
            String latLong = competitor.getLatitude() + "," + competitor.getLongitude();
			SolrDocumentList solrDocumentList = StoresCoreHelper.getNearestStores(latLong, 1.5, null, true);
            if(solrDocumentList.size() > 0) {	
	           competitor.setMedplusStoreId(solrDocumentList.get(0).get("storeId_s").toString());
			} else {
			   competitor.setMedplusStoreId("None");
			}
            if(UtilValidate.isEmpty(competitor.getOutletName())) {
                competitor.setOutletName(competitor.getPharmacyChain());
            }
            shutterService.saveCompetitorInfo(competitor, imageFile);
			
		}catch(ShutterException se){
//			LOGGER.error("Exception in save Shutter Image Info: {}", se.getMessage());
			response.put(STATUS, FAILURE);
			response.put(DATA, "Faild to Uploded Shutter Info");
			return response;
		}catch(Exception e){
//			LOGGER.error("Exception in save Shutter Image Info", e);
			response.put(STATUS, FAILURE);
			response.put(DATA, "Faild to Uploded Shutter Info.");
			return response;
		}
		response.put(STATUS, SUCCESS);
		response.put(DATA, "Uploded Successfully");
		return response;
	}
	
	public CompetitorResponse checkDuplicates(CompetitorInfo competitorInfoList, String outletName, String pharmacyChain) {
		CompetitorResponse response = new CompetitorResponse();
		List<Competitor> competitor = new ArrayList<Competitor>();
		if(competitorInfoList.getTotalRecords() > 0){
			List<Competitor> competitorList = competitorInfoList.getCompetitorInfoList();
			for(int competitorData = 0; competitorData < competitorList.size(); competitorData++) {
				
				if(!pharmacyChain.contains("other") && pharmacyChain.equals(competitorList.get(competitorData).getPharmacyChain())) {
					competitor = new ArrayList<Competitor>();;
					competitor.add(competitorList.get(competitorData));
					response.setStatus(PHARMACY_CHAIN_MATCH);
					response.setDuplicates(competitor);
					return response;
				}
				
				if(pharmacyChain.contains("other")) {
					outletName = nameExtractor(outletName);
					if(outletName.toLowerCase().contains(nameExtractor(competitorList.get(competitorData).getOutletName()).toLowerCase()) || nameExtractor(competitorList.get(competitorData).getOutletName()).toLowerCase().contains(outletName.toLowerCase())) {
						competitor.add(competitorList.get(competitorData));
					}
				}
			}
		}
		response.setStatus(COMPETITORS);
		response.setDuplicates(competitor);
		return response;
	}
	
	public String nameExtractor(String name) {
		for(int index = 0 ; index < STORENAMES.size() ; index++) {
			if(name.toLowerCase().contains(STORENAMES.get(index).toLowerCase())){
				name.replace("(?i)"+STORENAMES.get(index), "");
			}
		}
		return name;
	}
	
	public CompetitorInfo getDuplicateCompetitorRecords(CompetitorSearchCriteria csc) {
		CompetitorInfo competitorInfoList = new CompetitorInfo();
		try {
			csc.setImageInfoRequired(true);
			competitorInfoList = shutterService.getCompetitorInfo(csc);
			return competitorInfoList;
		}catch(ShutterException se){
			LOGGER.error("Exception in get Shutter Info: {}", se.getMessage());
		}catch(Exception e){
			LOGGER.error("Exception in get Shutter Info", e);
		}
		
		return competitorInfoList;
	}
	
	@RequestMapping(value="/getCompetitorRecords", method = RequestMethod.POST)
	public @ResponseBody Map<String,Object> getCompetitorRecords(@RequestBody CompetitorSearchCriteria csc){
//		LOGGER.info("CompetitorSearchCriteria:{} ",csc);
		
		Long startLimit = new Long(0);
		if(csc.getLimitFrom().equals(startLimit)) {
			usageReport("Competitor", "Competitor Dashboard");
		}
		
		Map<String,Object> response= new HashMap<>();
		if(UtilValidate.isEmpty(csc)){
			response.put(STATUS,FAILURE);
			response.put(DATA,"Unable to process your request");
			return response;
		}
		try {
			csc.setImageInfoRequired(true);
			CompetitorInfo competitorInfo = shutterService.getCompetitorInfo(csc);
			
			if(UtilValidate.isNotEmpty(competitorInfo)){
				response.put(STATUS, SUCCESS);
				response.put(DATA, competitorInfo.getCompetitorInfoList());
				response.put(TOTAL_RECORDS, competitorInfo.getTotalRecords());
				response.put(STATUS_COUNT, shutterService.getCompetitorsCountByStatus(csc));
				return response;
			}
		}catch(ShutterException se){
			LOGGER.error("Exception in get Shutter Info: {}", se.getMessage());
			response.put(STATUS, FAILURE);
			response.put(DATA, "Faild to Uploded Shutter Info.");
			return response;
		}catch(Exception e){
			LOGGER.error("Exception in get Shutter Info", e);
			response.put(STATUS, FAILURE);
			response.put(DATA, "Unable to process your request.");
			return response;
		}
		response.put(STATUS,FAILURE);
		response.put(DATA,"Unable to process your request");
 		return response;
 	}
	

	@RequestMapping(value="/updateCompetitorStatus",method=RequestMethod.POST)
	public @ResponseBody Map<String,String> updateCompetitorStatus(
			@RequestBody Map<String,Object> competitorInfoMap){
		
		
		Map<String, String> response = new HashMap<>();
		if (UtilValidate.isEmpty(competitorInfoMap)) {
			response.put(STATUS, FAILURE);
			response.put(DATA, "Empty Shutter Data");
			return response;
		}
		
		String competitorId = (String)competitorInfoMap.get("competitorId");
		String status = (String)competitorInfoMap.get("status");
		String modifiedBy = (String)competitorInfoMap.get("modifiedBy");
		Boolean verifyDuplicate = (Boolean)competitorInfoMap.get("checkDuplicate");
		String comment = (String)competitorInfoMap.get("comment");
		
		if(UtilValidate.isEmpty(competitorId)){
			response.put(STATUS, "INVALID_COMPETITOR_ID");
			return response;
		}
		if(UtilValidate.isEmpty(status)){
			response.put(STATUS, "STATUS_CANT_BE_EMPTY");
			return response;
		}
		
		if(status.equals("S")) {
			if(verifyDuplicate) {
				
				CompetitorSearchCriteria csc = new CompetitorSearchCriteria();
				csc.setCompetitorId(Long.valueOf(competitorId));
				CompetitorInfo competitorInfo = getDuplicateCompetitorRecords(csc);
				Competitor competitor = competitorInfo.getCompetitorInfoList().get(0);
				
				csc.setCompetitorId(null);
				Double lat = Double.parseDouble(competitor.getLatitude());
				Double lng = Double.parseDouble(competitor.getLongitude());
				
				csc.setLatitude(Double.toString((int)(Math.pow(10, 5) *  lat)/Math.pow(10, 5)));
				csc.setLongitude(Double.toString((int)(Math.pow(10, 5) *  lng)/Math.pow(10, 5)));
				csc.setRadiusFlag(true);
				csc.setRadius("3");
				competitorInfo = getDuplicateCompetitorRecords(csc);
				CompetitorResponse duplicate = checkDuplicates(competitorInfo,competitor.getOutletName(),competitor.getPharmacyChain());
				if(duplicate.getDuplicates().size() > 0) {
					Gson gson = new Gson();
					response.put(STATUS, PENDING);
					response.put("COMPETITORS_STATUS", duplicate.getStatus());					
					response.put(DATA, gson.toJson(duplicate.getDuplicates()));
					return response;
				}	
			}
		}
		
		try{
			Competitor updCompetitor =  new Competitor();
			updCompetitor.setCompetitorId(Long.valueOf(competitorId));
			updCompetitor.setStatus(status);
			updCompetitor.setModifiedBy(modifiedBy);
			updCompetitor.setComment(comment);
			
			int resp=shutterService.updateCompetitorInfo(updCompetitor);
			if(resp > 0) { 
				response.put(STATUS, "SUCCESS");
				return response;
			}else {
				response.put(STATUS, "FAILED_TO_UPDATE");
				return response;
			}
		} catch(ShutterException e){
			 LOGGER.error("Shutter Exception : ",e);
			 response.put(STATUS, e.getMessage());
				return response;
		} catch(Exception e){
			 LOGGER.error("Error:",e);
			 response.put(STATUS, "COMPETITOR_UPDATION_FAILED");
				return response;
		}
	}
	
	@RequestMapping(value="/getMedplusRecords", method=RequestMethod.POST)
	public @ResponseBody Map<String,Object> medplusCompetitorDashboard(
			@RequestBody Map<String,Object> search){
		
		String city = (search.get("city") != "") ? (String) search.get("city") : "HYDERABAD";
		String pincode = (search.get("pincode") != "") ? (String) search.get("pincode") : "";
		Integer limitFrom = (Integer) search.get("limitFrom");
		
		String searchQuery = "";
		city = city.replaceAll("\\s+","");
		
		Map<String, Object> response = new HashMap<>();
		
		List<HashMap<String, String>> list = new ArrayList<>();
	
		try {
			if(!pincode.isEmpty()) {
				searchQuery = "pincode_s:" + pincode + " AND status_s:A";
			}else {
				searchQuery = "exactCity:" + city + " AND status_s:A";
			}
			
			List<EngineStores> storeDetailsList = StoresCoreHelper.getStoreDetails(searchQuery, limitFrom, 10);
		
			for (EngineStores eachstore : storeDetailsList) {
		
				HashMap<String, String> data = new HashMap<String, String>();
				data.put("storeId", eachstore.getStoreId());
				data.put("name", eachstore.getStoreName());
				data.put("city", eachstore.getCity());
				data.put("pincode", eachstore.getPincode());
				data.put("address", eachstore.getAddress());
				data.put("latitude", eachstore.getLocationLatLong().split(",")[0]);
				data.put("longitude", eachstore.getLocationLatLong().split(",")[1]);
				list.add(data);
		
			}
			
			response.put(STATUS, SUCCESS);
			response.put(DATA, list);
	
		} catch(Exception e){
			LOGGER.error("Shutter Exception : ",e);
			response.put(STATUS, e.getMessage());
		}
	
		return response;

	}
	
	@RequestMapping(value="/getNearbyCompetitors", method=RequestMethod.POST)
	public @ResponseBody Map<String,Object> getNearbyCompetitors(
			@RequestBody Map<String,Object> search) {
		
		Map<String, Object> response = new HashMap<>();
		
		String storeId = (String) search.get("storeId");
		
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
			
			Gson gson = new Gson();
			
			response.put(STATUS, SUCCESS);
			response.put("STORE_DETAILS", data);
			response.put(DATA, gson.toJson(competitorsList));
			
			
		}catch (Exception e) {
			LOGGER.error("Shutter Exception : ",e);
			response.put(STATUS, e.getMessage());
		}
		
		return response; 
	}
	
	@RequestMapping(value="/getCitiesData", method=RequestMethod.POST)
	public @ResponseBody Map<String,Object> getCitiesData() {

		Map<String, Object> response = new HashMap<>();
		
		try {
			response.put(STATUS, SUCCESS);
			HashMap<String, List<String>> solrData = shutterService.getSolrData();
			response.put(DATA, solrData);
					
		}catch (Exception e) {
			LOGGER.error("Shutter Exception : ",e);
			response.put(STATUS, e.getMessage());
		}
		
		return response;
	}
	
	@GetMapping(value="/getCities")
	public @ResponseBody Map<String,Object> getCities(HttpServletRequest request){
		String state = request.getParameter("state");
		Map<String, Object> response = new HashMap<>();
		try {
			HashMap<String, List<String>> citiesMap = shutterService.getCities(state);
			List<String> cities = citiesMap.get(state);
			
			response.put(STATUS, SUCCESS);
			response.put(DATA, cities);
					
		}catch (Exception e) {
			LOGGER.error("Shutter Exception : ",e);
			response.put(STATUS, e.getMessage());
		}
		return response;
	}
	
	private String sendSMS(String accessToken, String phoneNumber, String message) {
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
		
	private String newShutterSMS(Shutter shutter) {
		
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
			
			HashMap<String, HashMap<String, List<FieldAgent>>> localHeads = shutterService.getAgents(shutter.getLocality(), "", "HEAD");
			List<FieldAgent> fieldAgents = new LinkedList<>();			
			HashMap<String, List<FieldAgent>> stateAgents = localHeads.get(shutter.getLocality());
			for(String cityName: stateAgents.keySet()) {
				fieldAgents.addAll(stateAgents.get(cityName));
			}			
			
			if (responseEntity.getStatusCode() == HttpStatus.OK) {
				try {
					jsonObject = new JSONObject(responseEntity.getBody());
					String accessToken = jsonObject.getString("access");
					
					ShutterSearchCriteria ssc = new ShutterSearchCriteria();
					HashMap<String, Long> statusCount = shutterService.getShuttersCountByStatus(ssc);
					
					if(shutter.getStatus().equals("I")) {					
						Long createdCount = statusCount.get("CREATED");
						String message = "A new shutter has been submitted in " + shutter.getCity() + "," + shutter.getState() + 
								" by " + shutter.getCreatedBy() + ". Pending Field Verification =" + createdCount +
								" shutters where status is Created. Please assign field verification agent immediately.";
	
						for (FieldAgent fieldAgent: fieldAgents) {
							String phoneNumber = fieldAgent.getManagerPhone();							
							String result = sendSMS(accessToken, phoneNumber, message);							
							System.out.println(result);
						}
						
						message = "You have submitted a new Shutter.";
						String result = sendSMS(accessToken, shutter.getUserMobileNo(), message);						
						System.out.println(result);
						
						
					} else if(shutter.getStatus().equals("V")) {
						String message = "ShutterId " + shutter.getShutterId() + " is Verified.";
						List<Shutter> assignedBy = shutterService.getFieldAgentAssignee(shutter.getShutterId());
						
						String phoneNumber = assignedBy.get(0).getFieldAgentAssigneePhone();												
						String result = sendSMS(accessToken, phoneNumber, message);
						System.out.println(result);
						
						message = "ShutterId " + shutter.getShutterId() + " is Field Verified.";
						result = sendSMS(accessToken, shutter.getUserMobileNo(), message);						
						System.out.println(result);
						
					}
				} catch (JSONException e) {
					throw new RuntimeException("JSONException occurred");
				}
			}
		} catch (Exception e) {
			System.out.print(e);
//			logger.error("Error :", e);
		}

		
		return "SUCCESS";
	}

	private void usageReport(String module, String moduleFeature) {
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

					JSONObject data = new JSONObject();

					data.put("module", module);
					data.put("moduleFeature", moduleFeature);

					HttpEntity<String> entityWorkflow = new HttpEntity<String>(gson.toJson(data), headersWorkflow);
					String answer = restTemplate.postForObject(usageReportUrl, entityWorkflow, String.class);

					System.out.println(answer);
				} catch (JSONException e) {
					throw new RuntimeException("JSONException occurred");
				}
			}
		} catch (Exception e) {
			System.out.print(e);
		}
	}
	
}