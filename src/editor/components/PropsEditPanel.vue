<template>
    <div class="props-edit-panel">
        <div class="props-edit-panel-title">材质设置</div>
        <div class="props-edit-panel-body">
            <el-collapse v-model="collpase_active" >
                <el-collapse-item title="材质" name="material">
                    <MaterialEditorForm  v-model="material" @change="propsChange"/>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PBRMaterial } from '@/engine/Material';
import {ref} from 'vue'
import MaterialEditorForm from './MaterialEditorForm.vue';

const emit = defineEmits(['propsSet'])

const collpase_active = ref('material')

const material = new PBRMaterial();
const propsChange = () => {
    emit('propsSet', material)
}
</script>

<style>
.props-edit-panel-title {
    padding: 10px 0;
}
.props-edit-panel {
    width: 350px;
    position: fixed;
    right: 0;
    top:0;
    padding: 20px 40px;
}
</style>