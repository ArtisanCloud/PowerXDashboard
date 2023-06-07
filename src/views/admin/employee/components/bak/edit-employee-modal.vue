<template>
  <!--  <a-modal-->
  <!--    title="编辑员工"-->
  <!--    :visible="visible"-->
  <!--    :modal-style="{ padding: '0 36px' }"-->
  <!--    @cancel="close"-->
  <!--    @ok="submit"-->
  <!--  >-->
  <!--    <a-form-->
  <!--      v-if="defaultEmployee !== undefined"-->
  <!--      ref="formRef"-->
  <!--      :model="formModel"-->
  <!--    >-->
  <!--      <a-form-item label="姓名" field="name">-->
  <!--        <a-input v-model="formModel.name" />-->
  <!--      </a-form-item>-->
  <!--      <a-form-item label="昵称" field="name">-->
  <!--        <a-input v-model="formModel.nickName" />-->
  <!--      </a-form-item>-->
  <!--      <a-form-item label="邮箱" field="email">-->
  <!--        <a-input v-model="formModel.email" />-->
  <!--      </a-form-item>-->
  <!--      <a-form :model="extraModel">-->
  <!--        <a-form-item label="角色" field="roleCodes">-->
  <!--          <a-select-->
  <!--            v-model="extraModel.roleCodes"-->
  <!--            multiple-->
  <!--            :options="options.roles"-->
  <!--            :field-names="{ label: 'name', value: 'roleCode' }"-->
  <!--          >-->
  <!--          </a-select>-->
  <!--        </a-form-item>-->
  <!--      </a-form>-->
  <!--      <a-form-item label="手机号" field="mobilePhone">-->
  <!--        <a-input v-model="formModel.mobilePhone" />-->
  <!--      </a-form-item>-->
  <!--      <a-form-item label="性别" field="gender">-->
  <!--        <a-select v-model="formModel.gender">-->
  <!--          <a-option :value="0">未知</a-option>-->
  <!--          <a-option :value="1">男</a-option>-->
  <!--          <a-option :value="2">女</a-option>-->
  <!--        </a-select>-->
  <!--      </a-form-item>-->
  <!--      <a-form-item label="部门" field="depIds">-->
  <!--        <a-tree-select-->
  <!--          v-model="formModel.depIds"-->
  <!--          multiple-->
  <!--          :field-names="{ title: 'depName', key: 'id', children: 'children' }"-->
  <!--          :data="options.depTree"-->
  <!--        />-->
  <!--      </a-form-item>-->
  <!--      <a-form-item label="职位" field="position">-->
  <!--        <a-input v-model="formModel.position" />-->
  <!--      </a-form-item>-->
  <!--      <a-form-item label="头衔" field="jobTitle">-->
  <!--        <a-input v-model="formModel.jobTitle" />-->
  <!--      </a-form-item>-->
  <!--      <a-form-item label="描述" field="desc">-->
  <!--        <a-textarea v-model="formModel.desc" />-->
  <!--      </a-form-item>-->
  <!--    </a-form>-->
  <!--  </a-modal>-->
</template>

<script lang="ts" setup>
  // import { computed, onUpdated, reactive, ref } from 'vue';
  // import {
  //   CreateEmployeeRequest,
  //   EmployeeDepartment,
  //   updateEmployee,
  //   UpdateEmployeeRequest,
  // } from '@/api/employee';
  // import { Message } from '@arco-design/web-vue';
  // import { getDepartmentTree } from '@/api/department';
  // import { AdminRole } from '@/api/permission';
  //
  // const props = defineProps({
  //   visible: Boolean,
  //   employeeId: {
  //     type: Number,
  //     default: 0,
  //   },
  // });
  //
  // const emit = defineEmits(['update:visible', 'refresh']);
  //
  // const
  //
  // const defaultEmployee = computed(() => {
  //   return props.employeeId;
  // });
  //
  // const options = reactive({
  //   depTree: [] as any[],
  //   roles: [] as Array<AdminRole>,
  // });
  // const formModel = ref({} as UpdateEmployeeRequest);
  // const formRef = ref();
  //
  // const extraModel = ref(
  //   {} as {
  //     roleCodes: string[];
  //   }
  // );
  //
  // function getDepsId(deps?: Array<EmployeeDepartment> | null) {
  //   if (deps === undefined || deps === null) {
  //     return [];
  //   }
  //   return deps.map((item) => {
  //     return item.depId;
  //   }, []);
  // }
  //
  // const close = () => {
  //   emit('update:visible', false);
  // };
  // const submit = async () => {
  //   if (await formRef.value.validate()) {
  //     Message.warning('请检查输入');
  //     return;
  //   }
  //   updateEmployee(formModel.value, defaultEmployee.value.id).then((res) => {
  //     formModel.value = {} as CreateEmployeeRequest;
  //     assignAuth({
  //       userAssignRole: {
  //         userIds: [res.data.id],
  //         roleCodes: extraModel.value.roleCodes,
  //         isReplace: true,
  //       },
  //     })
  //       .then(() => {
  //         Message.success('更新成功');
  //       })
  //       .catch(() => {
  //         Message.success('用户更新成功, 角色分配失败, 请稍后手动分配角色');
  //       })
  //       .finally(() => {
  //         close();
  //         emit('refresh', {});
  //       });
  //   });
  // };
  //
  // onUpdated(async () => {
  //   formModel.value = {
  //     name: props.employee?.name,
  //     nickName: props.employee?.nickName,
  //     desc: props.employee?.desc,
  //     email: props.employee?.email,
  //     avatar: props.employee?.avatar,
  //     externalEmail: props.employee?.externalEmail,
  //     mobilePhone: props.employee?.mobilePhone,
  //     gender: props.employee?.gender,
  //     depIds: getDepsId(props.employee?.deps),
  //     position: props.employee?.position,
  //   };
  //   extraModel.value.roleCodes = props.employee?.roles;
  //   getDepartmentTree(1).then((res) => {
  //     options.depTree = [res.data.depTree];
  //   });
  //   listRoles().then((res) => {
  //     options.roles = res.data.list;
  //   });
  // });
</script>

<style scoped></style>
