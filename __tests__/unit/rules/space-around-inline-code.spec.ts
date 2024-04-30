import { createFixer } from '../../utils/test-utils';
import spaceAroundInlineCode from '../../../src/rules/space-around-inline-code';

const fixer = createFixer([{
  rule: spaceAroundInlineCode
}]);

describe('test space-around-inline-code', () => {
  test('fix applied', () => {
    const content1 = '`html`有时候`div`元素的 `display`属性会被设置为`inline-block`，这样就可以让 `div` 元素在一行内显示，但是又可以设置宽高`height` 等属性。`html`，泰裤辣`cool`\n`html`';
    const { fixedResult: fixedResult1, lintResult: lintResult1 } = fixer(content1);
    expect(lintResult1.ruleManager.getReportData().length).toStrictEqual(6);
    expect(fixedResult1?.result).toStrictEqual('`html` 有时候 `div` 元素的 `display` 属性会被设置为 `inline-block`，这样就可以让 `div` 元素在一行内显示，但是又可以设置宽高 `height` 等属性。`html`，泰裤辣 `cool`\n`html`');

    const content2 = '```html```有时候```div```元素的 ```display```属性会被设置为```inline-block```，这样就可以让 ```div``` 元素在一行内显示，但是又可以设置宽高```height``` 等属性。```html```，泰裤辣```cool```\n```html```';
    const { fixedResult: fixedResult2, lintResult: lintResult2 } = fixer(content2);
    expect(lintResult2.ruleManager.getReportData().length).toStrictEqual(6);
    expect(fixedResult2?.result).toStrictEqual('```html``` 有时候 ```div``` 元素的 ```display``` 属性会被设置为 ```inline-block```，这样就可以让 ```div``` 元素在一行内显示，但是又可以设置宽高 ```height``` 等属性。```html```，泰裤辣 ```cool```\n```html```');
  });
});
