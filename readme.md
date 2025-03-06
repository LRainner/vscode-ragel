# Ragel Language Support for VSCode

> **注意：** 此 VSCode 扩展提供了 Ragel 状态机编译器语言的完整支持。

[English](#english) | [中文](#中文)

---

<a id="english"></a>

## English

### Features

This extension provides comprehensive support for the Ragel State Machine Compiler language in Visual Studio Code:

#### Language Support
- **Mixed Language Support**: Intelligent recognition and support for both Ragel and host language (C/C++)
- **Syntax Highlighting**: 
  - Accurate colorization for Ragel code blocks (`%%{...}%%`)
  - Proper highlighting for host language code (C/C++)
  - Special highlighting for Ragel directives (`%% write`)

#### Smart Navigation
- **Go to Definition**: 
  - Jump to Ragel machine, action, and state definitions
  - Support C/C++ header files and function definitions in non-Ragel sections
- **Document Outline**: View the structure of your Ragel files including machines, actions, and states

#### Code Intelligence
- **Context-Aware Hover Information**: 
  - Ragel keywords and operators documentation in Ragel blocks
  - Standard C/C++ hover information in host language sections
- **Smart Code Completion**: 
  - Ragel keywords, operators, and built-in actions
  - Custom action suggestions with @ prefix
  - Standard C/C++ completions in host language sections

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
- Detect and highlight Ragel code blocks and host language sections
- Provide context-aware features based on cursor position

Key features:
- `Ctrl+Space`: Trigger context-aware code completion
- `Ctrl+Click` or `F12`: Jump to definitions (works for both Ragel and C/C++)
- Hover: View documentation for Ragel elements or C/C++ symbols
- `Ctrl+Shift+O`: Open document outline

### Example

```ragel
#include <stdio.h>  // C code with proper highlighting

%%{
    machine example;

    action print {  // Ragel action with C code inside
        printf("Match found!\n");
    }

    main := 'hello' @print;  // Ragel state machine definition
}%%

%% write data;  // Ragel directive

int main() {    // C code with proper highlighting
    // ...
}
```

---

<a id="中文"></a>

## 中文

### 功能

此扩展为 Visual Studio Code 提供全面的 Ragel 状态机编译器语言支持：

#### 语言支持
- **混合语言支持**：智能识别并支持 Ragel 和宿主语言（C/C++）
- **语法高亮**：
  - 准确着色 Ragel 代码块（`%%{...}%%`）
  - 正确高亮宿主语言代码（C/C++）
  - 特殊高亮 Ragel 指令（`%% write`）

#### 智能导航
- **跳转到定义**：
  - 跳转到 Ragel 机器、动作和状态定义
  - 支持非 Ragel 部分的 C/C++ 头文件和函数定义
- **文档大纲**：查看包含机器、动作和状态的文件结构

#### 代码智能
- **上下文感知悬停信息**：
  - Ragel 块中显示 Ragel 关键字和操作符文档
  - 宿主语言部分显示标准 C/C++ 悬停信息
- **智能代码补全**：
  - Ragel 关键字、操作符和内置动作
  - 带 @ 前缀的自定义动作建议
  - 宿主语言部分的标准 C/C++ 补全

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
- 检测并高亮 Ragel 代码块和宿主语言部分
- 根据光标位置提供上下文相关功能

主要功能：
- `Ctrl+Space`：触发上下文感知的代码补全
- `Ctrl+点击` 或 `F12`：跳转到定义（适用于 Ragel 和 C/C++）
- 悬停：查看 Ragel 元素或 C/C++ 符号的文档
- `Ctrl+Shift+O`：打开文档大纲

### 示例

```ragel
#include <stdio.h>  // C 代码，具有正确的高亮

%%{
    machine example;

    action print {  // Ragel 动作，内部包含 C 代码
        printf("匹配成功！\n");
    }

    main := 'hello' @print;  // Ragel 状态机定义
}%%

%% write data;  // Ragel 指令

int main() {    // C 代码，具有正确的高亮
    // ...
}
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