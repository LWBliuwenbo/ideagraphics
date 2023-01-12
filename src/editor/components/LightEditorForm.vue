<template>
    <div class="material-editor-form">
        <el-form :model="lightProps" label-width="120px">
            <template v-for="(child, key) in lightSchemaJson.properties">
                <el-form-item :label="child.description" >
                    <template v-if="key=='type' " >
                        <ElSelect v-model="lightProps[key]" @change="valueChange" >
                            <el-option v-for="item in child?.items" :label="item.label" :value="item.value"></el-option>
                        </ElSelect>
                    </template>
                    <template v-if="key=='color'" >
                        <ColorInput v-model="lightProps[key]" @change="valueChange"/>
                    </template>

                    <template v-if="key=='position'">
                        <Vec3Input v-model="lightProps[key]" @change="valueChange"/>
                    </template>

                    <template v-if="key=='itensity'">
                        <el-slider v-model="lightProps[key]" :max="9000" :step="10" @change="valueChange" />
                    </template>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, toRef, Ref } from 'vue'
import { DirectionalLight } from "@/engine/Light";
import ColorInput from './formitem/ColorInput.vue';
import Vec3Input from './formitem/Vec3Input.vue';
interface Props {
    modelValue: DirectionalLight
}
const props = defineProps<Props>()

const modelValue = toRef(props, 'modelValue')

const emit = defineEmits(['update:modelValue', 'change'])

const lightProps: Ref<DirectionalLight> = ref(modelValue.value)

const valueChange = () => {
    emit('update:modelValue', lightProps)
    emit('change', lightProps)
}

const lightSchemaJson = {
    type: 'object',
    properties: {
        'type':{
            type: 'number',
            description: '光照类型',
            remark: '光照类型',
            kind: 'select',
            items:[{
                label:'直接光照：平行光',
                value: 0
            },{
                label:'直接光照：点光源',
                value: 1
            }]
        },
        'position': {
            type: 'object',
            description: '光照位置',
            remark: `光照位置`,
            kind: 'vec3',
            items:[]
        },

        'color': {
            type: 'object',
            description: '光照颜色',
            remark: '光照颜色',
            kind: 'color',
            items:[]

        },

        itensity: {
            type: 'number',
            description: '照度',
            remark: '照度',
            kind: 'input',
            items:[]

        }
    }

}


</script>

<style>
.material-editor-form {
    padding: 10px;
}
</style>