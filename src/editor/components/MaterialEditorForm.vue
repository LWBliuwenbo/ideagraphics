<template>
    <div class="material-editor-form">
        <el-form :model="materialProps" label-width="120px">
            <template v-for="(child, key) in materialSchemaJson.properties">
                <el-form-item :label="child.description">
                    <el-slider :max="1" :step="0.01" v-model="materialProps[key]" @change="() => valueChange()" />
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, toRef, Ref } from 'vue'
import { PBRMaterial } from "@/engine/Material";
interface Props {
    modelValue: PBRMaterial
}
const props = defineProps<Props>()

const modelValue = toRef(props, 'modelValue')

const emit = defineEmits(['update:modelValue', 'change'])

const materialProps: Ref<PBRMaterial> = ref(modelValue.value)

const valueChange = () => {
    emit('update:modelValue', materialProps)
    emit('change', materialProps)
}

const materialSchemaJson = {
    type: 'object',
    properties: {
        'metallic': {
            type: 'number',
            description: '金属度',
            remark: `金属度，规定电介质为0，金属为1；当值趋向1时：弱化漫反射比率，强化镜面反射强度，同时镜面反射逐渐附带上金属色半导体材质情况特殊，尽量避免使用半导体调试效果`
        },

        'subsurface': {
            type: 'number',
            description: '次表面',
            remark: '控制漫反射形状'
        },

        specular: {
            type: 'number',
            description: '高光强度',
            remark: '高光强度（镜面反射强度）,控制镜面反射光占入射光的比率，用于取代折射率'
        },

        roughness: {
            type: 'number',
            description: '粗糙度',
            remark: '粗糙度，影响漫反射和镜面反射'
        },

        specularTint: {
            type: 'number',
            description: '高光染色',
            remark: '高光染色，和baseColor一起，控制镜面反射的颜色,注意，这是非物理效果，且掠射镜面反射依然是非彩色'
        },
        anisotropic: {
            type: 'number',
            description: '各向异性程度',
            remark: '控制镜面反射在不同朝向上的强度，既镜面反射高光的纵横比,规定完全各向同性时为0，完全各项异性时为1'
        },

        sheen: {
            type: 'number',
            description: '光泽度',
            remark: '光泽度，一种额外的掠射分量，一般用于补偿布料在掠射角下的光能'
        },
        sheenTint: {
            type: 'number',
            description: '光泽色',
            remark: '光泽色，控制sheen的颜色'
        },
        clearcoat: {
            type: 'number',
            description: '清漆强度',
            remark: '控制第二个镜面反射波瓣形成及其影响范围'
        },
        clearcoatGloss: {
            type: 'number',
            description: '清漆光泽度',
            remark: '控制透明涂层的高光强度（光泽度）,规定缎面(satin)为0，光泽(gloss)为1'
        },
    }

}


</script>

<style>
.material-editor-form {
    padding: 10px;
}
</style>