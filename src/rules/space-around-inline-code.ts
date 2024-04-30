import type { MarkdownCodeNode } from '@lint-md/parser';
import type { LintMdRule, LintMdRuleContext } from '../types';

const spaceAroundInlineCode: LintMdRule = {
  meta: {
    name: 'space-around-inline-code',
  },
  create: (context: LintMdRuleContext) => {
    return {
      inlineCode: (node: MarkdownCodeNode) => {
        const result: string = context.markdown.slice(node.position.start.offset - 1, node.position.end.offset + 1);
        let newContent;

        if (result.startsWith(' `') && result.endsWith('` ')) {
          return;
        }

        if (result.includes('```')) {
          newContent = `\`\`\`${node.value}\`\`\``;
        }
        else {
          newContent = `\`${node.value}\``;
        }

        if (!result.startsWith(' `')) {
          newContent = ` ${newContent}`;
        }
        if (!result.endsWith('` ')) {
          // 最后一个字符是标点符号的情况下，不需要添加空格
          const lastChar = result[result.length - 1];
          // 定义标点符号的正则表达式
          const punctuationRegex = /[.,;:!?。，；：！？]/;

          // 如果最后一个字符不是标点符号，那么添加空格
          if (!punctuationRegex.test(lastChar)) {
            newContent = `${newContent} `;
          }
        }

        context.report({
          loc: node.position,
          message: 'test',
          fix: (fixer) => {
            return fixer.replaceTextRange(
              [node.position.start.offset, node.position.end.offset],
              newContent
            );
          },
        });
      },
    };
  },
};

export default spaceAroundInlineCode;
