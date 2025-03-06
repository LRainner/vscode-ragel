# Ragel Language Support for VSCode

> **注意：** 此 VSCode 扩展是通过 [Cursor](https://cursor.sh/) 生成的。

[English](#english) | [中文](#中文)

---

<a id="english"></a>

## English

### Features

This extension provides comprehensive support for the Ragel State Machine Compiler language in Visual Studio Code:

- **Syntax Highlighting**: Colorization for Ragel keywords, operators, strings, and comments
- **Code Completion**: Suggestions for Ragel keywords, operators, and built-in actions
- **Go to Definition**: Jump to machine, action, and variable definitions
- **Hover Information**: Documentation for keywords and operators on hover
- **Document Outline**: View the structure of your Ragel files in the outline view
- **Code Snippets**: Quick templates for common Ragel patterns
- **Bracket Matching**: Automatic matching of brackets and quotes
- **Code Folding**: Collapse machine and action blocks

### Installation

1. Download the `.vsix` file from the releases
2. In VSCode, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Type "Extensions: Install from VSIX" and select the downloaded file

Or install from the VSCode Marketplace (coming soon).

### Usage

Simply open any `.rl` file to activate the extension. You can:

- Use `Ctrl+Space` to trigger code completion
- Hover over keywords for documentation
- `Ctrl+Click` or `F12` to jump to definitions
- Use snippets by typing prefixes like `machine`, `action`, etc.
- View the document structure in the Outline view (`Ctrl+Shift+O`)

### Example

```ragel
machine example;

%%{
    # This is a comment
    action print {
        printf("Match found!\n");
    }

    main := 'hello' @print;
}%%
```

---

<a id="中文"></a>

## 中文

> **注意：** 此 VSCode 扩展是通过 [Cursor](https://cursor.sh/) 生成的。

### 功能

此扩展为 Visual Studio Code 提供全面的 Ragel 状态机编译器语言支持：

- **语法高亮**：为 Ragel 关键字、操作符、字符串和注释提供着色
- **代码补全**：提供 Ragel 关键字、操作符和内置动作的建议
- **跳转到定义**：跳转到机器、动作和变量的定义
- **悬停信息**：悬停时显示关键字和操作符的文档
- **文档大纲**：在大纲视图中查看 Ragel 文件的结构
- **代码片段**：常见 Ragel 模式的快速模板
- **括号匹配**：自动匹配括号和引号
- **代码折叠**：折叠机器和动作块

### 安装

1. 从发布页下载 `.vsix` 文件
2. 在 VSCode 中，打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`）
3. 输入 "Extensions: Install from VSIX" 并选择下载的文件

或从 VSCode 市场安装（即将推出）。

### 使用方法

只需打开任何 `.rl` 文件即可激活扩展。你可以：

- 使用 `Ctrl+Space` 触发代码补全
- 将鼠标悬停在关键字上查看文档
- 使用 `Ctrl+点击` 或 `F12` 跳转到定义
- 通过输入前缀如 `machine`、`action` 等使用代码片段
- 在大纲视图中查看文档结构（`Ctrl+Shift+O`）

### 示例

```ragel
machine example;

%%{
    # 这是一个注释
    action print {
        printf("匹配成功！\n");
    }

    main := 'hello' @print;
}%%
```

## 开发

### 构建

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 打包
npm install -g vsce
vsce package
```

### 调试

在 VSCode 中打开项目，按 F5 键在开发模式下启动扩展。

---

**Generated with [Cursor](https://cursor.sh/)**