export class Address {
    private postalCode: string;
    private state: string;
    private countryName: string;
    private district: string;
    private city: string;
    private locality: string;
    private thoroughfare: string;
    Address() {

    }
    getPostalCode() {
        return this.postalCode;
    }

    setPostalCode(postalCode: string) {
        this.postalCode = postalCode;
    }

    getState() {
        return this.state;
    }

    setState(state: string) {
        this.state = state;
    }

    getCountryName() {
        return this.countryName;
    }

    setCountryName(countryName: string) {
        this.countryName = countryName;
    }

    getDistrict() {
        if (this.isUndefined(this.district)) {
            return '';
        } else {
            return this.district + ',';
        }
    }

    setDistrict(district: string) {

        this.district = district;

    }

    getLocality() {
        if (this.isUndefined(this.locality)) {
            return '';
        } else {
            return this.locality + ',';
        }
    }

    setLocality(locality: string) {
        this.locality = locality;
    }

    getThoroughfare() {
        if (this.isUndefined(this.thoroughfare)) {
            return '';
        } else {
            return this.thoroughfare + ',';
        }
    }
    isUndefined(data) {
        if (data === 'undefined' || data === undefined) {
            return true;
        }
    }
    setThoroughfare(thoroughfare: string) {
        this.thoroughfare = thoroughfare;
    }

    getCity() {
        if (this.isUndefined(this.city)) {
            return '';
        } else {
            return this.city + ',';
        }
    }

    setCity(city: string) {
        this.city = city;
    }

    getGAddress() {
        return this.getThoroughfare() + ' ' + this.getLocality()
            + ' ' + this.getCity() + ' ' + this.getDistrict()
            + ' ' + this.state
            + ', ' + this.postalCode;
    }
}
