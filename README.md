monaca-location-memo
====================

Monaca、GoogleMaps、NIFTY Cloud mobile backendを使ったサンプルアプリです。

メモを登録する際に、登録画面に表示されている地図の中央の位置も一緒に保存されます。

後で閲覧するとメモと一緒に場所も表示されます。

また、メモはローカルストレージではなくNIFTY Cloud mobile backendに保存します。

Monacaで公開されているテンプレート「メモ帳アプリ」をベースに、一部機能を追加／変更しています。


準備
--------------------

このアプリを動作させるには以下の２つを有効にする必要があります。

* [Google Maps JavaScript API v3](https://developers.google.com/maps/documentation/javascript/?hl=ja)
* [NIFTY Cloud mobile backend](http://mb.cloud.nifty.com/)

それぞれ有効化の方法は以下の通りです。

* Google Maps JavaScript API v3
    1. [Google Developers Console](https://console.developers.google.com/)にアクセスする
    2. "Create Project"でAPIを使うためのプロジェクトを作成する（既存のものを使ってもよい）
    3. "APIs & auth"＞"APIs"の順で選択し、「Google Maps JavaScript API v3」を"ON"にする
    4. "APIs & auth"＞"Credentials"の順で選択し、"Public API Access"＞"Create new key"＞"Browser key"を作成する
    5. 作成したBrowser keyの**API key**は後で使うのでメモしておく

* NIFTY Cloud mobile backend
    1. [NIFTY Cloud mobile backend](http://mb.cloud.nifty.com/)にアクセスする
    2. 右上の"ログイン"からログインする（@nifty IDが必要です。持っていない場合は無料会員登録が必要。）
    3. 初回は利用規約が表示されるので確認して問題なければ次に進む
    4. 新しいアプリの作成画面が表示されたら、任意のアプリ名を入力してアプリを作成
    5. 作成完了画面に表示されている**Application Key**と**Client Key**は後で使うのでメモしておく
    6. メモせずに次に進んでしまった場合は、左下の"アプリ設定"から再度確認することが可能



使い方
--------------------
1. [Monaca](http://monaca.mobi/ja/)にログインする
2. "新しいプロジェクト"＞"プロジェクトをインポート"＞"URLを指定してインポート"で<https://github.com/ndyuya/monaca-location-memo/archive/master.zip>をインポートする
3. プロジェクト名はご自由にどうぞ
4. インポートが完了するとプロジェクトリストに追加されているので"IDEを起動"する
5. index.htmlの10行目で読み込んでいるSDKのURLに記載されている**YOUR_GOOGLE_API_BROWSER_KEY**の部分を準備で取得したGoogle API用のAPI keyに置き換える
6. js/app.jsの182〜183行目に記載されている**YOUR_NCMB_APPLICATION_KEY**と**YOUR_NCMB_CLIENT_KEY**の部分を準備で取得したNIFTY Cloud mobile backend用のApplication KeyとClient Keyに置き換える
7. プレビューを実行する



