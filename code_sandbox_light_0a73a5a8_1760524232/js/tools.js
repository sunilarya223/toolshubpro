/**
 * ===================================================================
 * ADVANCED TOOL WEBSITE - TOOLS FUNCTIONALITY
 * Interactive JavaScript for all tool features
 * ===================================================================
 */

'use strict';

/**
 * ===================================================================
 * TOOL NAVIGATION MANAGER
 * Handles switching between different tools
 * ===================================================================
 */

class ToolManager {
  constructor() {
    this.currentTool = 'code-formatter';
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupToolNavigation());
    } else {
      this.setupToolNavigation();
    }
  }

  setupToolNavigation() {
    const toolButtons = document.querySelectorAll('.tool-nav-btn');
    const toolContainers = document.querySelectorAll('.tool-container');

    toolButtons.forEach(button => {
      button.addEventListener('click', () => {
        const toolId = button.getAttribute('data-tool');
        this.switchTool(toolId);
        
        // Update active button
        toolButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });

    // Handle URL hash navigation
    this.handleHashNavigation();
    window.addEventListener('hashchange', () => this.handleHashNavigation());
  }

  switchTool(toolId) {
    const toolContainers = document.querySelectorAll('.tool-container');
    
    toolContainers.forEach(container => {
      if (container.id === toolId) {
        container.classList.remove('hidden-tool');
      } else {
        container.classList.add('hidden-tool');
      }
    });

    this.currentTool = toolId;
    
    // Update URL hash
    if (window.history && window.history.pushState) {
      window.history.pushState(null, null, `#${toolId}`);
    }
  }

  handleHashNavigation() {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const toolButton = document.querySelector(`[data-tool="${hash}"]`);
      if (toolButton) {
        toolButton.click();
      }
    }
  }
}

/**
 * ===================================================================
 * CODE FORMATTER FUNCTIONALITY
 * Handles code formatting and beautification
 * ===================================================================
 */

class CodeFormatter {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupCodeFormatter());
    } else {
      this.setupCodeFormatter();
    }
  }

  setupCodeFormatter() {
    const formatButton = document.getElementById('format-code');
    const minifyButton = document.getElementById('minify-code');
    const copyButton = document.getElementById('copy-formatted');
    const codeInput = document.getElementById('code-input');
    const autoFormat = document.getElementById('auto-format');

    if (!formatButton) return;

    formatButton.addEventListener('click', () => this.formatCode());
    minifyButton.addEventListener('click', () => this.minifyCode());
    copyButton.addEventListener('click', () => this.copyFormattedCode());

    // Auto-format on paste if enabled
    codeInput.addEventListener('paste', (e) => {
      if (autoFormat.checked) {
        setTimeout(() => this.formatCode(), 100);
      }
    });
  }

  formatCode() {
    const input = document.getElementById('code-input').value;
    const language = document.getElementById('code-language').value;
    const indentSize = parseInt(document.getElementById('indent-size').value);
    const removeComments = document.getElementById('remove-comments').checked;

    if (!input.trim()) {
      this.showMessage('Please enter some code to format.', 'warning');
      return;
    }

    try {
      let formatted;
      
      switch (language) {
        case 'json':
          formatted = this.formatJSON(input);
          break;
        case 'javascript':
          formatted = this.formatJavaScript(input, indentSize, removeComments);
          break;
        case 'css':
          formatted = this.formatCSS(input, indentSize);
          break;
        case 'html':
          formatted = this.formatHTML(input, indentSize);
          break;
        case 'xml':
          formatted = this.formatXML(input, indentSize);
          break;
        case 'sql':
          formatted = this.formatSQL(input);
          break;
        default:
          formatted = input;
      }

      document.getElementById('code-output').value = formatted;
      this.showMessage('Code formatted successfully!', 'success');
    } catch (error) {
      this.showMessage('Error formatting code: ' + error.message, 'error');
    }
  }

  formatJSON(input) {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  }

  formatJavaScript(input, indentSize, removeComments) {
    // Basic JavaScript formatting
    let code = input;
    
    if (removeComments) {
      code = code.replace(/\/\*[\s\S]*?\*\//g, '');
      code = code.replace(/\/\/.*$/gm, '');
    }
    
    // Basic formatting rules
    code = code.replace(/;\s*}/g, ';\n}');
    code = code.replace(/{\s*/g, '{\n');
    code = code.replace(/}\s*/g, '\n}\n');
    code = code.replace(/;\s*(?!$)/g, ';\n');
    
    // Apply indentation
    const lines = code.split('\n');
    let indentLevel = 0;
    const indent = ' '.repeat(indentSize);
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.includes('}')) indentLevel--;
      const formatted = indent.repeat(Math.max(0, indentLevel)) + trimmed;
      if (trimmed.includes('{')) indentLevel++;
      return formatted;
    }).join('\n');
  }

  formatCSS(input, indentSize) {
    const indent = ' '.repeat(indentSize);
    return input
      .replace(/{\s*/g, ' {\n')
      .replace(/;\s*/g, ';\n')
      .replace(/}\s*/g, '\n}\n')
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.includes('}')) return trimmed;
        if (trimmed.includes('{')) return trimmed;
        return indent + trimmed;
      })
      .join('\n');
  }

  formatHTML(input, indentSize) {
    const indent = ' '.repeat(indentSize);
    let formatted = input;
    let indentLevel = 0;
    
    // Basic HTML formatting
    formatted = formatted.replace(/></g, '>\n<');
    const lines = formatted.split('\n');
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('</')) indentLevel--;
      const result = indent.repeat(Math.max(0, indentLevel)) + trimmed;
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indentLevel++;
      }
      
      return result;
    }).join('\n');
  }

  formatXML(input, indentSize) {
    return this.formatHTML(input, indentSize);
  }

  formatSQL(input) {
    return input
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bAND\b/gi, '\n  AND')
      .replace(/\bOR\b/gi, '\n  OR')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
      .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
      .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
      .replace(/\bORDER BY\b/gi, '\nORDER BY')
      .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      .trim();
  }

  minifyCode() {
    const input = document.getElementById('code-input').value;
    const language = document.getElementById('code-language').value;

    if (!input.trim()) {
      this.showMessage('Please enter some code to minify.', 'warning');
      return;
    }

    try {
      let minified;
      
      switch (language) {
        case 'json':
          const parsed = JSON.parse(input);
          minified = JSON.stringify(parsed);
          break;
        case 'css':
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, ';}')
            .replace(/{\s*/g, '{')
            .replace(/;\s*/g, ';')
            .trim();
          break;
        default:
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .replace(/\s+/g, ' ')
            .trim();
      }

      document.getElementById('code-output').value = minified;
      this.showMessage('Code minified successfully!', 'success');
    } catch (error) {
      this.showMessage('Error minifying code: ' + error.message, 'error');
    }
  }

  async copyFormattedCode() {
    const output = document.getElementById('code-output').value;
    if (!output) {
      this.showMessage('Nothing to copy. Format some code first.', 'warning');
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      this.showMessage('Code copied to clipboard!', 'success');
    } catch (error) {
      this.showMessage('Failed to copy to clipboard', 'error');
    }
  }

  showMessage(message, type) {
    // Create or update message element
    let messageEl = document.querySelector('#code-formatter .tool-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.className = 'tool-message';
      messageEl.style.cssText = `
        padding: 0.75rem 1rem;
        border-radius: var(--border-radius);
        margin: 1rem 0;
        font-weight: 500;
      `;
      document.querySelector('#format-code').parentNode.appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `tool-message ${type}`;

    const colors = {
      success: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', border: 'rgba(16, 185, 129, 0.2)' },
      error: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', border: 'rgba(239, 68, 68, 0.2)' },
      warning: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)', border: 'rgba(245, 158, 11, 0.2)' }
    };

    const style = colors[type] || colors.success;
    messageEl.style.backgroundColor = style.bg;
    messageEl.style.color = style.color;
    messageEl.style.border = `1px solid ${style.border}`;

    setTimeout(() => messageEl.remove(), 3000);
  }
}

/**
 * ===================================================================
 * TEXT UTILITIES FUNCTIONALITY
 * Handles text manipulation and analysis
 * ===================================================================
 */

class TextUtilities {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupTextUtilities());
    } else {
      this.setupTextUtilities();
    }
  }

  setupTextUtilities() {
    const textInput = document.getElementById('text-input');
    const textOutput = document.getElementById('text-output');

    if (!textInput) return;

    // Update statistics in real-time
    textInput.addEventListener('input', () => this.updateStats());
    
    // Initialize stats
    this.updateStats();
  }

  updateStats() {
    const text = document.getElementById('text-input').value;
    
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lineCount = text.split('\n').length;
    const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim()).length;

    document.getElementById('char-count').textContent = charCount;
    document.getElementById('word-count').textContent = wordCount;
    document.getElementById('line-count').textContent = lineCount;
    document.getElementById('paragraph-count').textContent = paragraphCount;
  }
}

// Global text transformation functions
function transformText(operation) {
  const input = document.getElementById('text-input').value;
  const output = document.getElementById('text-output');
  
  if (!input.trim()) {
    output.value = '';
    return;
  }

  let result;
  
  switch (operation) {
    case 'uppercase':
      result = input.toUpperCase();
      break;
    case 'lowercase':
      result = input.toLowerCase();
      break;
    case 'title':
      result = input.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      break;
    case 'sentence':
      result = input.toLowerCase().replace(/(^\w|[.!?]\s*\w)/g, txt => 
        txt.toUpperCase());
      break;
    case 'reverse':
      result = input.split('').reverse().join('');
      break;
    case 'clean':
      result = input.replace(/\s+/g, ' ').trim();
      break;
    default:
      result = input;
  }

  output.value = result;
}

function findReplace() {
  const text = document.getElementById('text-input').value;
  const findText = document.getElementById('find-text').value;
  const replaceText = document.getElementById('replace-text').value;
  const output = document.getElementById('text-output');

  if (!findText) {
    output.value = text;
    return;
  }

  const result = text.replace(new RegExp(findText, 'g'), replaceText);
  output.value = result;
}

async function copyTextOutput() {
  const output = document.getElementById('text-output').value;
  if (!output) return;

  try {
    await navigator.clipboard.writeText(output);
    // Show success feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    btn.style.backgroundColor = 'var(--success-color)';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.backgroundColor = '';
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
}

/**
 * ===================================================================
 * CALCULATOR FUNCTIONALITY
 * Advanced calculator with history and scientific functions
 * ===================================================================
 */

class Calculator {
  constructor() {
    this.display = '';
    this.history = [];
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupCalculator());
    } else {
      this.setupCalculator();
    }
  }

  setupCalculator() {
    const display = document.getElementById('calc-display');
    if (!display) return;

    // Keyboard support
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    this.updateDisplay();
  }

  handleKeyboard(event) {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
      appendToDisplay(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
      appendToDisplay(key);
    } else if (key === '.') {
      appendToDisplay('.');
    } else if (key === 'Enter') {
      calculateResult();
    } else if (key === 'Escape') {
      clearCalculator();
    } else if (key === 'Backspace') {
      deleteLast();
    }
  }

  updateDisplay() {
    const display = document.getElementById('calc-display');
    if (display) {
      display.value = this.display || '0';
    }
  }

  addToHistory(expression, result) {
    this.history.unshift({ expression, result, timestamp: new Date() });
    if (this.history.length > 50) {
      this.history.pop();
    }
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    const historyEl = document.getElementById('calc-history');
    if (!historyEl) return;

    if (this.history.length === 0) {
      historyEl.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 1rem;">No calculations yet</div>';
      return;
    }

    historyEl.innerHTML = this.history.slice(0, 10).map(item => `
      <div style="padding: 0.25rem 0; border-bottom: 1px solid var(--border-primary); cursor: pointer;" 
           onclick="document.getElementById('calc-display').value = '${item.result}'; calculator.display = '${item.result}';">
        <div style="font-size: 0.8rem; color: var(--text-muted);">${item.expression}</div>
        <div style="font-weight: 600;">${item.result}</div>
      </div>
    `).join('');
  }
}

// Global calculator instance
let calculator = new Calculator();

// Global calculator functions
function appendToDisplay(value) {
  const display = document.getElementById('calc-display');
  
  if (calculator.display === '0' && value !== '.') {
    calculator.display = value;
  } else {
    calculator.display += value;
  }
  
  calculator.updateDisplay();
}

function clearCalculator() {
  calculator.display = '';
  calculator.updateDisplay();
}

function deleteLast() {
  calculator.display = calculator.display.slice(0, -1);
  calculator.updateDisplay();
}

function calculateResult() {
  try {
    const expression = calculator.display.replace(/×/g, '*');
    const result = eval(expression);
    
    calculator.addToHistory(calculator.display, result);
    calculator.display = result.toString();
    calculator.updateDisplay();
  } catch (error) {
    calculator.display = 'Error';
    calculator.updateDisplay();
    setTimeout(() => {
      calculator.display = '';
      calculator.updateDisplay();
    }, 1500);
  }
}

function calculateFunction(func) {
  const current = parseFloat(calculator.display) || 0;
  let result;

  try {
    switch (func) {
      case 'sqrt':
        result = Math.sqrt(current);
        break;
      case 'pow':
        result = Math.pow(current, 2);
        break;
      case 'sin':
        result = Math.sin(current * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(current * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(current * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(current);
        break;
      case 'ln':
        result = Math.log(current);
        break;
      default:
        result = current;
    }

    calculator.addToHistory(`${func}(${current})`, result);
    calculator.display = result.toString();
    calculator.updateDisplay();
  } catch (error) {
    calculator.display = 'Error';
    calculator.updateDisplay();
  }
}

function clearHistory() {
  calculator.history = [];
  calculator.updateHistoryDisplay();
}

/**
 * ===================================================================
 * DATA CONVERTER FUNCTIONALITY
 * Handles conversion between different data formats
 * ===================================================================
 */

class DataConverter {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupConverter());
    } else {
      this.setupConverter();
    }
  }

  setupConverter() {
    const convertButton = document.getElementById('convert-data');
    const validateButton = document.getElementById('validate-data');
    const copyButton = document.getElementById('copy-converted');

    if (!convertButton) return;

    convertButton.addEventListener('click', () => this.convertData());
    validateButton.addEventListener('click', () => this.validateData());
    copyButton.addEventListener('click', () => this.copyConvertedData());
  }

  convertData() {
    const input = document.getElementById('data-input').value;
    const inputFormat = document.getElementById('input-format').value;
    const outputFormat = document.getElementById('output-format').value;
    const prettyPrint = document.getElementById('pretty-print').checked;
    const output = document.getElementById('data-output');

    if (!input.trim()) {
      this.showConverterMessage('Please enter some data to convert.', 'warning');
      return;
    }

    try {
      // Parse input
      let data = this.parseData(input, inputFormat);
      
      // Convert to output format
      let converted = this.formatData(data, outputFormat, prettyPrint);
      
      output.value = converted;
      this.showConverterMessage('Data converted successfully!', 'success');
    } catch (error) {
      this.showConverterMessage('Conversion error: ' + error.message, 'error');
    }
  }

  parseData(input, format) {
    switch (format) {
      case 'json':
        return JSON.parse(input);
      case 'xml':
        return this.parseXML(input);
      case 'csv':
        return this.parseCSV(input);
      case 'yaml':
        return this.parseYAML(input);
      default:
        throw new Error('Unsupported input format');
    }
  }

  formatData(data, format, prettyPrint) {
    switch (format) {
      case 'json':
        return prettyPrint ? JSON.stringify(data, null, 2) : JSON.stringify(data);
      case 'xml':
        return this.toXML(data, prettyPrint);
      case 'csv':
        return this.toCSV(data);
      case 'yaml':
        return this.toYAML(data);
      default:
        throw new Error('Unsupported output format');
    }
  }

  parseXML(xmlString) {
    // Basic XML parsing (simplified)
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    
    if (doc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format');
    }
    
    return this.xmlToObject(doc.documentElement);
  }

  xmlToObject(node) {
    const obj = {};
    
    // Handle attributes
    if (node.attributes && node.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let attr of node.attributes) {
        obj['@attributes'][attr.name] = attr.value;
      }
    }
    
    // Handle child nodes
    if (node.children.length === 0) {
      return node.textContent;
    }
    
    for (let child of node.children) {
      const childName = child.nodeName;
      const childValue = this.xmlToObject(child);
      
      if (obj[childName]) {
        if (Array.isArray(obj[childName])) {
          obj[childName].push(childValue);
        } else {
          obj[childName] = [obj[childName], childValue];
        }
      } else {
        obj[childName] = childValue;
      }
    }
    
    return obj;
  }

  parseCSV(csvString) {
    const lines = csvString.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
    
    return data;
  }

  parseYAML(yamlString) {
    // Basic YAML parsing (very simplified)
    const lines = yamlString.split('\n').filter(line => line.trim());
    const obj = {};
    
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        obj[key] = isNaN(value) ? value : parseFloat(value);
      }
    });
    
    return obj;
  }

  toXML(data, prettyPrint) {
    const indent = prettyPrint ? '  ' : '';
    const newline = prettyPrint ? '\n' : '';
    
    function objectToXML(obj, level = 0) {
      let xml = '';
      const currentIndent = indent.repeat(level);
      
      for (let key in obj) {
        if (key === '@attributes') continue;
        
        const value = obj[key];
        if (Array.isArray(value)) {
          value.forEach(item => {
            xml += `${currentIndent}<${key}>${newline}`;
            if (typeof item === 'object') {
              xml += objectToXML(item, level + 1);
            } else {
              xml += `${indent.repeat(level + 1)}${item}${newline}`;
            }
            xml += `${currentIndent}</${key}>${newline}`;
          });
        } else if (typeof value === 'object') {
          xml += `${currentIndent}<${key}>${newline}`;
          xml += objectToXML(value, level + 1);
          xml += `${currentIndent}</${key}>${newline}`;
        } else {
          xml += `${currentIndent}<${key}>${value}</${key}>${newline}`;
        }
      }
      
      return xml;
    }
    
    return `<?xml version="1.0" encoding="UTF-8"?>${newline}<root>${newline}${objectToXML(data, 1)}</root>`;
  }

  toCSV(data) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.map(h => `"${h}"`).join(','));
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        return `"${value}"`;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }

  toYAML(data) {
    function objectToYAML(obj, indent = 0) {
      let yaml = '';
      const spaces = '  '.repeat(indent);
      
      for (let key in obj) {
        const value = obj[key];
        if (Array.isArray(value)) {
          yaml += `${spaces}${key}:\n`;
          value.forEach(item => {
            yaml += `${spaces}  - ${typeof item === 'object' ? '\n' + objectToYAML(item, indent + 2) : item}\n`;
          });
        } else if (typeof value === 'object') {
          yaml += `${spaces}${key}:\n`;
          yaml += objectToYAML(value, indent + 1);
        } else {
          yaml += `${spaces}${key}: ${value}\n`;
        }
      }
      
      return yaml;
    }
    
    return objectToYAML(data);
  }

  validateData() {
    const input = document.getElementById('data-input').value;
    const format = document.getElementById('input-format').value;

    if (!input.trim()) {
      this.showConverterMessage('Please enter some data to validate.', 'warning');
      return;
    }

    try {
      this.parseData(input, format);
      this.showConverterMessage(`Valid ${format.toUpperCase()} format!`, 'success');
    } catch (error) {
      this.showConverterMessage(`Invalid ${format.toUpperCase()}: ${error.message}`, 'error');
    }
  }

  async copyConvertedData() {
    const output = document.getElementById('data-output').value;
    if (!output) {
      this.showConverterMessage('Nothing to copy. Convert some data first.', 'warning');
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      this.showConverterMessage('Data copied to clipboard!', 'success');
    } catch (error) {
      this.showConverterMessage('Failed to copy to clipboard', 'error');
    }
  }

  showConverterMessage(message, type) {
    let messageEl = document.querySelector('#data-converter .tool-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.className = 'tool-message';
      messageEl.style.cssText = `
        padding: 0.75rem 1rem;
        border-radius: var(--border-radius);
        margin: 1rem 0;
        font-weight: 500;
      `;
      document.querySelector('#convert-data').parentNode.appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `tool-message ${type}`;

    const colors = {
      success: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', border: 'rgba(16, 185, 129, 0.2)' },
      error: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', border: 'rgba(239, 68, 68, 0.2)' },
      warning: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)', border: 'rgba(245, 158, 11, 0.2)' }
    };

    const style = colors[type] || colors.success;
    messageEl.style.backgroundColor = style.bg;
    messageEl.style.color = style.color;
    messageEl.style.border = `1px solid ${style.border}`;

    setTimeout(() => messageEl.remove(), 4000);
  }
}

/**
 * ===================================================================
 * INITIALIZE TOOLS
 * Initialize all tool functionality when page loads
 * ===================================================================
 */

// Initialize tools when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTools);
} else {
  initializeTools();
}

function initializeTools() {
  new ToolManager();
  new CodeFormatter();
  new TextUtilities();
  new Calculator();
  new DataConverter();
  
  console.log('🔧 Advanced Tools initialized successfully!');
}