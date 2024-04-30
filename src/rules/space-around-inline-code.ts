import type { MarkdownCodeNode } from '@lint-md/parser';
import type { LintMdRule, LintMdRuleContext } from '../types';

// 定义标点符号的正则表达式
const punctuationRegex = /[.,;:!?。，；：！？\n]/;

const spaceAroundInlineCode: LintMdRule = {
  meta: {
    name: 'space-around-inline-code',
  },
  create: (context: LintMdRuleContext) => {
    return {
      inlineCode: (node: MarkdownCodeNode) => {
        if (node?.spaceAroundFlag) {
          let result: string;

          if (node.position.start.offset > 0) {
            result = context.markdown.slice(node.position.start.offset - 1, node.position.end.offset + 1);
          }
          else {
            // 如果行内代码为第一个节点，那么不需要添加空格，走第一个字符是标点符号的情况下的逻辑来跳过
            result = `\n${context.markdown.slice(0, node.position.end.offset + 1)}`;
          }

          let newContent = node.value;

          if (result.startsWith(' `') && result.endsWith('` ')) {
            return;
          }

          if (result.includes('```')) {
            newContent = `\`\`\`${newContent}\`\`\``;
          }
          else {
            newContent = `\`${newContent}\``;
          }

          let flag = 0;

          // 第一个字符是标点符号的情况下，不需要添加空格
          if (!result.startsWith(' `')) {
            const firstChar = result[0];

            // 如果第一个字符不是标点符号，那么添加空格
            if (!punctuationRegex.test(firstChar)) {
              newContent = ` ${newContent}`;
            }
            else {
              flag++;
            }
          }

          // 最后一个字符是标点符号的情况下，不需要添加空格
          if (!result.endsWith('` ')) {
            const lastChar = result[result.length - 1];

            // 如果最后一个字符不是标点符号，那么添加空格
            if (!punctuationRegex.test(lastChar)) {
              newContent = `${newContent} `;
            }
            else {
              flag++;
            }
          }

          // 如果第一个字符和最后一个字符都是标点符号，那么不需要添加空格
          if (flag === 2) {
            return;
          }

          context.report({
            loc: node.position,
            message: '行内代码周围的文本需要添加空格',
            fix: (fixer) => {
              return fixer.replaceTextRange(
                [node.position.start.offset, node.position.end.offset],
                newContent
              );
            },
          });
        }
      },
    };
  },
};

export default spaceAroundInlineCode;
