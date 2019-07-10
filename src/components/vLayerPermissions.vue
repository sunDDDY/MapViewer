<template>
  <div
    id="mainDIV"
    :style="adjustmentStyleWidget"
  >
    <b-btn
      v-for="(item, index) in vectorLayers"
      :key="index"
      v-b-modal="'myModal'"
      style="display: block; margin-top: 3px ; height: 18px;"
      type="button"
      class="btn btn-info btn-xs"
      @click="getCurrentVLayer(item)"
    >
      <i class="fas fa-ellipsis-h"></i>
    </b-btn>
    <!-- Modal Component -->
    <b-modal
      id="myModal"
      :title="'Sharing permissions for layer: ' + VLayer.Name"
      :header-border-variant="footerBgVariant"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      :body-bg-variant="bodyBgVariant"
      :body-text-variant="bodyTextVariant"
      :footer-bg-variant="footerBgVariant"
      :footer-text-variant="footerTextVariant"
      size="lg"
      hide-footer
    >
      <b-container fluid>
        <b-tabs>
          <b-tab
            title="User"
            active
            style="margin-top: 20px"
          >
            <b-row md="10">
              <b-col>
                <b-form-select
                  v-model="userTabGroupSelected"
                  :options="userTabGroups"
                ></b-form-select>
              </b-col>
              <b-col>
                <b-form-select
                  v-model="userTabUserSelected"
                  :options="userTabUsers"
                  class="mb-3"
                ></b-form-select>
              </b-col>
              <b-col sm="2">
                <b-btn
                  class="mb-3"
                  @click="addUser(userTabUserSelected)"
                >
                  Add User
                </b-btn>
              </b-col>
            </b-row>
            <b-table
              hover
              :items="items"
              :fields="fields"
            ></b-table>
          </b-tab>
          <b-tab
            title="Group"
            style="margin-top: 20px"
          >
            <b-row>
              <b-col cols="5">
                <b-form-select
                  v-model="groupTabGroupSelected"
                  :options="groupTabGroups"
                  class="mb-3"
                ></b-form-select>
              </b-col>
              <b-col>
                <b-btn
                  class="mb-3"
                  @click="addGroup(groupTabGroupSelected)"
                >
                  Add Group
                </b-btn>
              </b-col>
            </b-row>
          </b-tab>
          <b-tab
            title="Role"
            style="margin-top: 20px"
          >
            <b-row>
              <b-col cols="5">
                <b-form-select
                  v-model="roleTabRoleSelected"
                  :options="roleTabRoles"
                  class="mb-3"
                ></b-form-select>
              </b-col>
              <b-col>
                <b-btn
                  class="mb-3"
                  @click="addRole(roleTabRoleSelected)"
                >
                  Add Role
                </b-btn>
              </b-col>
            </b-row>
          </b-tab>
        </b-tabs>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
    import accessAPI from '../js/api/api-v1'; // import api
    import _ from 'lodash';

    const items = [
        { Name: 'Vasya', age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
    ];

    export default {
        name: "VLayerPermissions",
        props: {
            layersTreeWith: {type: Number, default: null},
            layersTreeHeight: {type: Number, default: null},
            vectorLayers: {type: Array, default: null}
        },
        data() {
            return {
                fields: ['Name', 'No', 'View','Full','Remove'],
                items: items,
                api: null,
                headerBgVariant: 'secondary',
                headerTextVariant: 'light',
                bodyBgVariant: 'light',
                bodyTextVariant: 'dark',
                footerBgVariant: 'light',
                footerTextVariant: 'dark',
                VLayer: '',
                adjustmentStyleWidget: {
                    marginRight: this.layersTreeWith + 5 + 'px',
                    marginTop: this.layersTreeHeight + 68 + 'px'
                },
                selected: null,
                groups: [],
                userTabGroups: [],
                userTabUsers: [],
                groupTabGroups: [],
                roleTabRoles: [],
                userTabGroupSelected: null,
                userTabUserSelected: null,
                groupTabGroupSelected: null,
                roleTabRoleSelected: null,
                message: null,
                options: [
                    { value: ['allah','allah2'], text: 'This is First option' },
                    { value: 'b', text: 'Default Selected Option' },
                    { value: 'c', text: 'This is another option' },
                    { value: 'd', text: 'This one is disabled', disabled: true },
                    { value: 'e', text: 'This is option e' },
                    { value: 'f', text: 'This is option f' },
                    { value: 'g', text: 'This is option g' }
                ],
            };
        },
        watch: {
            userTabGroupSelected : async function (selectedGroup) {
                if(selectedGroup!==null){
                let users = await this.api.getGroupsEmployees(selectedGroup);
                this.userTabUsers = this.getUserOptions(users);
                } else {
                    this.userTabUsers = [{value: null, text: 'Please select an user', disabled:true}];
                }
            }
        },
        async mounted() {
            this.api = await accessAPI();
        },
        methods: {
            showMessage(text) {
                this.$message({
                    showClose: true,
                    message: text,
                    type: 'success'
                });
            },
            addRole : async function (selectedRole) {
                let addRole = await this.api.postVLayersRolePermissions(this.VLayer, 'Full', selectedRole);
                this.showMessage(addRole);

            },
            addGroup : async function (selectedGroup){
                let addGroup = await this.api.postVLayersGroupPermissions(this.VLayer, 'Full', selectedGroup);
                this.showMessage(addGroup);
            },
            addUser : async function (selectedUser) {
                let addUser = await this.api.postVLayersUserPermissions(this.VLayer, 'Full', selectedUser);
                this.showMessage(addUser);
            },
            getCurrentVLayer: async function (item) {
                this.VLayer = item;
                this.groupTabGroups = await this.getGroupsOptions();
                this.userTabGroups = await this.getGroupsOptions();
                this.roleTabRoles = await this.getRoleOptions();
            },
            getGroupsOptions: async function () {
                let groups = await this.api.getGroups();
                let flat = await this.flatGroups(groups);
                groups = this.replaceKeyOptions(flat);
                return [{value: null, text: 'Please select an group', disabled:true}, ...groups];
            },
            getRoleOptions: async function () {
                let roles = await this.api.getRoles();
                roles = this.replaceKeyOptions(roles);
                return [{value: null, text: 'Please select an role', disabled:true}, ...roles];
            },
            getUserOptions : function (users) {
                users = this.replaceKeyOptions(users);
                return [{value: null, text: 'Please select an user', disabled:true}, ...users];
            },
            replaceKeyOptions: function (array) { // replace [ID,Name] property to [value,text] respectively
                _.findKey(array, function (o) {
                    o.value = o.ID;
                    o.text = o.Name;
                    delete o.ID;
                    delete o.Name;
                });
                return array;
            },
            flatGroups: async function (groups) {
                const flatten = function (obj) {
                    const array = Array.isArray(obj) ? obj : [obj];
                    return array.reduce(function (acc, value) {
                        acc.push(value);
                        if (value.Children) {
                            acc = acc.concat(flatten(value.Children));
                            delete value.Children;
                        }
                        return acc;
                    }, []);
                };
                return flatten(groups);
            },
        },
    };
</script>

<style scoped>
    #mainDIV {
        float: right;
        margin-right: 156px;
        margin-top: 112px;
        position: relative;
        z-index: 100;

    }

    .btn-group-xs > .btn, .btn-xs {
        padding: .25rem .4rem;
        font-size: .875rem;
        line-height: .5;
        border-radius: .2rem;
        z-index: 100;
    }
</style>
