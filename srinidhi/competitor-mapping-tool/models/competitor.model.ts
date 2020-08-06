export class Competitor {
    private userMobileNo: string;
    private userId: string;
    private address: string;
    private dateCreated: string;
    private latitude: number;
    private longitude: number;
    private status: string;
    private storeDimensions: number;
    private storeFrontArea: number;
    private doorType: string;
    private locality: string;
    private createdBy: string;
    private competitorId: any;
    private city: string;
    private pincode: string;
    private ageOfShop: number;
    private pharmacyChain: string;
    private outletName: string;
    private dailySales: number;
    private comment: string;

    constructor() { }

    public setUserMobileNo(value: string) {
        this.userMobileNo = value;
    }

    public setUserId(value: string) {
        this.userId = value;
    }

    public setAddress(value: string) {
        this.address = value;
    }

    public setLatitude(value: number) {
        this.latitude = value;
    }

    public setLongitude(value: number) {
        this.longitude = value;
    }

    public setStatus(value: string) {
        this.status = value;
    }

    public setStoreDimensions(value: number) {
        this.storeDimensions = value;
    }

    public setStoreFrontArea(value: number) {
        this.storeFrontArea = value;
    }

    public setDoorType(value: string) {
        this.doorType = value;
    }

    public setLocality(value: string) {
        this.locality = value;
    }

    public setCity(value: string) {
        this.city = value;
    }

    public setPincode(value: string) {
        this.pincode = value;
    }

    public setCreatedBy(value: string) {
        this.createdBy = value;
    }

    public setAgeOfShop(value: number) {
        this.ageOfShop = value;
    }

    public setDailySales(value: number) {
        this.dailySales = value;
    }

    public setOutletName(value: string) {
        this.outletName = value;
    }

    public setPharmacyChain(value: string) {
        this.pharmacyChain = value;
    }

    public setDateCreated(date: string) {
        this.dateCreated = date;
    }

    public getUserMobileNo() {
        return this.userMobileNo;
    }

    public getCompetitorId() {
        return this.competitorId;
    }

    public getUserId() {
        return this.userId;
    }

    public getAddress() {
        return this.address;
    }

    public getLatitude() {
        return this.latitude;
    }

    public getLongitude() {
        return this.longitude;
    }

    public getStatus() {
        return this.status;
    }

    public getStoreDimensions() {
        return this.storeDimensions;
    }

    public getStoreFrontArea() {
        return this.storeFrontArea;
    }

    public getDoorType() {
        return this.doorType;
    }

    public getLocality() {
        return this.locality;
    }

    public getCity() {
        return this.city;
    }

    public getPincode() {
        return this.pincode;
    }

    public getCreatedBy() {
        return this.createdBy;
    }

    public getAgeOfShop() {
        return this.ageOfShop;
    }

    public getDailySales() {
        return this.dailySales;
    }

    public getOutletName() {
        return this.outletName;
    }

    public getPharmacyChain() {
        return this.pharmacyChain;
    }

    public getDateCreated() {
        return this.dateCreated;
    }

    public setComment(comment: string) {
        this.comment = comment;
    }

    public getComment() {
        return this.comment;
    }
}
