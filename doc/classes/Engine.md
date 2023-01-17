[IdeaGraphics](../README.md) / [Exports](../modules.md) / Engine

# Class: Engine

引擎类: 用于实例化化图形引擎
可以设置 Light, Camera, 为Scene 添加Mesh 开启事件监听

## Table of contents

### Constructors

- [constructor](Engine.md#constructor)

### Properties

- [animateid](Engine.md#animateid)
- [camera](Engine.md#camera)
- [canvas](Engine.md#canvas)
- [eventSystem](Engine.md#eventsystem)
- [gl](Engine.md#gl)
- [light](Engine.md#light)
- [scene](Engine.md#scene)
- [transformShader](Engine.md#transformshader)

### Methods

- [addGeo](Engine.md#addgeo)
- [addMouseMoveListener](Engine.md#addmousemovelistener)
- [clear](Engine.md#clear)
- [clearAnimate](Engine.md#clearanimate)
- [flatten](Engine.md#flatten)
- [flattenV2](Engine.md#flattenv2)
- [flattenV3](Engine.md#flattenv3)
- [pipelineRender](Engine.md#pipelinerender)
- [pipelineSetShaderAttr](Engine.md#pipelinesetshaderattr)
- [pipelineTransformRender](Engine.md#pipelinetransformrender)
- [pipelineTransformShaderInit](Engine.md#pipelinetransformshaderinit)
- [removeMouseMoveListener](Engine.md#removemousemovelistener)
- [setCamera](Engine.md#setcamera)
- [setLight](Engine.md#setlight)

## Constructors

### constructor

• **new Engine**(`id`)

Engine 构造器

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | 引擎初始画布元素 id |

#### Defined in

[Engine.ts:45](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L45)

## Properties

### animateid

• **animateid**: ``null`` \| `number`

渲染循环ID

#### Defined in

[Engine.ts:38](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L38)

___

### camera

• **camera**: `Camera`

camera 摄像机

#### Defined in

[Engine.ts:26](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L26)

___

### canvas

• **canvas**: `HTMLCanvasElement`

canvas 引擎初始化的画布

#### Defined in

[Engine.ts:20](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L20)

___

### eventSystem

• **eventSystem**: `EventSystem`

事件系统

#### Defined in

[Engine.ts:35](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L35)

___

### gl

• **gl**: `WebGL2RenderingContext`

webgl 上下文，根据初始化canvas获取

#### Defined in

[Engine.ts:17](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L17)

___

### light

• **light**: `PbrLight`

light 光照

#### Defined in

[Engine.ts:29](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L29)

___

### scene

• **scene**: `Geometric`[]

scene 场景

#### Defined in

[Engine.ts:23](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L23)

___

### transformShader

• **transformShader**: ``null`` \| `Shader`

基础着色器

#### Defined in

[Engine.ts:32](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L32)

## Methods

### addGeo

▸ **addGeo**(`geo`): `void`

添加Mesh

#### Parameters

| Name | Type |
| :------ | :------ |
| `geo` | `Geometric` |

#### Returns

`void`

#### Defined in

[Engine.ts:87](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L87)

___

### addMouseMoveListener

▸ **addMouseMoveListener**(`callback`): `void`

添加鼠标移动监听

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | (`degx`: `number`, `degy`: `number`) => `void` | 监听回调函数 |

#### Returns

`void`

#### Defined in

[Engine.ts:76](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L76)

___

### clear

▸ **clear**(): `void`

引擎管线：清除场景和动画

#### Returns

`void`

#### Defined in

[Engine.ts:295](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L295)

___

### clearAnimate

▸ **clearAnimate**(): `void`

引擎管线：清除动画

#### Returns

`void`

#### Defined in

[Engine.ts:289](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L289)

___

### flatten

▸ **flatten**(`vecs`): `Float32Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vecs` | `Vec4`[] |

#### Returns

`Float32Array`

#### Defined in

[Engine.ts:92](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L92)

___

### flattenV2

▸ **flattenV2**(`vecs`): `Float32Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vecs` | `Vec2`[] |

#### Returns

`Float32Array`

#### Defined in

[Engine.ts:115](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L115)

___

### flattenV3

▸ **flattenV3**(`vecs`): `Float32Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vecs` | `Vec3`[] |

#### Returns

`Float32Array`

#### Defined in

[Engine.ts:104](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L104)

___

### pipelineRender

▸ **pipelineRender**(): `void`

引擎管线：渲染函数

#### Returns

`void`

#### Defined in

[Engine.ts:274](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L274)

___

### pipelineSetShaderAttr

▸ **pipelineSetShaderAttr**(`shader`, `geo`): `void`

引擎管线：设置着色器属性

#### Parameters

| Name | Type |
| :------ | :------ |
| `shader` | `Shader` |
| `geo` | `Geometric` |

#### Returns

`void`

#### Defined in

[Engine.ts:134](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L134)

___

### pipelineTransformRender

▸ **pipelineTransformRender**(`geo`): `void`

引擎管线：设置基础着色器通用变量

#### Parameters

| Name | Type |
| :------ | :------ |
| `geo` | `Geometric` |

#### Returns

`void`

#### Defined in

[Engine.ts:263](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L263)

___

### pipelineTransformShaderInit

▸ **pipelineTransformShaderInit**(`geo`): `void`

引擎管线：初始化着色器

#### Parameters

| Name | Type |
| :------ | :------ |
| `geo` | `Geometric` |

#### Returns

`void`

#### Defined in

[Engine.ts:202](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L202)

___

### removeMouseMoveListener

▸ **removeMouseMoveListener**(): `void`

移除鼠标移动监听

#### Returns

`void`

#### Defined in

[Engine.ts:82](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L82)

___

### setCamera

▸ **setCamera**(`camera`): `void`

设置 摄像机

#### Parameters

| Name | Type |
| :------ | :------ |
| `camera` | `Camera` |

#### Returns

`void`

#### Defined in

[Engine.ts:126](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L126)

___

### setLight

▸ **setLight**(`light`): `void`

设置 光照

#### Parameters

| Name | Type |
| :------ | :------ |
| `light` | `PbrLight` |

#### Returns

`void`

#### Defined in

[Engine.ts:130](https://github.com/LWBliuwenbo/graphics3d/blob/b13d31a/src/engine/Engine.ts#L130)
