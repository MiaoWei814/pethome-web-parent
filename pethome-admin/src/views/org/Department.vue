<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="部门名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="sn" label="部门编号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="name" label="部门名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="100" sortable>
        <template scope="scope">
          <span style="color:green" v-if="scope.row.state===0">启用</span>
          <span style="color:red" v-else-if="scope.row.state===-1">禁用</span>
          <span style="color:grey" v-else>未知</span>
        </template>
			</el-table-column>
			<el-table-column prop="managerName" label="管理者" width="100" sortable>
			</el-table-column>
			<el-table-column prop="parentName" label="上级部门" width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑和新增界面-->
		<el-dialog :title="title" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="部门编号" prop="departmentNumber">
					<el-input v-model="editForm.departmentNumber" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="部门名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="resource">
					<el-radio-group v-model="editForm.resource">
						<el-radio class="radio" :label="0">启用</el-radio>
						<el-radio class="radio" :label="-1">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
        <!-- 选择框-->
        <el-form-item label="管理员" prop="manager">
          <el-select v-model="editForm.manage" clearable placeholder="请选择">
            <!--
               key:唯一的标志
               label:展示的数据
               value:传到后台的数据
               -->
            <el-option
                v-for="item in manages"
                :key="item.id"
                :label="item.username"
                :value="item.id">
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <!--级联选择-->
        <el-form-item label="上级部门" prop="parent">
          <el-cascader v-model="editForm.parent"
              :options="options"
              :props="{
                checkStrictly: true,
                label:'name',
                value:'id',
              }"
              clearable>
          </el-cascader>
        </el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
  // import {log} from "shelljs/src/common";   //这个就是罪魁祸首!!!!

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
        title: '',
				users: [],
				total: 0,
        currentPage: 1,
        pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
          departmentNumber: [
						{ required: true, message: '请输入部门编号', trigger: 'blur' }
					],
          name: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
          resource: [
						{ required: true, message: '请选择启用的状态', trigger: 'change' }
					],

				},
				//编辑界面数据
				editForm: {
					id: null,
          departmentNumber: '',
          name: '',
          resource: '',
          manage:null,
          parent:[]
				},
        //管理员列表
        manages: [],
        //上级部门
        options: [],
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					currentPage: this.currentPage,
					name: this.filters.name
				};
        //显示加载框
				this.listLoading = true;
				//NProgress.start();
				this.$http.get("/department/list",{params: para}).then((res) => {
					this.total = res.data.data.total;
          this.users = res.data.data.list;
          this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
        //row是这一行的数据
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: row.id };
					this.$http.post("/department/del",para).then((res) => {
            //关闭忙等框
						this.listLoading = false;
						if (res.data.code===200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              //重新回到第一页再请求获取数据
              this.currentPage=1;
              //重新获取数据
              this.getUsers();
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
        this.title='编辑';
				this.editFormVisible = true;
				//分配数据
        this.editForm.id=row.id
        this.editForm.departmentNumber=row.sn
        this.editForm.name=row.name
        this.editForm.resource=row.state
        this.editForm.manage=row.managerId
        this.editForm.parent=row.parentId


				// this.editForm = Object.assign({}, row); //回显数据!
        //获取管理员
        this.queryManager();
        //获取上级部门
        this.queryParentDepartment();
			},
			//显示新增界面
			handleAdd: function () {
        this.title='新增';
				this.editFormVisible = true;
				this.editForm = {
          id: null,
          departmentNumber: '',
          name: '',
          resource: '',
          manage:null,
          parent:[]
				};
        //获取管理员
        this.queryManager();
        //获取上级部门
        this.queryParentDepartment();
			},
			//编辑和新增提交页面
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//克隆数据
							let para = Object.assign({}, this.editForm);
              //数组切分转为字符串!
              if (para.parent) {
                para.parent=para.parent.join(",");
              }

							this.$http.put("/department/save",para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
      //获取选中的然后放进数组中
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
        //这里sels是一个数组,这里使用map进行类似于lambda表达式一样取出其中的id进行映射成数组然后转换为String
				var ids = this.sels.map(item => item.id).toString();
        console.log(ids);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					this.$http.post("/department/del",para).then((res) => {
            //关闭那个忙等框
						this.listLoading = false;
						//NProgress.done();
            if (res.data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              //重新回到第一页
              this.currentPage=1;
              //重新获取数据
              this.getUsers();
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
					});
				}).catch((result) => {
          this.$message({
            message: '系统繁忙',
            type: 'error'
          });
				});
			},
      //获取管理员
      queryManager:function () {
        this.$http.get("/department/queryManager")
          .then(result => {
            //发送成功之后
            this.manages = result.data.data;
          }).catch(result => {
            alert("获取管理员失败!请稍后再试!")
        })
      },
      //获取上级部门
      queryParentDepartment:function () {
        this.$http.get("/department/parentDepartmentList")
            .then(result => {
              this.options = result.data.data;
            }).catch(result => {
              this.$message({
                message: '当前系统繁忙,请稍后再试',
                type: 'error'
              });
        })
      }
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>
