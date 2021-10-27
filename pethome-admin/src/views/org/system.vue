<template>
  <section>
    <el-row :gutter="10">
      <!--这是左边-->
      <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true">
            <el-form-item>
              <span>数据字典目录</span>
            </el-form-item>
            <hr/>
            <br/>
            <el-form-item>
              <el-button class="el-icon-circle-plus" @click="openSaveType">新建</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="el-icon-refresh" @click="typeNew">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-table
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            @current-change="getchangeDetails"
            style="width: 100%">
          <el-table-column
              type="index"
              label="索引"
              width="200">
          </el-table-column>
          <el-table-column
              property="name"
              label="字典名"
              width="200">
          </el-table-column>
          <el-table-column
              property="sn"
              label="字典编号"
              width="180">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
              <el-button @click="drawer = true" type="primary" size="small">点击</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 20px">
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;"></el-pagination>
        </div>

      </el-col>
      <!--这是右边-->
      <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
        <!-- 工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true">
            <el-form-item>
              <span>数据字典明细</span>
            </el-form-item>
            <hr/>
            <br/>
            <el-form-item>
              <el-button class="el-icon-circle-plus" @click="openSaveDetail">新建</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="el-icon-refresh" @click="typeNew">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-table
            ref="singleTable"
            :data="tableDataDetail"
            border
            style="width: 100%">
          <el-table-column
              type="index"
              label="编号"
              width="200">
          </el-table-column>
          <el-table-column
              property="name"
              label="字典项名"
              width="200">
          </el-table-column>
          <el-table-column
              property="id"
              label="id"
              width="180">
          </el-table-column>
          <!-- 添加-->
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="handleEditDetail(scope.$index, scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="handleDetailDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>


        <div style="margin-top: 20px">
          <el-pagination layout="prev, pager, next" @current-change="DetailCurrentChange" :page-size="pageSize" :total="DetailTotal" style="float:right;"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 编辑和新增页面-->
    <el-dialog :title="title" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="字典名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典编号" prop="sn">
          <el-input v-model="editForm.sn" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 第二个界面显示新增界面-->
    <el-dialog :title="detailTitle" :visible.sync="editFormVisibleDetail" :close-on-click-modal="false">
      <el-form :model="editDetailForm" label-width="80px" :rules="editFormDetailRules" ref="editDetailForm">
        <el-form-item label="明细名" prop="name">
          <el-input v-model="editDetailForm.name" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisibleDetail = false">取消</el-button>
        <el-button type="primary" @click.native="editDetailSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 窗体-->
    <el-drawer
        title="字典明细"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose">

        <!-- 工具条-->
        <el-table
            ref="singleTable"
            :data="tableDataDetail"
            border
            style="width: 100%">
          <el-table-column
              type="index"
              label="编号"
              width="100">
          </el-table-column>
          <el-table-column
              property="name"
              label="字典项名"
              width="100">
          </el-table-column>
          <el-table-column
              property="id"
              label="id"
              width="180">
          </el-table-column>
          <!-- 添加-->
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="handleEditDetail(scope.$index, scope.row)">修改</el-button>
              <el-button type="danger" size="small" @click="handleDetailDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>


        <div style="margin-top: 20px">
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="2" style="float:right;"></el-pagination>
        </div>


    </el-drawer>
  </section>
</template>

<script>


	export default {
		data() {
			return {
        title:"",
        detailTitle:"",
        editForm:{
          id:null,
          name:null,
          sn:null
        },
        editDetailForm:{
          id:null,
          name:null,
          typeId:null
        },
        typeId:null,
        tableData: [],
        tableDataDetail:[],
        DetailTotal:0,
        pageSize:10,
        total:0,
        currentRow: null,
        //编辑页面显示
        editFormVisible:false,
        //等待框是否显示
        editLoading: false,
        DetailCurrent:null,
        // 规则验证
        editFormRules: {
          name: [
            {required: true, message: '请输入字典名', trigger: 'blur'}
          ],
          sn: [
            {required: true, message: '请输入字典编号', trigger: 'blur'}
          ]
        },
        editFormDetailRules:{
          name: [
            {required: true, message: '请输入明细名', trigger: 'blur'}
          ],
        },
        //第二个界面
        editFormVisibleDetail:false,
        drawer: false,
        direction: 'rtl',
			}
		},
		methods: {
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      //type类型分页获取当前页
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      DetailCurrentChange(val) {
        this.DetailCurrent = val;
      },
      //获取字典类型数据list
      getType(){
        let para = {
          currentPage: this.currentPage,
        };
        this.$http.get("/system/list",{params: para})
          .then((res)=>{
            //发送成功
            this.tableData=res.data.data.list;
            this.total=res.data.data.total;
          })
      },
      //根据当前type表格选中然后传入后端获取详细信息
      getchangeDetails(currentRow){
        this.typeId=currentRow.id;
        this.DetailListDetail();
      },
      DetailListDetail(){
        if (this.typeId!=null) {
          let para = {
            "id":this.typeId,
            "currentPage":this.DetailCurrent
          }

          this.$http.get("/system/detailList",{params:para})
              .then((res)=>{
                //发送成功
                this.tableDataDetail=res.data.data.list;
                this.DetailTotal=res.data.data.total;
              });
        }else{
          this.tableDataDetail=[];
          this.DetailTotal=0;
        }

      },
      //显示新增页面:
      openSaveType:function () {
        this.title="添加数据字典"
        this.editFormVisible = true;
        //清除缓存
        this.editForm={
          id:null,
          name:null,
          sn:null
        }
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.title='编辑数据字典';
        this.editFormVisible = true;
        //分配数据
        this.editForm.id=row.id
        this.editForm.name=row.name
        this.editForm.sn=row.sn
      },
      //编辑和新增提交页面
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //克隆数据
              let para = Object.assign({}, this.editForm);

              this.$http.put("/system/typeSave",para).then((res) => {
                this.editLoading = false;
                if (res.data.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                }else{
                  this.$message({
                    message:res.data.msg,
                    type: 'error'
                  });
                }
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getType();
              });
            });
          }
        });
      },
      //删除
      handleDel: function (index, row) {
        //row是这一行的数据
        this.$confirm('删除数据字典会同时删除数据字典明细?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          this.$http.get("/system/typeDel",{params:para}).then((res) => {
            //关闭忙等框
            this.listLoading = false;
            if (res.data.code===200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              //重新获取数据
              this.getType();
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
      //type刷新
      typeNew:function () {
        this.DetailListDetail();
      },

      //详细 显示新增页面
      openSaveDetail:function () {
        this.detailTitle="添加明细"
        this.editFormVisibleDetail = true;
        //清除缓存
        this.editDetailForm={
          id:null,
          name:null,
          typeId: this.typeId
        }
      },
      //详细 显示编辑页面
      handleEditDetail:function (index, row) {
        this.detailTitle='修改详细';
        this.editFormVisibleDetail = true;
        //分配数据
        this.editDetailForm.id=row.id
        this.editDetailForm.name=row.name
        this.editDetailForm.typeId = this.typeId;
      },
      //详细 编辑和新增提交页面
      editDetailSubmit:function () {
        this.$refs.editDetailForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //克隆数据
              let para = Object.assign({}, this.editDetailForm);

              this.$http.put("/system/detailSave",para).then((res) => {
                this.editLoading = false;
                if (res.data.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                }else{
                  this.$message({
                    message:res.data.msg,
                    type: 'error'
                  });
                }
                this.$refs['editDetailForm'].resetFields();
                this.editFormVisibleDetail = false;
                this.DetailListDetail();
              });
            });
          }
        });
      },
      //详细 删除
      handleDetailDel: function (index, row) {
        //row是这一行的数据
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          this.$http.get("/system/detailDel",{params:para}).then((res) => {
            //关闭忙等框
            this.listLoading = false;
            if (res.data.code===200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              //重新获取数据
              this.DetailListDetail();
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
      //抽屉
      handleClose(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
      }
		},
		mounted() {
      this.getType();
		}
	}

</script>

<style>
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
