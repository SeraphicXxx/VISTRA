export class StaffModel {
    constructor(data = {}) {
        this.id = data.id ?? "";
        this.firstName = data.firstName ?? "";
        this.middleName = data.middleName ?? "";
        this.lastName = data.lastName ?? "";
        this.position = data.position ?? "";
        this.specialty = data.specialty ?? "";
        this.email = data.email ?? "";
    }

    getFullName() {
        return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
}