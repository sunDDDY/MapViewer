import Auth from "./api-auth";
import fetch from 'isomorphic-fetch'; //  for IE 11

let apiURL = "https://api.issukraine.com/api";

class API_V1 {

    constructor() {
        this._apiVersionURL = `${apiURL}/v1`;
    }

    static async getSingleton() {
        if(!API_V1._instance) {
            const api = new API_V1();
            api.user = await Auth.run(true);
            API_V1._instance = api;
        }
        return API_V1._instance;
    }


    async _get(url) {
        return fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                'Authorization': `Bearer ${this.user.accessToken}`
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
        }).then(response => response.json()); // parses response to JSON
    }

    async _post(url, data) {
        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                'Authorization': `Bearer ${this.user.accessToken}`
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(response => response.json()); // parses response to JSON
    }

    async _patch(url, data) {
        return fetch(url, {
            method: "PATCH", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                'Authorization': `Bearer ${this.user.accessToken}`
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    }

    async _delete(url) {
        return fetch(url, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                'Authorization': `Bearer ${this.user.accessToken}`
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
        });
    }

    // Current Employee
    async getCurrentEmployee() { // get
        let url = `${this._apiVersionURL}/Employees/Current`;
        return await this._get(url, true);
    }

    // Groups
    async getGroups() { // get
        let url = `${this._apiVersionURL}/Groups`;
        return await this._get(url, true);
    }

    async getGroupsEmployees(id) { // get
        let url = `${this._apiVersionURL}/Groups/${id}/Employees`;
        return await this._get(url, true);
    }

    // ImgLayers
    async getTileURLPattern(imgLayerID) { // get
        let url = `${this._apiVersionURL}/ImgLayers/${imgLayerID}/ImgTiles/{z}/{x}/{y}`;
        if (this.user.accessToken) {
            url += `?access_token=${this.user.accessToken}`;
        }
        return url;
    }

    // ImgMaps
    async getImgMap(imgMapID) { // get
        let url = `${this._apiVersionURL}/ImgMaps/${imgMapID}`;
        return await this._get(url, true);
    }

    async getImgMapsVLayers(imgMapID) { // get
        let url = `${this._apiVersionURL}/ImgMaps/${imgMapID}/VLayers`;
        return await this._get(url, true);
    }

    async postImgMapsVLayers(imgMapID, name) { // post
        let url = `${this._apiVersionURL}/ImgMaps/${imgMapID}/VLayers`;
        let data = {
            "Name": name
        };
        return await this._post(url, data, true);
    }

    async getImgMapsImgLayers(imgMapID) { // get
        let url = `${this._apiVersionURL}/ImgMaps/${imgMapID}/ImgLayers`;
        return await this._get(url, true);
    }

    async getImgMapsSearchRow(ImgMapID) { // get
        let url = `${this._apiVersionURL}/ImgMaps/${ImgMapID}/SearchRow`;
        return await this._get(url, true);
    }

    async getImgMapsSearchRows(inputText) { // get
        let maxRows = 10;
        let url = `${this._apiVersionURL}/ImgMaps/SearchRows?input=${inputText}&maxNum=${maxRows}`;
        return await this._get(url, true);
    }

    // Roles
    async getRoles() { // get
        let url = `${this._apiVersionURL}/Roles`;
        return await this._get(url, true);
    }

    // Vectors
    async patchVectors(vector) { // patch
        let url = `${this._apiVersionURL}/Vectors`;
        let data = {
                ID: vector.ID,
                type: vector.type,
                id : vector.id,
                geometry: vector.geometry,
                properties: vector.properties
        };
        return await this._patch(url, data);
    }

    async deleteVectors(vectorID) {
        let url = `${this._apiVersionURL}/Vectors/${vectorID}`;
        return await this._delete(url, false);
    }

    // VLayers
    async getVectors(vLayerID) { // get Vectors
        let url = `${this._apiVersionURL}/VLayers/${vLayerID}/Vectors`;
        return await this._get(url, true);
    }

    async postVectors(vLayerID, vector) {
        let url = `${this._apiVersionURL}/VLayers/${vLayerID}/Vectors`;
        let data = {
                type: vector.type,
                geometry: vector.geometry,
                properties: vector.properties,
        };
        return await this._post(url, data);
    }

    async getVLayersRolePermissions(vLayerID) { // get [pass VLayer]
        let url = `${this._apiVersionURL}/VLayers/${vLayerID}/RolePermissions`;
        return await this._get(url, true);
    }

    async postVLayersRolePermissions(vLayer, userAccess, roleID) { // post [pass VLayer]
        let url = `${this._apiVersionURL}/VLayers/${vLayer.ID}/RolePermissions`;
        let data = {
            "UserAccess": userAccess, // [View, Full]
            "RoleID": roleID // example '4fd9e539-1fee-41db-afb2-fb4f0d8aee95'

        };
        return await this._post(url, data, false);
    }

    async getVLayersUserPermissions(vLayer) { // get [pass VLayer]
        let url = `${this._apiVersionURL}/VLayers/${vLayer.ID}/UserPermissions`;
        return await this._get(url, true);
    }

    async postVLayersUserPermissions(vLayer, userAccess, employeeID) { // post UserPermissions
        let url = `${this._apiVersionURL}/VLayers/${vLayer.ID}/UserPermissions`;
        let data = {
            "UserAccess": userAccess, // [View, Full, No]
            "EmployeeID": employeeID // example '1309'

        };
        return await this._post(url, data, false);
    }

    async getVLayersGroupPermissions(vLayerID) { // get GroupPermissions
        let url = `${this._apiVersionURL}/VLayers/${vLayerID}/GroupPermissions`;
        return await this._get(url, true);
    }

    async postVLayersGroupPermissions(vLayer, userAccess, groupID) { // post GroupPermissions
        let url = `${this._apiVersionURL}/VLayers/${vLayer.ID}/GroupPermissions`;
        let data = {
            "UserAccess": userAccess, // [View, Full]
            "GroupID": groupID // example '9'

        };
        return await this._post(url, data, false);
    }

    async patchVLayers(vLayer) { // patch
        let url = `${this._apiVersionURL}/VLayers`;
        let data = {
            ID: vLayer.ID,
            Name: vLayer.Name,
            //GeoJSON: vLayer.GeoJSON
        };
        return await this._patch(url, data, false);
    }

    async patchVLayersPermissions(vLayerPermissions, userAccess) { // patch
        let url = `${this._apiVersionURL}/VLayers/Permissions`;
        let data = {
            ID: vLayerPermissions,
            "UserAccess": userAccess
        };
        return await this._patch(url, data, false);
    }

    async deleteVLayersPermissions(permissionsID) { // delete
        let url = `${this._apiVersionURL}/VLayers/Permissions/${permissionsID}`;
        return await this._delete(url, false);
    }
}

export default function accessAPI() {
    return API_V1.getSingleton();
}

