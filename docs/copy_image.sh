#!/bin/zsh
# 使い方: zsh copy_image.sh 1   → 01_main.png をクリップボードにコピー
# 0=仕組み図 1=メイン画面 2=実行結果 3=Boltで作成中の画面
cd "${0:A:h}/images" || exit 1
f=$(ls 0$1-*.png 2>/dev/null | head -1)
[[ -z $f ]] && { echo "番号は 0〜3 で指定してください"; exit 1; }
osascript -e "set the clipboard to (read (POSIX file \"$PWD/$f\") as «class PNGf»)" && echo "コピーしました: $f"
