export class Shutter {

    private userMobileNo: string;
    private ownerMobileNo: string;
    private userId: string;
    public address: any;
    private dateCreated: string;
    private latitude: string;
    private longitude: string;
    private rentPerMonth: string;
    private comment: string;
    private ownerName: string;
    private landmark: string;
    private status: string;
    private nearestMedplusStoreDistance;
    private advanceToBePaid: any;
    private storeDimentions: string;
    private storeDepth;
    private noOfDaysToReady: any;
    private typeOfFloor: any;
    private typeOfCeiling: any;
    private placement: any;
    private nearByMedicalShop: any;
    private nearByHospitals: any;
    private noOfMedicalShops: number;
    private nearByMedicalShopName: any[];
    private storeFrontArea;
    private readyToOccupy: any;
    private nearByHospitalName: any[];
    private doorType: any;
    private locality: any;
    private modifiedBy: any;
    private shutterId: any;
    private city: any;

    constructor() { }
    public getShutterId(): any {
        return this.shutterId;
    }
    public setShutterId(value: any) {
        this.shutterId = value;
    }
    public getModifiedBy(): any {
        return this.modifiedBy;
    }
    public setModifiedBy(value: any) {
        this.modifiedBy = value;
    }
    public getLocality(): any {
        return this.locality;
    }
    public setLocality(value: any) {
        this.locality = value;
    }
    public getCity(): any {
        return this.city;
    }
    public setCity(value: any) {
        this.city = value;
    }
    public getAdvanceToBePaid(): any {
        return this.advanceToBePaid;
    }
    public setAdvanceToBePaid(value: any) {
        this.advanceToBePaid = value;
    }
    public getNearestMedplusStoreDistance() {
        return this.nearestMedplusStoreDistance;
    }
    public setNearestMedplusStoreDistance(value) {
        this.nearestMedplusStoreDistance = value;
    }
    public getStoreDimentions(): string {
        return this.storeDimentions;
    }
    public setStoreDimentions(value: string) {
        this.storeDimentions = value;
    }
    public getStoreDepth() {
        return this.storeDepth;
    }
    public setStoreDepth(value) {
        this.storeDepth = value;
    }
    public getStoreFrontArea() {
        return this.storeFrontArea;
    }
    public setStoreFrontArea(value) {
        this.storeFrontArea = value;
    }
    public getDoorType(): any {
        return this.doorType;
    }
    public setDoorType(value: any) {
        this.doorType = value;
    }
    public getNearByMedicalShop(): any {
        return this.nearByMedicalShop;
    }
    public setNearByMedicalShop(value: any) {
        this.nearByMedicalShop = value;
    }
    public getNearByMedicalShopName(): any[] {
        return this.nearByMedicalShopName;
    }
    public setNearByMedicalShopName(value: any[]) {
        this.nearByMedicalShopName = value;
    }
    public getNearByHospitals(): any {
        return this.nearByHospitals;
    }
    public setNearByHospitals(value: any) {
        this.nearByHospitals = value;
    }
    public getNearByHospitalName(): any[] {
        return this.nearByHospitalName;
    }
    public setNearByHospitalName(value: any[]) {
        this.nearByHospitalName = value;
    }
    public getNoOfMedicalShops(): number {
        return this.noOfMedicalShops;
    }
    public setNoOfMedicalShops(value: number) {
        this.noOfMedicalShops = value;
    }
    public getReadyToOccupy(): any {
        return this.readyToOccupy;
    }
    public setReadyToOccupy(value: any) {
        this.readyToOccupy = value;
    }
    public getNoOfDaysToReady(): any {
        return this.noOfDaysToReady;
    }
    public setNoOfDaysToReady(value: any) {
        this.noOfDaysToReady = value;
    }
    public getTypeOfFloor(): any {
        return this.typeOfFloor;
    }
    public setTypeOfFloor(value: any) {
        this.typeOfFloor = value;
    }
    public getTypeOfCeiling(): any {
        return this.typeOfCeiling;
    }
    public setTypeOfCeiling(value: any) {
        this.typeOfCeiling = value;
    }
    public getPlacement(): any {
        return this.placement;
    }
    public setPlacement(value: any) {
        this.placement = value;
    }
    public getStatus() {
        return this.status;
    }
    public setStatus(status: string) {
        this.status = status;
    }
    public getOwnerName() {
        return this.ownerName;
    }
    public setOwnerName(ownerName: string) {
        this.ownerName = ownerName;
    }
    public getLandMark() {
        return this.landmark;
    }
    public setLandMark(landmark: string) {
        this.landmark = landmark;
    }
    public getLatitude() {
        return this.latitude;
    }
    public setLatitude(latitude: string) {
        this.latitude = latitude;
    }
    public getLongitude() {
        return this.longitude;
    }
    public setLongitude(longitude: string) {
        this.longitude = longitude;
    }
    public getProposedRent() {
        return this.rentPerMonth;
    }
    public setProposedRent(proposedRent: string) {
        this.rentPerMonth = proposedRent;
    }
    public getAddress() {
        return this.address;
    }
    public setAddress(address: any) {
        this.address = this.address;
    }
    public getComment(): string {
        return this.comment;
    }
    public setComment(comment: string) {
        this.comment = comment;
    }
    public getUserId(): string {
        return this.userId;
    }
    public setUserId(userId: string) {
        this.userId = userId;
    }
    public getUserMobileNo() {
        return this.userMobileNo;
    }
    public setUserMobileNo(userMobileNo: string) {
        this.userMobileNo = userMobileNo;
    }
    public getDateCreated() {
        return this.dateCreated;
    }
    public setDateCreated(date: string) {
        this.dateCreated = date;
    }
    public getOwnerMobile() {
        return this.ownerMobileNo;
    }
    public setOwnerMobileNo(ownerMobileNo: string) {
        this.ownerMobileNo = ownerMobileNo;
    }
}
