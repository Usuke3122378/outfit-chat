#!/bin/zsh
# 使い方: zsh copy_article.sh  → 提出記事を画像ごとクリップボードにコピー（貼り付け先で ⌘V）
docs="${0:A:h}"
~/Projects/my-tool/.venv/bin/python "$docs/build_paste.py" "$docs" >/dev/null || exit 1
osascript -l JavaScript - "$docs/提出記事_貼り付け用.html" "$docs/提出記事.md" <<'JS'
ObjC.import('AppKit');
function run(argv) {
  const data = $.NSData.dataWithContentsOfFile(argv[0]);
  const md = $.NSString.stringWithContentsOfFileEncodingError(argv[1], $.NSUTF8StringEncoding, null);
  const opts = $.NSDictionary.dictionaryWithObjectsForKeys(
    [$.NSHTMLTextDocumentType, $.NSNumber.numberWithUnsignedInteger($.NSUTF8StringEncoding)],
    [$.NSDocumentTypeDocumentAttribute, $.NSCharacterEncodingDocumentAttribute]);
  const attr = $.NSAttributedString.alloc.initWithDataOptionsDocumentAttributesError(data, opts, null, null);
  const rtfd = attr.RTFDFromRangeDocumentAttributes($.NSMakeRange(0, attr.length), $.NSDictionary.dictionary);
  const pb = $.NSPasteboard.generalPasteboard;
  pb.clearContents;
  pb.setDataForType(data, 'public.html');
  pb.setDataForType(rtfd, 'com.apple.flat-rtfd');
  pb.setStringForType(md, 'public.utf8-plain-text');
  let n = 0;
  attr.enumerateAttributeInRangeOptionsUsingBlock($.NSAttachmentAttributeName, $.NSMakeRange(0, attr.length), 0, (v) => { if (v && !v.isNil()) n++; });
  return 'コピーしました（画像 ' + n + ' 枚・本文）。貼り付け先で ⌘V';
}
JS
