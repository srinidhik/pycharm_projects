package com.medplus.shutter.dao.impl;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.EmptySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.medplus.common.utility.UtilValidate;
import com.medplus.shutter.dao.ShutterDao;
import com.medplus.shutter.dao.helper.DaoHelper;
import com.medplus.shutter.domain.Competitor;
import com.medplus.shutter.domain.CompetitorIncentives;
import com.medplus.shutter.domain.CompetitorSearchCriteria;
import com.medplus.shutter.domain.FieldAgent;
import com.medplus.shutter.domain.Shutter;
import com.medplus.shutter.domain.ShutterComments;
import com.medplus.shutter.domain.ShutterSearchCriteria;
import com.medplus.shutter.exception.ShutterException;
import com.medplus.shutter.helper.AgentExtractor;
import com.medplus.shutter.helper.AgentsTableExtractor;
import com.medplus.shutter.helper.CitiesExtractor;
import com.medplus.shutter.helper.CompetitorExtractor;
import com.medplus.shutter.helper.CompetitorIncentivesExtractor;
import com.medplus.shutter.helper.ShutterCommentsExtractor;
import com.medplus.shutter.helper.ShutterExtractor;
import com.medplus.shutter.helper.ShutterSummaryExtractor;
import com.medplus.shutter.helper.SolrDataExtractor;
import com.medplus.shutter.helper.StatesExtractor;
import com.medplus.shutter.helper.StatusCountExtractor;
import com.medplus.shutter.helper.UsersByCityExtractor;

/**
 * @author siddappak
 *
 */

@Repository
public class ShutterDaoImpl implements ShutterDao {

	@Autowired
	private JdbcTemplate omsReadonlyJdbcTemplate;

	@Autowired
	private JdbcTemplate omsJdbcTemplate;

	private static final Logger LOGGER = LoggerFactory.getLogger(ShutterDaoImpl.class);
	private static final String SAVE_SHUTTER_INFO = 
			"INSERT INTO tbl_shutter_info "
			+ "(UserType, UserId, UserMobileNo, OwnerName, OwnerMobileNo, Email, Status, Latitude, Longitude, Address,"
			+ "GeoAddress, DateCreated, CreatedBy,StoreDimentions,StoreDepth,StoreFrontArea,DoorType,NearByMedicalShop,NearByMedicalShopName,NearByHospitals,"
			+ "NearByHospitalName,NoOfMedicalShops,NearestMedplusStoreDistance,ReadyToOccupy,NoOfDaysToReady,TypeOfFloor,TypeOfCeiling,Placement,RentPerMonth,AdvanceToBePaid,"
			+ "Locality,Landmark,State,City) VALUES"
			+ "(:userType, :userId, :userMobileNo, :ownerName, :ownerMobileNo, :email, :status, :latitude, :longitude, :address,"
			+ ":geoAddress, now(), :createdBy,:storeDimentions,:storeDepth,:storeFrontArea,:doorType,:nearByMedicalShop,:nearByMedicalShopName,:nearByHospitals,"
			+ ":nearByHospitalName,:noOfMedicalShops,:nearestMedplusStoreDistance,:readyToOccupy,:noOfDaysToReady,:typeOfFloor,:typeOfCeiling,:placement,:rentPerMonth,:advanceToBePaid,"
			+ ":locality,:landmark,:state,:city)";
	private static final String SAVE_SHUTTER_LOG_INFO = 
			"INSERT INTO tbl_shutter_info_log "
			+ "(ShutterId,UserType, UserId, UserMobileNo, OwnerName, OwnerMobileNo, Email, Status, Latitude, Longitude,"
			+ " Address,GeoAddress, DateCreated, CreatedBy, DateModified, ModifiedBy,StoreDimentions,StoreDepth,StoreFrontArea,DoorType,"
			+ "NearByMedicalShop,NearByMedicalShopName,NearByHospitals,NearByHospitalName,NoOfMedicalShops,NearestMedplusStoreDistance,ReadyToOccupy,NoOfDaysToReady,TypeOfFloor,TypeOfCeiling,"
			+ "Placement,RentPerMonth,AdvanceToBePaid,Locality,FieldVerifiedBy,Landmark,AgreementDate,State,City,StoreId) VALUES"
			+ "(:shutterId, :userType, :userId, :userMobileNo, :ownerName, :ownerMobileNo, :email, :status, :latitude, :longitude,"
			+ " :address,:geoAddress, :dateCreated, :createdBy, :dateModified, :modifiedBy,:storeDimentions,:storeDepth,:storeFrontArea,:doorType,"
			+ ":nearByMedicalShop,:nearByMedicalShopName,:nearByHospitals,:nearByHospitalName,:noOfMedicalShops,:nearestMedplusStoreDistance,:readyToOccupy,:noOfDaysToReady,:typeOfFloor,:typeOfCeiling,"
			+ ":placement,:rentPerMonth,:advanceToBePaid,:locality,:fieldVerifiedBy,:landmark,:agreementDate,:state,:city,:storeId)";
	private static final String UPDATE_SHUTTER_INFO = 
			"UPDATE tbl_shutter_info SET"
			+ " UserType=:userType, UserId=:userId, UserMobileNo=:userMobileNo, OwnerName=:ownerName,"
			+ " OwnerMobileNo=:ownerMobileNo, Email=:email, Status=:status, Latitude=:latitude, Longitude=:longitude,"
			+ " Address=:address,DateModified=:dateModified, ModifiedBy=:modifiedBy,FieldVerifiedBy=:fieldVerifiedBy,"
			+ " StoreDimentions=:storeDimentions,StoreDepth=:storeDepth,StoreFrontArea=:storeFrontArea,DoorType=:doorType,"
			+ " NearByMedicalShop=:nearByMedicalShop,NearByMedicalShopName=:nearByMedicalShopName,"
			+ " NearByHospitals=:nearByHospitals,NearByHospitalName=:nearByHospitalName,NoOfMedicalShops=:noOfMedicalShops,"
			+ " NearestMedplusStoreDistance=:nearestMedplusStoreDistance,ReadyToOccupy=:readyToOccupy,"
			+ " NoOfDaysToReady=:noOfDaysToReady,TypeOfFloor=:typeOfFloor,TypeOfCeiling=:typeOfCeiling,"
			+ " Placement=:placement,RentPerMonth=:rentPerMonth,AdvanceToBePaid=:advanceToBePaid,Locality=:locality,"
			+ " Landmark=:landmark ,AgreementDate=:agreementDate, State=:state,City=:city,StoreId=:storeId"
			+ " WHERE ShutterId = :shutterId ";
	private static final String GET_SHUTTER_INFO = "select ShutterId, UserType, UserId, UserMobileNo, OwnerName, OwnerMobileNo, Email, Status, Latitude, Longitude, Address,GeoAddress, DateCreated, CreatedBy, DateModified, ModifiedBy,StoreDimentions,StoreDepth,StoreFrontArea,DoorType,NearByMedicalShop,NearByMedicalShopName,NearByHospitals,NearByHospitalName,NoOfMedicalShops,NearestMedplusStoreDistance,ReadyToOccupy,NoOfDaysToReady,TypeOfFloor,TypeOfCeiling,Placement,RentPerMonth,AdvanceToBePaid,Locality,FieldVerifiedBy,Landmark,AgreementDate from tbl_shutter_info where "
			+ " (0=:shutterIdFlag OR ShutterId = :shutterId) AND (0=:userIdFlag OR UserId = :userId) AND (0=:userTypeFlag OR UserType = :userType) AND (0=:statusFlag OR Status = :status) AND (0=:dateCreatedFlag OR (DateCreated between :fromDate and :toDate)) "
			+ " AND (0=:addressFlag OR address LIKE :address) AND (0=:fieldVerifiedByFlag OR FieldVerifiedBy = :fieldVerifiedBy) AND (0=:localityFlag OR Locality = :locality) ";
	private static final String  TOTAL_SHUTTERS_COUNT = 
			"select count(ShutterId) from tbl_shutter_info where"
			+ " (0=:shutterIdFlag OR ShutterId = :shutterId) AND (0=:userIdFlag OR UserId = :userId) AND (0=:userTypeFlag OR UserType = :userType)"
			+ " AND (0=:statusFlag OR Status = :status) AND (0=:shutterIdFlag OR ShutterId = :shutterId) AND (0=:dateCreatedFlag OR (DateCreated between :fromDate and :toDate))"
			+ " AND (0=:addressFlag OR address LIKE :address) AND (0=:fieldVerifiedByFlag OR FieldVerifiedBy = :fieldVerifiedBy)"
			+ " AND (0=:stateFlag OR State IN (:state)) AND (0=:cityFlag OR City = :city)";
	
	private static final String SAVE_SHUTTER_COMMENTS_QRY="INSERT INTO tbl_shutter_comments (ShutterId,CommentedBy,Comment,DateCreated) VALUES(:shutterId,:commentedBy,:comment,:dateCreated)";

	private static final String GET_SHUTTER_COMMENTS_QRY=
			"select comments.ShutterId as ShutterId,comments.CommentedBy as CommentedBy,comments.Comment as Comment,"
			+ "comments.DateCreated as DateCreated, user.Name as CommentedByName from tbl_shutter_comments as comments"
			+ " join ums.tbl_user as user on comments.CommentedBy = user.UserId"
			+ " where ShutterId=:shutterId";
	private static final String GET_SHUTTER_COMMENTS_TOP_QRY=
			"select comments.ShutterId as ShutterId,comments.CommentedBy as CommentedBy,comments.Comment as Comment,"
			+ "comments.DateCreated as DateCreated, user.Name as CommentedByName from tbl_shutter_comments as comments"
			+ " join ums.tbl_user as user on comments.CommentedBy = user.UserId"
			+ " where ShutterId=:shutterId AND (0=:commentedByFlag OR CommentedBy=:commentedBy) ORDER BY DateCreated DESC LIMIT 1";
//	private static final String GET_SHUTTER_COMMENTS_TOP_QRY="SELECT ShutterId,CommentedBy,Comment,DateCreated FROM tbl_shutter_comments where ShutterId=:shutterId AND (0=:commentedByFlag OR CommentedBy=:commentedBy) ORDER BY DateCreated DESC LIMIT 1";
	private static final String SAVE_COMPETITOR_INFO = 
			"INSERT INTO tbl_competitor_info "
			+ "(UserType, UserId, UserMobileNo, CompetitorStatus, Latitude, Longitude, Address,GeoAddress, DateCreated, CreatedBy,"
			+ "StoreDimensions,StoreFrontArea,DoorType,Locality,AgeOfShop,City,Pincode,PharmacyChain,OutletName,DailySales, MedplusStoreId, Comment) VALUES"
			+ "(:userType, :userId, :userMobileNo, :status, :latitude, :longitude, :address,:geoAddress, now(), :createdBy,"
			+ ":storeDimensions,:storeFrontArea,:doorType,:locality, :ageOfShop, :city, :pincode, :pharmacyChain, :outletName, :dailySales, :medplusStoreId, :comment)";

	private static final String GET_COMPETITOR_INFO = 
			"SELECT comp.CompetitorId as CompetitorId, comp.UserType as UserType, comp.UserId as UserId, comp.UserMobileNo as UserMobileNo, comp.CompetitorStatus as CompetitorStatus,"
			+ " comp.Latitude as Latitude, comp.Longitude as Longitude, comp.Address as Address, comp.GeoAddress as GeoAddress, comp.DateCreated as DateCreated,"
			+ " comp.CreatedBy as CreatedBy, comp.DateModified as DateModified, comp.ModifiedBy as ModifiedBy, comp.StoreDimensions as StoreDimensions, comp.StoreFrontArea as StoreFrontArea,"
			+ " comp.DoorType as DoorType, comp.Locality as Locality, comp.DailySales as DailySales, comp.AgeOfShop as AgeOfShop, comp.Pincode as Pincode,"
			+ " comp.City as City, comp.PharmacyChain as PharmacyChain, comp.OutletName as OutletName, comp.MedplusStoreId as MedplusStoreId, comp.Comment as Comment,"
			+ " createdUser.Name as CreatorName, modifiedUser.Name as ModifiedByName, modifiedUser.Phone as ModifiedByPhone"
			+ " from tbl_competitor_info as comp join ums.tbl_user as createdUser on comp.CreatedBy = createdUser.UserId"
			+ " left join ums.tbl_user as modifiedUser on comp.ModifiedBy = modifiedUser.UserId AND (NOT comp.ModifiedBy is NULL) where "
			+ " (0=:competitorIdFlag OR comp.CompetitorId = :competitorId) AND (0=:userIdFlag OR comp.UserId = :userId) AND (0=:userTypeFlag OR comp.UserType = :userType)"
			+ " AND (0=:createdByFlag OR comp.CreatedBy = :createdBy) AND (0=:statusFlag OR comp.CompetitorStatus = :status) AND (0=:dateCreatedFlag OR (comp.DateCreated between :fromDate and :toDate)) "
			+ " AND (0=:addressFlag OR comp.address LIKE :address) AND (0=:localityFlag OR comp.Locality = :locality) AND (0=:pincodeFlag OR comp.Pincode=:pincode)"
			+ " AND (0=:medplusStoreIdFlag OR comp.MedplusStoreId=:medplusStoreId) AND (0=:areaWiseFlag OR comp.Address LIKE CONCAT('%', :areaWise , '%'))"
			+ " AND (0=:timeoutFlag OR comp.DateCreated <= :dateCreated)" ;
	private static final String TOTAL_COMPETITORS_COUNT = "SELECT count(CompetitorId) from tbl_competitor_info where  (0=:competitorIdFlag OR CompetitorId = :competitorId) AND (0=:userIdFlag OR UserId = :userId) AND (0=:userTypeFlag OR UserType = :userType) AND (0=:statusFlag OR CompetitorStatus = :status) AND (0=:dateCreatedFlag OR (DateCreated between :fromDate and :toDate)) AND (0=:addressFlag OR address LIKE :address) AND (0=:localityFlag OR Locality = :locality) " 
			+ "AND (0=:medplusStoreIdFlag OR MedplusStoreId=:medplusStoreId) AND (0=:createdByFlag OR CreatedBy = :createdBy) AND (0=:pincodeFlag OR Pincode=:pincode) AND (0=:areaWiseFlag OR Address LIKE CONCAT('%', :areaWise , '%')) AND (0=:timeoutFlag OR DateCreated <= :dateCreated)";
	private static final String UPDATE_COMPETITOR_INFO = 
			"UPDATE tbl_competitor_info SET CompetitorStatus=:status,DateModified=:dateModified, "
			+ "ModifiedBy=:modifiedBy, MedplusStoreId=:medplusStoreId, Comment=:comment WHERE CompetitorId = :competitorId ";
	private static final String SAVE_COMPETITOR_LOG_INFO = 
			"INSERT INTO tbl_competitor_info_log "
			+ " (CompetitorId,UserType, UserId, UserMobileNo, CompetitorStatus, Latitude, Longitude, Address,GeoAddress, DateCreated,"
			+ " CreatedBy,StoreDimensions,StoreFrontArea,DoorType,Locality,AgeOfShop,City,Pincode,PharmacyChain,OutletName,"
			+ " DailySales, DateModified, ModifiedBy, MedplusStoreId, Comment) VALUES"
			+ " (:competitorId, :userType, :userId, :userMobileNo, :status, :latitude, :longitude, :address,:geoAddress, :dateCreated,"
			+ " :createdBy,:storeDimensions,:storeFrontArea,:doorType,:locality, :ageOfShop, :city, :pincode, :pharmacyChain, :outletName,"
			+ " :dailySales, :dateModified, :modifiedBy, :medplusStoreId, :comment)";
	private static final String GET_COMPETITOR_INFO_RADIUS = "SELECT CompetitorId, UserType, UserId, UserMobileNo, CompetitorStatus, Latitude, Longitude, Address,GeoAddress, DateCreated, CreatedBy, DateModified, ModifiedBy,StoreDimensions,StoreFrontArea,DoorType,Locality,DailySales,AgeOfShop,Pincode,City,PharmacyChain,OutletName,MedplusStoreId, Comment from tbl_competitor_info WHERE ACOS( SIN( RADIANS( Latitude ) ) * SIN( RADIANS(:latitude) ) + COS( RADIANS( Latitude ) ) * COS( RADIANS(:latitude)) * COS( RADIANS( Longitude ) - RADIANS(:longitude)) ) * 6380 < :radius AND CompetitorStatus = 'S' ";
	private static final String REFRESH_STORE_MAPPING = "SELECT CompetitorId, UserType, UserId, UserMobileNo, CompetitorStatus, Latitude, Longitude, Address,GeoAddress, DateCreated, CreatedBy, DateModified, ModifiedBy,StoreDimensions,StoreFrontArea,DoorType,Locality,DailySales,AgeOfShop,Pincode,City,PharmacyChain,OutletName,MedplusStoreId, Comment from tbl_competitor_info WHERE ACOS( SIN( RADIANS( Latitude ) ) * SIN( RADIANS(:latitude) ) + COS( RADIANS( Latitude ) ) * COS( RADIANS(:latitude)) * COS( RADIANS( Longitude ) - RADIANS(:longitude)) ) * 6380 < :radius AND CompetitorStatus in ('S', 'I')  ";
	private static final String GET_SHUTTER_LOG_INFO = 
			"SELECT shLog.ShutterId as ShutterId,shLog.UserType as UserType, shLog.UserId as UserId, shLog.UserMobileNo as UserMobileNo, shLog.OwnerName as OwnerName,"
			+ " shLog.OwnerMobileNo as OwnerMobileNo, shLog.Email as Email, shLog.Status as Status, shLog.Latitude as Latitude, shLog.Longitude as Longitude,"
			+ " shLog.Address as Address,shLog.GeoAddress as GeoAddress, shLog.DateCreated as DateCreated, shLog.CreatedBy as CreatedBy, shLog.DateModified as DateModified,"
			+ " shLog.ModifiedBy as ModifiedBy,shLog.StoreDimentions as StoreDimentions,shLog.StoreDepth as StoreDepth,shLog.StoreFrontArea as StoreFrontArea,shLog.DoorType as DoorType,"
			+ " shLog.NearByMedicalShop as NearByMedicalShop,shLog.NearByMedicalShopName as NearByMedicalShopName,shLog.NearByHospitals as NearByHospitals,shLog.NearByHospitalName as NearByHospitalName,shLog.NoOfMedicalShops as NoOfMedicalShops,"
			+ " shLog.NearestMedplusStoreDistance as NearestMedplusStoreDistance,shLog.ReadyToOccupy as ReadyToOccupy,shLog.NoOfDaysToReady as NoOfDaysToReady,shLog.TypeOfFloor as TypeOfFloor,shLog.TypeOfCeiling as TypeOfCeiling,"
			+ " shLog.Placement as Placement,shLog.RentPerMonth as RentPerMonth,shLog.AdvanceToBePaid as AdvanceToBePaid,shLog.Locality as Locality,"
			+ " shLog.FieldVerifiedBy as FieldVerifiedBy,shLog.Landmark as Landmark,shLog.AgreementDate as AgreementDate,shLog.State as State, shLog.City as City, shLog.StoreId as StoreId,"
			+ " user.Name as CreatorName, modifiedUser.Name as ModifiedByName"
			+ " from tbl_shutter_info_log as shLog join ums.tbl_user as user on shLog.CreatedBy=user.UserId"
			+ " left join ums.tbl_user as modifiedUser on shLog.ModifiedBy = modifiedUser.UserId AND (NOT shLog.ModifiedBy is NULL)"
			+ " where ShutterId=:shutterId";
	private static final String GET_COMPETITOR_LOG_INFO = 
			"SELECT compLog.CompetitorId as CompetitorId, compLog.UserType as UserType, compLog.UserId as UserId, compLog.UserMobileNo as UserMobileNo, compLog.CompetitorStatus as CompetitorStatus,"
			+ " compLog.Latitude as Latitude, compLog.Longitude as Longitude, compLog.Address as Address, compLog.GeoAddress as GeoAddress, compLog.DateCreated as DateCreated,"
			+ " compLog.CreatedBy as CreatedBy, compLog.StoreDimensions as StoreDimensions, compLog.StoreFrontArea as StoreFrontArea, compLog.DoorType as DoorType, compLog.Locality as Locality,"
			+ " compLog.AgeOfShop as AgeOfShop, compLog.City as City, compLog.Pincode as Pincode, compLog.PharmacyChain as PharmacyChain, compLog.OutletName as OutletName,"
			+ " compLog.DailySales as DailySales, compLog.DateModified as DateModified, compLog.ModifiedBy as ModifiedBy, compLog.MedplusStoreId as MedplusStoreId, compLog.Comment as Comment,"
			+ " createdUser.Name as CreatorName, modifiedUser.Name as ModifiedByName, modifiedUser.Phone as ModifiedByPhone"
			+ " from tbl_competitor_info_log as compLog join ums.tbl_user as createdUser on compLog.CreatedBy = createdUser.UserId"
			+ " left join ums.tbl_user as modifiedUser on compLog.ModifiedBy = modifiedUser.UserId AND (NOT compLog.ModifiedBy is NULL)"
			+ " where compLog.CompetitorId=:competitorId";
	
	private static final String GET_AGENTS = "SELECT ManagerId, Manager, ManagerPhone, StateCode, City, LocalHead from tbl_shutter_field_agents where (City=:city or StateCode=:stateCode) and (not LocalHead in (:localHead, 'CITY', 'STATE','SOLR_DATA'))";
	
	private static final String GET_LOCAL_HEADS = "SELECT ManagerId, Manager, ManagerPhone, StateCode, City, LocalHead from tbl_shutter_field_agents where (City=:city or StateCode=:stateCode) and (LocalHead=:localHead)";
	
	private static final String GET_ALL_AGENTS = "SELECT ManagerId, Manager, ManagerPhone, StateCode, City, LocalHead from tbl_shutter_field_agents where (not LocalHead in (:localHead, 'CITY', 'STATE','SOLR_DATA'))";
	
	private static final String GET_STATE_CITIES_MAP = "SELECT DISTINCT(City), StateCode from tbl_shutter_field_agents where StateCode=:stateCode and (LocalHead=:localHead)";
	
	private static final String GET_STATES_CITIES_MAP = "SELECT DISTINCT(City), StateCode FROM tbl_shutter_field_agents where (LocalHead=:localHead)";
	
	private static final String SAVE_FIELD_AGENT_INFO = "INSERT INTO tbl_shutter_field_agents (StateCode, City, LocalHead, Manager, ManagerId, ManagerPhone) VALUES (:stateCode, :city, :localHead, :manager, :managerId, :managerPhone)";
	
	private static final String GET_SHUTTER_INFO_NEW = 
			"select shutter.ShutterId as ShutterId, shutter.UserType as UserType, shutter.UserId as UserId, shutter.UserMobileNo as UserMobileNo, shutter.OwnerName as OwnerName,"
			+ " shutter.OwnerMobileNo as OwnerMobileNo, shutter.Email as Email, shutter.Status as Status, shutter.Latitude as Latitude, shutter.Longitude as Longitude,"
			+ " shutter.Address as Address, shutter.GeoAddress as GeoAddress, shutter.DateCreated as DateCreated, shutter.CreatedBy as CreatedBy, shutter.DateModified as DateModified,"
			+ " shutter.ModifiedBy as ModifiedBy, shutter.StoreDimentions as StoreDimentions, shutter.StoreDepth as StoreDepth, shutter.StoreFrontArea as StoreFrontArea,"
			+ " shutter.DoorType as DoorType, shutter.NearByMedicalShop as NearByMedicalShop, shutter.NearByMedicalShopName as NearByMedicalShopName, shutter.NearByHospitals as NearByHospitals,"
			+ " shutter.NearByHospitalName as NearByHospitalName, shutter.NoOfMedicalShops as NoOfMedicalShops, shutter.NearestMedplusStoreDistance as NearestMedplusStoreDistance,"
			+ " shutter.ReadyToOccupy as ReadyToOccupy, shutter.NoOfDaysToReady as NoOfDaysToReady, shutter.TypeOfFloor as TypeOfFloor, shutter.TypeOfCeiling as TypeOfCeiling,"
			+ " shutter.Placement as Placement, shutter.RentPerMonth as RentPerMonth, shutter.AdvanceToBePaid as AdvanceToBePaid, shutter.Locality as Locality,"
			+ " shutter.FieldVerifiedBy as FieldVerifiedBy, shutter.Landmark as Landmark, shutter.AgreementDate as AgreementDate, shutter.State as State,"
			+ " shutter.City as City, shutter.StoreId as StoreId, user.Name as CreatorName, " 
			+ " agents.Manager as FieldVerifiedByName, agents.ManagerPhone as FieldVerifiedByPhone"
			+ " from tbl_shutter_info as shutter join ums.tbl_user as user on shutter.CreatedBy = user.UserId"
			+ " left join tbl_shutter_field_agents as agents on shutter.FieldVerifiedBy = agents.ManagerId AND (NOT agents.LocalHead = 'HEAD') AND (NOT agents.LocalHead = 'CITY')"
			+ " where (0=:shutterIdFlag OR shutter.ShutterId = :shutterId) AND (0=:userIdFlag OR shutter.UserId = :userId) AND (0=:userTypeFlag OR shutter.UserType = :userType)"
			+ " AND (0=:statusFlag OR shutter.Status = :status) AND (0=:dateCreatedFlag OR (shutter.DateCreated between :fromDate and :toDate)) "
			+ " AND (0=:addressFlag OR address LIKE :address) AND (0=:fieldVerifiedByFlag OR shutter.FieldVerifiedBy = :fieldVerifiedBy)"
			+ " AND (0=:stateFlag OR shutter.State IN (:state)) AND (0=:cityFlag OR shutter.City = :city)";
			
	private static final String SHUTTERS_STATUS_COUNT = 
			"select Status, count(Status) as StatusCount from tbl_shutter_info "
			+ "where (0=:shutterIdFlag OR ShutterId = :shutterId) AND (0=:userIdFlag OR UserId = :userId) AND (0=:userTypeFlag OR UserType = :userType) "
			+ "AND (0=:dateCreatedFlag OR (DateCreated between :fromDate and :toDate)) "
			+ "AND (0=:addressFlag OR address LIKE :address) AND (0=:stateFlag OR State IN (:state)) AND (0=:cityFlag OR City = :city) group by Status ";
	private static final String COMPETITOR_STATUS_COUNT = 
			"select CompetitorStatus as Status, count(CompetitorStatus) as StatusCount from tbl_competitor_info "
			+ "where (0=:competitorIdFlag OR CompetitorId = :competitorId) AND (0=:userIdFlag OR UserId = :userId) AND (0=:userTypeFlag OR UserType = :userType) "
			+ "AND (0=:dateCreatedFlag OR (DateCreated between :fromDate and :toDate)) AND (0=:addressFlag OR address LIKE :address) "
			+ "AND (0=:localityFlag OR Locality = :locality) group by CompetitorStatus ";

	private static final String GET_FIELD_AGENT_ASSIGNEE = 
			"select shutter.ShutterId as ShutterId, shutter.UserType as UserType, shutter.UserId as UserId, shutter.UserMobileNo as UserMobileNo, shutter.OwnerName as OwnerName,"
			+ " shutter.OwnerMobileNo as OwnerMobileNo, shutter.Email as Email, shutter.Status as Status, shutter.Latitude as Latitude, shutter.Longitude as Longitude,"
			+ " shutter.Address as Address, shutter.GeoAddress as GeoAddress, shutter.DateCreated as DateCreated, shutter.CreatedBy as CreatedBy, shutter.DateModified as DateModified,"
			+ " shutter.ModifiedBy as ModifiedBy, shutter.StoreDimentions as StoreDimentions, shutter.StoreDepth as StoreDepth, shutter.StoreFrontArea as StoreFrontArea,"
			+ " shutter.DoorType as DoorType, shutter.NearByMedicalShop as NearByMedicalShop, shutter.NearByMedicalShopName as NearByMedicalShopName, shutter.NearByHospitals as NearByHospitals,"
			+ " shutter.NearByHospitalName as NearByHospitalName, shutter.NoOfMedicalShops as NoOfMedicalShops, shutter.NearestMedplusStoreDistance as NearestMedplusStoreDistance,"
			+ " shutter.ReadyToOccupy as ReadyToOccupy, shutter.NoOfDaysToReady as NoOfDaysToReady, shutter.TypeOfFloor as TypeOfFloor, shutter.TypeOfCeiling as TypeOfCeiling,"
			+ " shutter.Placement as Placement, shutter.RentPerMonth as RentPerMonth, shutter.AdvanceToBePaid as AdvanceToBePaid, shutter.Locality as Locality,"
			+ " shutter.FieldVerifiedBy as FieldVerifiedBy, shutter.Landmark as Landmark, shutter.AgreementDate as AgreementDate, shutter.State as State, shutter.City as City, shutter.StoreId as StoreId," 
			+ " user.Name as CreatorName, agents.Manager as FieldAgentAssignee, agents.ManagerPhone as FieldAgentAssigneePhone"
			+ " from tbl_shutter_info_log as shutter join ums.tbl_user as user on shutter.CreatedBy = user.UserId"
			+ " left join tbl_shutter_field_agents as agents on shutter.ModifiedBy = agents.ManagerId AND (agents.LocalHead = 'HEAD')";
	
	private static final String GET_SHUTTER_SUMMARY_STATE_CITY =
			" SELECT Status, COUNT(Status) AS StatusCount, State, City"
			+ " FROM tbl_shutter_info"
			+ " WHERE (0=:dateCreatedFlag OR (DateCreated between :fromDate and :toDate)) AND (0=:stateFlag OR State IN (:state))"
			+ " GROUP BY State , City , Status";
	
	private static final String GET_COMPETITOR_INCENTIVES_DATA = 
			" SELECT comp.UserId AS UserId, createdUser.Name AS CreatorName, createdUser.Phone AS CreatorPhone,"
			+ " COUNT(CASE WHEN comp.CompetitorStatus = 'I' THEN 1 END) AS Initiated,"
			+ " COUNT(CASE WHEN comp.CompetitorStatus = 'S' THEN 1 END) AS Approved,"
			+ " COUNT(CASE WHEN comp.CompetitorStatus = 'R' THEN 1 END) AS Rejected,"
			+ " COUNT(comp.CompetitorStatus) AS Total"
			+ " FROM tbl_competitor_info AS comp"
			+ " LEFT JOIN ums.tbl_user AS createdUser ON comp.UserId = createdUser.UserId"
			+ " WHERE (0=:competitorIdFlag OR comp.CompetitorId = :competitorId) AND (0=:userIdFlag OR comp.UserId = :userId) AND (0=:userTypeFlag OR comp.UserType = :userType)"
			+ " AND (0=:createdByFlag OR comp.CreatedBy = :createdBy) AND (0=:statusFlag OR comp.CompetitorStatus = :status) AND (0=:dateCreatedFlag OR (comp.DateCreated between :fromDate and :toDate)) "
			+ " AND (0=:addressFlag OR comp.address LIKE :address) AND (0=:localityFlag OR comp.Locality = :locality) AND (0=:pincodeFlag OR comp.Pincode=:pincode)"
			+ " AND (0=:medplusStoreIdFlag OR comp.MedplusStoreId=:medplusStoreId) AND (0=:areaWiseFlag OR comp.Address LIKE CONCAT('%', :areaWise , '%'))"
			+ " AND (0=:timeoutFlag OR comp.DateCreated <= :dateCreated)"
			+ " GROUP BY comp.UserId";
	
	private static final String GET_STATES = "SELECT StateCode, Manager FROM tbl_shutter_field_agents WHERE LocalHead = 'STATE'";
	
	private static final String GET_SOLR_DATA = "SELECT StateCode, Manager, City FROM tbl_shutter_field_agents WHERE LocalHead = 'SOLR_DATA'";
	
	private static final String GET_FIELD_AGENTS_TABLE_DATA =
			"SELECT id, ManagerId, Manager, ManagerPhone, StateCode, City, LocalHead FROM tbl_shutter_field_agents";
		
	private static final String DELETE_FIELD_AGENTS_RECORD = "DELETE FROM tbl_shutter_field_agents";
	
	private static final String GET_USERS_BY_CITY = 
			"SELECT UserId, EmployeeId, Name, Department, JobTitle, Phone FROM ums.tbl_user";
	
	private NamedParameterJdbcTemplate getNamedParameterJdbcTemplate(JdbcTemplate jdbcTemplate) {
		return new NamedParameterJdbcTemplate(jdbcTemplate);
	}

	@Override
	public Long saveShutterInfo(Shutter shutter) throws ShutterException{
		LOGGER.debug("saveShutterInfo : {} ", shutter);

		KeyHolder keyHolder = new GeneratedKeyHolder();
		getNamedParameterJdbcTemplate(omsJdbcTemplate).update(SAVE_SHUTTER_INFO, DaoHelper.getSqlParameterForInsert(shutter),keyHolder);

		return keyHolder.getKey().longValue();
	}

	@Override
	public int saveShutterLog(Shutter shutter) throws ShutterException{

		LOGGER.debug("saveShutterLog : {} ", shutter);
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).update(SAVE_SHUTTER_LOG_INFO, DaoHelper.getSqlParameterForInsert(shutter));
	}

	@Override
	public int updateShutterInfo(Shutter shutter) throws ShutterException {

		LOGGER.debug("updateShutterInfo : {} ", shutter);
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).update(UPDATE_SHUTTER_INFO, DaoHelper.getSqlParameterForUpdate(shutter));
	}

	public List<Shutter> getShutterInfo(ShutterSearchCriteria searchCriteria) throws ShutterException{
		String limit = "";
		if(UtilValidate.isNotEmpty(searchCriteria.getLimitFrom()) && UtilValidate.isNotEmpty(searchCriteria.getLimitTo())){
			limit = " Limit "+searchCriteria.getLimitFrom()+" , "+searchCriteria.getLimitTo();
		}
		String query = GET_SHUTTER_INFO_NEW + " ORDER BY "+searchCriteria.getOrderBy() +" "+searchCriteria.getSortType()+limit ;
		LOGGER.debug("getShutterInfoQry: {}", query);
		return getNamedParameterJdbcTemplate(omsReadonlyJdbcTemplate).query(query, DaoHelper.getSqlParameterForSearch(searchCriteria),  new ShutterExtractor());
	}

	@Override
	public Long getTotalShuttersCount(ShutterSearchCriteria searchCriteria) throws ShutterException{
		LOGGER.debug("getTotalShuttersCount: {}", TOTAL_SHUTTERS_COUNT);
		return getNamedParameterJdbcTemplate(omsReadonlyJdbcTemplate).queryForObject(TOTAL_SHUTTERS_COUNT, DaoHelper.getSqlParameterForSearch(searchCriteria),Long.class);
	}	

	@Override
	public int saveShutterComments(Long shutterId, String commentedBy, String comment) throws ShutterException {
		LOGGER.debug("comment : {} ",comment);
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).update(SAVE_SHUTTER_COMMENTS_QRY, DaoHelper.getSqlParameterForSaveComment(shutterId,commentedBy,comment));
	}

	@Override
	public List<ShutterComments> getShutterComments(Long shutterId) throws ShutterException {
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_SHUTTER_COMMENTS_QRY,DaoHelper.getSqlParameterForCommentSearch(shutterId, ""), new ShutterCommentsExtractor());
	}
	
	@Override
	public List<ShutterComments> getTopShutterComment(Long shutterId, String commentedBy) throws ShutterException {
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_SHUTTER_COMMENTS_TOP_QRY,DaoHelper.getSqlParameterForCommentSearch(shutterId, commentedBy), new ShutterCommentsExtractor());
	}

	@Override
	public Long saveCompetitorInfo(Competitor competitor) throws ShutterException {
		LOGGER.debug("saveShutterInfo : {} ", competitor);

		KeyHolder keyHolder = new GeneratedKeyHolder();
		getNamedParameterJdbcTemplate(omsJdbcTemplate).update(SAVE_COMPETITOR_INFO, DaoHelper.getSqlParameterForCompetitorInsert(competitor),keyHolder);

		return keyHolder.getKey().longValue();
	}

	public List<Competitor> getCompetitorInfo(CompetitorSearchCriteria searchCriteria) throws ShutterException{
		String limit = "";
		String query = "";
		if(UtilValidate.isNotEmpty(searchCriteria.getLimitFrom()) && UtilValidate.isNotEmpty(searchCriteria.getLimitTo())){
			limit = " Limit "+searchCriteria.getLimitFrom()+" , "+searchCriteria.getLimitTo();
		}
		if(searchCriteria.isRadiusFlag()) {
			query = GET_COMPETITOR_INFO_RADIUS + " ORDER BY "+ searchCriteria.getOrderBy() + " " + searchCriteria.getSortType() + limit ;
		}
		else if(searchCriteria.isStoreMapping()) {
			query = REFRESH_STORE_MAPPING + " ORDER BY "+ searchCriteria.getOrderBy() + " " + searchCriteria.getSortType() + limit ;
		}
		else{
			query = GET_COMPETITOR_INFO + " ORDER BY "+ searchCriteria.getOrderBy() + " " + searchCriteria.getSortType() + limit ;	
		}
		LOGGER.debug("getShutterInfoQry: {}", query);
		return getNamedParameterJdbcTemplate(omsReadonlyJdbcTemplate).query(query, DaoHelper.getSqlParameterForCompetitorSearch(searchCriteria), new CompetitorExtractor());
	}

	@Override
	public Long getTotalCompetitorsCount(CompetitorSearchCriteria searchCriteria) throws ShutterException{
		LOGGER.debug("getTotalShuttersCount: {}", TOTAL_COMPETITORS_COUNT);
		return getNamedParameterJdbcTemplate(omsReadonlyJdbcTemplate).queryForObject(TOTAL_COMPETITORS_COUNT, DaoHelper.getSqlParameterForCompetitorSearch(searchCriteria),Long.class);
	}

	@Override
	public int updateCompetitorInfo(Competitor competitor) throws ShutterException {

		LOGGER.debug("updateCompetitorInfo : {} ", competitor);
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).update(UPDATE_COMPETITOR_INFO, DaoHelper.getSqlParameterForCompetitorUpdate(competitor));
	}

	@Override
	public int saveCompetitorLog(Competitor competitor) throws ShutterException {

		LOGGER.debug("saveCompetitorLog : {} ", competitor);
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).update(SAVE_COMPETITOR_LOG_INFO, DaoHelper.getSqlParameterForCompetitorInsert(competitor));
	}
	
	@Override
	public List<Shutter> getShutterHistory(Long shutterId) throws ShutterException {
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_SHUTTER_LOG_INFO,DaoHelper.getSqlParameterForCommentSearch(shutterId, ""), new ShutterExtractor());
	}
	
	@Override
	public List<Competitor> getCompetitorHistory(Long competitorId) throws ShutterException {
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_COMPETITOR_LOG_INFO,DaoHelper.getSqlParameterForCompetitorId(competitorId), new CompetitorExtractor());
	}
	
	@Override
	public HashMap<String, HashMap<String, List<FieldAgent>>> getAgents(String stateCode, String city, String localhead) {
		if(stateCode == "" && city == "" && localhead == "") {
			localhead = "HEAD";
			return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_ALL_AGENTS, DaoHelper.getSqlParameterForFieldAgents("", "", localhead), new AgentExtractor());
		} else {
			if(localhead == "HEAD") {
				return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_LOCAL_HEADS, DaoHelper.getSqlParameterForFieldAgents(stateCode, city, localhead), new AgentExtractor());
			} else {
				localhead = "HEAD";
				return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_AGENTS, DaoHelper.getSqlParameterForFieldAgents(stateCode, city, localhead), new AgentExtractor());
			}
		}
	}
	
	@Override
	public HashMap<String, List<String>> getCities(String stateCode) {
		String localhead = "CITY";
		if(stateCode == "") {
			return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_STATES_CITIES_MAP, DaoHelper.getSqlParameterForFieldAgents("", "", localhead), new CitiesExtractor());
		}else {
			return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_STATE_CITIES_MAP, DaoHelper.getSqlParameterForFieldAgents(stateCode, "", localhead), new CitiesExtractor());
		}
	}
	
	@Override
	public HashMap<String, List<String>> getStatesOfLocalhead(String loggedInUserId) {
		String query = "SELECT DISTINCT(City), StateCode FROM tbl_shutter_field_agents WHERE"
				+ " ManagerId='" + loggedInUserId + "' AND LocalHead='HEAD'";
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(query, EmptySqlParameterSource.INSTANCE, new CitiesExtractor());
	}
	
	@Override
	public int saveFieldAgent(FieldAgent fieldAgent) throws ShutterException {
		LOGGER.debug("saveFieldAgentLog : {} ", fieldAgent);
		
		KeyHolder keyHolder = new GeneratedKeyHolder();
		getNamedParameterJdbcTemplate(omsJdbcTemplate).update(SAVE_FIELD_AGENT_INFO, DaoHelper.getSqlParameterForFieldAgentInsert(fieldAgent),keyHolder);
		
		return keyHolder.getKey().intValue();
	}

	@Override
	public HashMap<String, Long> getShutterStatusCountData(ShutterSearchCriteria searchCriteria){
		LOGGER.debug("getTotalShuttersCount: {}", SHUTTERS_STATUS_COUNT);
		return getNamedParameterJdbcTemplate(omsReadonlyJdbcTemplate).query(SHUTTERS_STATUS_COUNT, DaoHelper.getSqlParameterForSearch(searchCriteria), new StatusCountExtractor("shutter"));
	}

	@Override
	public HashMap<String, Long> getCompetitorStatusCountData(CompetitorSearchCriteria searchCriteria){
		LOGGER.debug("getTotalCompetitorsCount: {}", COMPETITOR_STATUS_COUNT);
		return getNamedParameterJdbcTemplate(omsReadonlyJdbcTemplate).query(COMPETITOR_STATUS_COUNT, DaoHelper.getSqlParameterForCompetitorSearch(searchCriteria), new StatusCountExtractor("competitor"));
	}
	
	@Override
	public List<Shutter> getFieldAgentAssignee(Long shutterId) {
		String query = GET_FIELD_AGENT_ASSIGNEE + " where shutter.ShutterId = '" + shutterId +"' AND shutter.Status = 'F' order by DateModified desc";
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(query, EmptySqlParameterSource.INSTANCE, new ShutterExtractor());
	}
	
	@Override
	public HashMap<String, HashMap<String, HashMap<String, Integer>>> getShutterSummary(ShutterSearchCriteria shutterSearchCriteria) {
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_SHUTTER_SUMMARY_STATE_CITY, DaoHelper.getSqlParameterForSearch(shutterSearchCriteria), new ShutterSummaryExtractor());
	}
	
	@Override
	public List<CompetitorIncentives> getCompIncentivesData(CompetitorSearchCriteria competitorSearchCriteria) {
		return getNamedParameterJdbcTemplate(omsReadonlyJdbcTemplate).query(GET_COMPETITOR_INCENTIVES_DATA, DaoHelper.getSqlParameterForCompetitorSearch(competitorSearchCriteria), new CompetitorIncentivesExtractor());
	}
	
	@Override
	public HashMap<String, String> getStates() {
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_STATES, EmptySqlParameterSource.INSTANCE, new StatesExtractor());
	}
	
	@Override
	public HashMap<String, List<String>> getSolrData() {
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(GET_SOLR_DATA, EmptySqlParameterSource.INSTANCE, new SolrDataExtractor());
	}
	
	@Override
	public List<FieldAgent> getFieldAgentsTable(String localhead) {
		String localHeadFilter = "";
		if (localhead.equals("FIELD_AGENT")) {
			localHeadFilter = "(NOT LocalHead IN ('HEAD', 'CITY', 'STATE','SOLR_DATA'))";
		} else {
			localHeadFilter = "LocalHead='" +localhead + "'";
		}
		String query = GET_FIELD_AGENTS_TABLE_DATA + " WHERE " + localHeadFilter;
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(query, EmptySqlParameterSource.INSTANCE, new AgentsTableExtractor());
	}
	
	@Override
	public int deleteFieldAgentsRecord(Integer recordId) {
		String query = DELETE_FIELD_AGENTS_RECORD + " WHERE id=" + recordId;
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).update(query, EmptySqlParameterSource.INSTANCE);
	}
	
	@Override
	public HashMap<String, HashMap<String, String>> getUsersByCity(String stateCode, String cityCode) {
		String query = GET_USERS_BY_CITY
				+" WHERE StateCode='" + stateCode + "' AND CityCode='" + cityCode + "'";
		
		return getNamedParameterJdbcTemplate(omsJdbcTemplate).query(query, EmptySqlParameterSource.INSTANCE, new UsersByCityExtractor());
	}
	
}
