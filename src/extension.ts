import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Ragel 扩展已激活');

    // 注册代码补全提供程序
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'ragel',
        new RagelCompletionItemProvider(),
        '.', '@', '%'
    );

    // 注册定义提供程序（用于跳转到定义）
    const definitionProvider = vscode.languages.registerDefinitionProvider(
        'ragel',
        new RagelDefinitionProvider()
    );

    // 注册悬停提供程序（用于显示文档）
    const hoverProvider = vscode.languages.registerHoverProvider(
        'ragel',
        new RagelHoverProvider()
    );

    // 注册文档符号提供程序（用于大纲视图）
    const documentSymbolProvider = vscode.languages.registerDocumentSymbolProvider(
        'ragel',
        new RagelDocumentSymbolProvider()
    );

    context.subscriptions.push(
        completionProvider,
        definitionProvider,
        hoverProvider,
        documentSymbolProvider
    );
}

// 代码补全提供程序
class RagelCompletionItemProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        _context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        // 检查位置是否在 Ragel 代码块内
        if (!RagelUtils.isPositionInRagelBlock(document, position)) {
            return null; // 在非 Ragel 代码中不提供补全
        }

        const completionItems: vscode.CompletionItem[] = [];

        // Ragel 关键字
        const keywords = [
            'machine', 'action', 'alphtype', 'getkey', 'access', 'variable',
            'write', 'export', 'include', 'import', 'prepush', 'postpop',
            'when', 'inwhen', 'outwhen', 'err', 'lerr', 'eof', 'noerror',
            'nofinal', 'noprefix', 'noend'
        ];

        keywords.forEach(keyword => {
            const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
            item.detail = `Ragel 关键字: ${keyword}`;
            completionItems.push(item);
        });

        // Ragel 操作符
        const operators = [
            ':=', '=', '|', '&', '-', '*', '?', '+', '!', '^', '..', '$', '%',
            '>', '<', '@', '//'
        ];

        operators.forEach(operator => {
            const item = new vscode.CompletionItem(operator, vscode.CompletionItemKind.Operator);
            item.detail = `Ragel 操作符: ${operator}`;
            completionItems.push(item);
        });

        // 内置动作
        const builtinActions = [
            'fpc', 'fc', 'fcurs', 'ftargs', 'fentry'
        ];

        builtinActions.forEach(action => {
            const item = new vscode.CompletionItem(action, vscode.CompletionItemKind.Function);
            item.detail = `Ragel 内置动作: ${action}`;
            completionItems.push(item);
        });

        // 添加当前文件中定义的动作
        this.addDefinedActions(document, completionItems);

        return completionItems;
    }

    // 添加文件中定义的动作
    private addDefinedActions(document: vscode.TextDocument, completionItems: vscode.CompletionItem[]): void {
        const text = document.getText();
        const actionRegex = /action\s+(\w+)\s*{/g;
        let match;
        
        while ((match = actionRegex.exec(text)) !== null) {
            const actionName = match[1];
            const item = new vscode.CompletionItem(actionName, vscode.CompletionItemKind.Function);
            item.detail = `Ragel 自定义动作: ${actionName}`;
            item.insertText = new vscode.SnippetString(`@${actionName}`);
            completionItems.push(item);
        }
    }
}

// 定义提供程序
class RagelDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const word = document.getText(wordRange);
        
        // 检查位置是否在 Ragel 代码块内
        const isInRagelBlock = RagelUtils.isPositionInRagelBlock(document, position);
        
        if (isInRagelBlock) {
            // 在 Ragel 代码块内，查找 Ragel 相关定义
            return this.findRagelDefinitions(document, word);
        } else {
            // 在宿主语言代码中，尝试查找宿主语言定义
            return this.findHostLanguageDefinitions(document, position, word);
        }
    }

    // 查找 Ragel 相关定义
    private findRagelDefinitions(document: vscode.TextDocument, word: string): vscode.Location[] {
        const text = document.getText();
        const locations: vscode.Location[] = [];
        
        // 查找机器定义
        const machineRegex = new RegExp(`machine\\s+${word}\\s*;`, 'g');
        let match;
        while ((match = machineRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            locations.push(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)));
        }
        
        // 查找动作定义
        const actionRegex = new RegExp(`action\\s+${word}\\s*{`, 'g');
        while ((match = actionRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            locations.push(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)));
        }
        
        // 查找状态定义
        const stateRegex = new RegExp(`\\b${word}\\s*(:=|=)`, 'g');
        while ((match = stateRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            locations.push(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)));
        }
        
        return locations;
    }
    
    // 查找宿主语言定义
    private async findHostLanguageDefinitions(
        document: vscode.TextDocument, 
        position: vscode.Position,
        word: string
    ): Promise<vscode.Location[]> {
        // 检测宿主语言类型
        const hostLanguage = RagelUtils.detectHostLanguage(document);
        
        // 如果是 C/C++，使用 C/C++ 的定义提供程序
        if (hostLanguage === 'c' || hostLanguage === 'cpp') {
            try {
                // 创建一个虚拟的 C/C++ 文件
                const virtualUri = document.uri.with({ path: document.uri.path + '.c' });
                const virtualDocument = await vscode.workspace.openTextDocument(virtualUri);
                
                // 尝试使用 C/C++ 的定义提供程序
                const definitions = await vscode.commands.executeCommand<vscode.Location[]>(
                    'vscode.executeDefinitionProvider',
                    virtualUri,
                    position
                );
                
                if (definitions && definitions.length > 0) {
                    return definitions;
                }
                
                // 如果内置提供程序没有找到定义，尝试在工作区中查找
                const workspaceFiles = await vscode.workspace.findFiles(
                    '{**/*.h,**/*.c,**/*.cpp,**/*.hpp}',
                    '**/node_modules/**'
                );
                
                for (const file of workspaceFiles) {
                    const fileContent = await vscode.workspace.openTextDocument(file);
                    const locations = await this.findCDefinitionsInFile(fileContent, word);
                    if (locations.length > 0) {
                        return locations;
                    }
                }
            } catch (error) {
                console.error('Error finding C/C++ definitions:', error);
            }
        }
        
        return [];
    }
    
    // 添加一个新方法来在文件中查找 C 定义
    private async findCDefinitionsInFile(
        document: vscode.TextDocument,
        word: string
    ): Promise<vscode.Location[]> {
        const text = document.getText();
        const locations: vscode.Location[] = [];
        
        // 查找头文件定义
        if (document.fileName.endsWith('.h')) {
            const headerRegex = new RegExp(`\\b${word}\\.h\\b`);
            if (headerRegex.test(document.fileName)) {
                locations.push(new vscode.Location(
                    document.uri,
                    new vscode.Position(0, 0)
                ));
            }
        }
        
        // 查找函数声明和定义
        const functionRegex = new RegExp(`\\b(\\w+\\s+)?${word}\\s*\\([^)]*\\)\\s*[{;]`, 'g');
        let match;
        while ((match = functionRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            locations.push(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)));
        }
        
        // 查找类型定义
        const typeRegex = new RegExp(`\\b(struct|union|enum|typedef)\\s+${word}\\b`, 'g');
        while ((match = typeRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            locations.push(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)));
        }
        
        return locations;
    }
}

// 悬停提供程序
class RagelHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        // 检查位置是否在 Ragel 代码块内
        if (RagelUtils.isPositionInRagelBlock(document, position)) {
            return this.provideRagelHover(document, position);
        } else {
            // 对于非 Ragel 代码，我们不提供自定义悬停信息
            // VSCode 会使用相应语言的悬停提供程序
            return null;
        }
    }

    // 为 Ragel 代码提供悬停信息
    private provideRagelHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.Hover> {
        const wordRange = document.getWordRangeAtPosition(position);
        const lineText = document.lineAt(position.line).text;
        
        // Ragel 关键字文档
        const keywordDocs: { [key: string]: string } = {
            'machine': '定义一个有限状态机',
            'action': '定义一个动作',
            'alphtype': '指定字母表类型',
            'getkey': '指定如何获取输入字符',
            'access': '指定如何访问数据',
            'variable': '指定状态变量',
            'write': '指定输出文件',
            'export': '导出标签',
            'include': '包含另一个文件',
            'import': '导入另一个机器',
            'prepush': '定义压栈前的动作',
            'postpop': '定义出栈后的动作',
            'when': '条件执行',
            'inwhen': '条件进入',
            'outwhen': '条件退出',
            'err': '错误处理',
            'lerr': '行错误处理',
            'eof': '文件结束处理',
            'noerror': '禁用错误报告',
            'nofinal': '禁用最终状态检查',
            'noprefix': '禁用前缀',
            'noend': '禁用结束标记',
            'main': '主状态机定义'
        };

        // 操作符文档
        const operatorDocs: { [key: string]: string } = {
            ':=': '赋值操作符',
            '=': '定义操作符',
            '|': '并联操作符',
            '&': '交集操作符',
            '-': '差集操作符',
            '*': '克林闭包（零次或多次）',
            '?': '可选（零次或一次）',
            '+': '正闭包（一次或多次）',
            '!': '否定',
            '^': '控制优先级',
            '..': '范围操作符',
            '$': '所有字符转换动作',
            '%': '最终转换动作',
            '>': '进入动作',
            '<': '离开动作',
            '@': '标记动作',
            '//': '注释'
        };

        // 检查是否悬停在关键字上
        if (wordRange) {
            const word = document.getText(wordRange);
            if (word in keywordDocs) {
                return new vscode.Hover(`**${word}**: ${keywordDocs[word]}`);
            }
            
            // 检查是否悬停在动作引用上（@action）
            if (word.startsWith('@')) {
                const actionName = word.substring(1);
                return new vscode.Hover(`**${word}**: 引用名为 "${actionName}" 的动作`);
            }
        }

        // 检查是否悬停在操作符上
        for (const op in operatorDocs) {
            if (lineText.includes(op)) {
                const opIndex = lineText.indexOf(op);
                if (position.character >= opIndex && position.character <= opIndex + op.length) {
                    return new vscode.Hover(`**${op}**: ${operatorDocs[op]}`);
                }
            }
        }

        return null;
    }
}

// 文档符号提供程序
class RagelDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const symbols: vscode.DocumentSymbol[] = [];
        const text = document.getText();

        // 查找机器定义
        const machineRegex = /machine\s+(\w+)\s*{/g;
        let machineMatch;
        while ((machineMatch = machineRegex.exec(text)) !== null) {
            const machineName = machineMatch[1];
            const startPos = document.positionAt(machineMatch.index);
            
            // 查找匹配的结束括号
            let braceCount = 1;
            let endIndex = machineMatch.index + machineMatch[0].length;
            
            while (braceCount > 0 && endIndex < text.length) {
                if (text[endIndex] === '{') {
                    braceCount++;
                } else if (text[endIndex] === '}') {
                    braceCount--;
                }
                endIndex++;
            }
            
            const endPos = document.positionAt(endIndex);
            const machineRange = new vscode.Range(startPos, endPos);
            
            const machineSymbol = new vscode.DocumentSymbol(
                machineName,
                'State Machine',
                vscode.SymbolKind.Class,
                machineRange,
                new vscode.Range(startPos, document.positionAt(machineMatch.index + machineMatch[0].length))
            );
            
            // 查找机器内的动作和状态
            const machineContent = text.substring(machineMatch.index + machineMatch[0].length, endIndex - 1);
            
            // 查找动作定义
            const actionRegex = /action\s+(\w+)\s*{/g;
            let actionMatch;
            while ((actionMatch = actionRegex.exec(machineContent)) !== null) {
                const actionName = actionMatch[1];
                const actionStartPos = document.positionAt(machineMatch.index + machineMatch[0].length + actionMatch.index);
                
                // 查找动作的结束括号
                let actionBraceCount = 1;
                let actionEndIndex = actionMatch.index + actionMatch[0].length;
                
                while (actionBraceCount > 0 && actionEndIndex < machineContent.length) {
                    if (machineContent[actionEndIndex] === '{') {
                        actionBraceCount++;
                    } else if (machineContent[actionEndIndex] === '}') {
                        actionBraceCount--;
                    }
                    actionEndIndex++;
                }
                
                const actionEndPos = document.positionAt(machineMatch.index + machineMatch[0].length + actionEndIndex);
                const actionRange = new vscode.Range(actionStartPos, actionEndPos);
                
                const actionSymbol = new vscode.DocumentSymbol(
                    actionName,
                    'Action',
                    vscode.SymbolKind.Function,
                    actionRange,
                    new vscode.Range(actionStartPos, document.positionAt(machineMatch.index + machineMatch[0].length + actionMatch.index + actionMatch[0].length))
                );
                
                machineSymbol.children.push(actionSymbol);
            }
            
            // 查找状态定义
            const stateRegex = /(\w+)\s*=/g;
            let stateMatch;
            while ((stateMatch = stateRegex.exec(machineContent)) !== null) {
                const stateName = stateMatch[1];
                const stateStartPos = document.positionAt(machineMatch.index + machineMatch[0].length + stateMatch.index);
                
                // 查找状态定义的结束（分号）
                let stateEndIndex = stateMatch.index + stateMatch[0].length;
                while (stateEndIndex < machineContent.length && machineContent[stateEndIndex] !== ';') {
                    stateEndIndex++;
                }
                
                const stateEndPos = document.positionAt(machineMatch.index + machineMatch[0].length + stateEndIndex + 1);
                const stateRange = new vscode.Range(stateStartPos, stateEndPos);
                
                const stateSymbol = new vscode.DocumentSymbol(
                    stateName,
                    'State',
                    vscode.SymbolKind.Variable,
                    stateRange,
                    new vscode.Range(stateStartPos, document.positionAt(machineMatch.index + machineMatch[0].length + stateMatch.index + stateMatch[0].length))
                );
                
                machineSymbol.children.push(stateSymbol);
            }
            
            symbols.push(machineSymbol);
        }

        return symbols;
    }
}

// 工具类
class RagelUtils {
    // 检查位置是否在 Ragel 代码块内
    static isPositionInRagelBlock(document: vscode.TextDocument, position: vscode.Position): boolean {
        const text = document.getText();
        const offset = document.offsetAt(position);
        
        // 查找所有 Ragel 代码块
        const blockStartRegex = /%%\{/g;
        const blockEndRegex = /\}%%/g;
        
        let blockStarts: number[] = [];
        let blockEnds: number[] = [];
        
        let match;
        while ((match = blockStartRegex.exec(text)) !== null) {
            blockStarts.push(match.index);
        }
        
        while ((match = blockEndRegex.exec(text)) !== null) {
            blockEnds.push(match.index + 3); // 3 是 }%% 的长度
        }
        
        // 检查位置是否在任何一个 Ragel 代码块内
        for (let i = 0; i < Math.min(blockStarts.length, blockEnds.length); i++) {
            if (offset > blockStarts[i] && offset < blockEnds[i]) {
                return true;
            }
        }
        
        // 检查是否在 %% write 指令上
        const line = document.lineAt(position.line).text;
        if (line.trim().startsWith('%%') && line.includes('write')) {
            return true;
        }
        
        return false;
    }
    
    // 检查偏移量是否在 Ragel 代码块内
    static isOffsetInRagelBlock(document: vscode.TextDocument, offset: number): boolean {
        const text = document.getText();
        
        // 查找所有 Ragel 代码块
        const blockStartRegex = /%%\{/g;
        const blockEndRegex = /\}%%/g;
        
        let blockStarts: number[] = [];
        let blockEnds: number[] = [];
        
        let match;
        while ((match = blockStartRegex.exec(text)) !== null) {
            blockStarts.push(match.index);
        }
        
        while ((match = blockEndRegex.exec(text)) !== null) {
            blockEnds.push(match.index + 3); // 3 是 }%% 的长度
        }
        
        // 检查偏移量是否在任何一个 Ragel 代码块内
        for (let i = 0; i < Math.min(blockStarts.length, blockEnds.length); i++) {
            if (offset > blockStarts[i] && offset < blockEnds[i]) {
                return true;
            }
        }
        
        // 检查是否在 %% write 指令上
        const position = document.positionAt(offset);
        const line = document.lineAt(position.line).text;
        if (line.trim().startsWith('%%') && line.includes('write')) {
            return true;
        }
        
        return false;
    }
    
    // 检测宿主语言类型
    static detectHostLanguage(document: vscode.TextDocument): string {
        const text = document.getText();
        
        // 检查是否包含 C/C++ 特征
        if (text.includes('#include') || 
            /\b(int|void|char|float|double|struct|class)\s+\w+/.test(text)) {
            // 检查是否有 C++ 特有特征
            if (text.includes('namespace') || 
                text.includes('template') || 
                text.includes('::') || 
                text.includes('std::')) {
                return 'cpp';
            }
            return 'c';
        }
        
        // 可以添加其他语言的检测逻辑
        
        // 默认返回 C
        return 'c';
    }
}

export function deactivate() {} 