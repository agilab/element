<script>
  module.exports = {
    data() {
      return {
        popupVisible: false
      };
    },
    methods: {
    }
  };
</script>

## Popup 对话框
在保留当前页面状态的情况下，告知用户并承载相关操作。

### 基本用法

Popup 弹出一个对话框，适合需要定制性更大的场景。

:::demo 需要设置`visible`属性，它接收`Boolean`，当为`true`时显示 Popup。Popup 分为两个部分：`body`和`footer`，`footer`需要具名为`footer`的`slot`。`title`属性用于定义标题，它是可选的，默认值为空。最后，本例还展示了`before-close`的用法。

```html
<el-button type="text" @click="popupVisible = true">点击打开 Popup</el-button>

<el-popup
  title="提示"
  :visible.sync="popupVisible"
  width="30%">
  <span>这是一段信息</span>
  <span slot="footer" class="popup-footer">
    <el-button size="small" @click="popupVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="popupVisible = false">确 定</el-button>
  </span>
</el-popup>

<script>
  export default {
    data() {
      return {
        popupVisible: false
      };
    },
    methods: {
    }
  };
</script>
```
:::

:::tip
相关用法及参数参考 [Dialog](/#/zh-CN/component/dialog) 组件。
:::