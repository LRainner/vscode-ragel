# Ragel Language Support for VSCode

> **注意：** 此 VSCode 扩展提供了 Ragel 状态机编译器语言的跳转支持。

[English](#english) | [中文](#中文)

---

<a id="english"></a>

## English

### Features

This extension provides navigation support for the Ragel State Machine Compiler language in Visual Studio Code:

#### Smart Navigation
- **Go to Definition**: Jump to Ragel machine, action, and state definitions within Ragel blocks
- **Document Outline**: View the structure of your Ragel files including machines, actions, and states

#### Code Intelligence
- **Context-Aware Hover Information**: Documentation for Ragel keywords and operators in Ragel blocks

#### Editor Features
- **Code Snippets**: Quick templates for common Ragel patterns
- **Bracket Matching**: Automatic matching of brackets and quotes
- **Code Folding**: Collapse machine and action blocks

### Installation

1. Download the `.vsix` file from the releases
2. In VSCode, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Type "Extensions: Install from VSIX" and select the downloaded file

### Usage

Simply open any `.rl` file to activate the extension. The extension will automatically:
- Detect Ragel code blocks and provide Ragel-specific navigation
- Let VSCode handle syntax highlighting and other language features

Key features:
- `Ctrl+Click` or `F12`: Jump to Ragel definitions
- Hover: View documentation for Ragel elements
- `Ctrl+Shift+O`: Open document outline

### Example

```ragel
%%{
    machine example;

    action print {
        printf("Match found!\n");
    }

    main := 'hello' @print;  // Ragel state machine definition
}%%

%% write data;  // Ragel directive
```

---

<a id="中文"></a>

## 中文

### 功能

此扩展为 Visual Studio Code 提供 Ragel 状态机编译器语言的跳转支持：

#### 智能导航
- **跳转到定义**：在 Ragel 块内跳转到 Ragel 机器、动作和状态定义
- **文档大纲**：查看包含机器、动作和状态的文件结构

#### 代码智能
- **上下文感知悬停信息**：在 Ragel 块中显示 Ragel 关键字和操作符文档

#### 编辑器功能
- **代码片段**：常用 Ragel 模式的快速模板
- **括号匹配**：自动匹配括号和引号
- **代码折叠**：折叠机器和动作块

### 安装

1. 从发布页下载 `.vsix` 文件
2. 在 VSCode 中，打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`）
3. 输入 "Extensions: Install from VSIX" 并选择下载的文件

### 使用方法

只需打开任何 `.rl` 文件即可激活扩展。扩展会自动：
- 检测 Ragel 代码块并提供 Ragel 特定的跳转功能
- 让 VSCode 处理语法高亮和其他语言功能

主要功能：
- `Ctrl+点击` 或 `F12`：跳转到 Ragel 定义
- 悬停：查看 Ragel 元素的文档
- `Ctrl+Shift+O`：打开文档大纲

### 示例

```ragel
%%{
    machine example;

    action print {
        printf("匹配成功！\n");
    }

    main := 'hello' @print;  // Ragel 状态机定义
}%%

%% write data;  // Ragel 指令
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