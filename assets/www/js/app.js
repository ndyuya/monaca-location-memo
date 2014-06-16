// グローバル変数
var addMap;     // メモ追加ページ用マップ
var detailMap;  // メモ詳細ページ用マップ
var marker;     // メモ詳細ページ用マーカー
var Location;   // NCMBデータストアのlocationクラス

///// 登録処理 (メモ追加ページのsaveボタンをクリックしたときの処理)
function onSaveBtn() {
    // ページ内の入力フォーム＋地図から保存するデータを取得
    var text = $("#Location").val();
    var latlng = addMap.getCenter();
    var lat = latlng.lat();
    var lng = latlng.lng();
    
    if (text != '') {

      // locationクラスにデータを保存
      var location = new Location();
      
      // saveメソッド (第一引数＝保存データ、第二引数＝処理完了時のコールバック)
      location.save(
        {
          title: text,
          lat: lat,
          lng: lng
        },{
          success: function(location) {
            // 保存成功時は入力フォームを空にしてから、トップページを再構築し、トップページへ遷移する
            $("#Location").val("");
            initTopPage(function(){
              $.mobile.changePage("#TopPage", { reverse: true });
            });
          },
          error: function(location, error) {
            // 保存失敗時はログにエラーを出力する
            console.log("Error(save): " + error.message);
          }
        }
      );
    } else {
      $.mobile.changePage("#TopPage", { reverse: true });
    }
}

///// トップページの初期化処理
function initTopPage(callback) {
    // 表示中のメモリストを全て削除する
    $("#TopListView").empty();

    // locationクラスを検索してメモを取得する
    var query = new NCMB.Query(Location);
    query.find({
      success: function(list) {
        // 検索成功時はulタグの内側に、メモ情報を含むliタグを追加する
        // (結果が０件でも検索に成功していればsuccessが呼ばれる)
        for (var i in list) {
          var memo = list[i];
          var d = new Date(memo.get("createDate"));
          var date = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();

          // liタグを構築する
          $li = $("<li><a href='#' class='show'><h3></h3><p></p></a><a href='#' class='delete'>Delete</a></li>");
          
          // liタグに対してデータ（不可視）を追加する
          $li.data("id", memo.id);
          $li.data("lat", memo.get("lat"));
          $li.data("lng", memo.get("lng"));
          
          // liタグ内のh3タグに日付の文字列をセットする
          $li.find("h3").text(date);
          
          // liタグ内のpタグにメモ本文の文字列をセットする
          $li.find("p").text(memo.get("title"));
          
          // id=TopListViewの要素(ここではul)にliタグを追加する
          $("#TopListView").prepend($li);
        }
        
        // メモが０件の場合は、その旨表示する
        if (list.length == 0) {
          $li = $("<li>No memo found</li>");
          $("#TopListView").prepend($li);
        }
        
        // メモリストを再描画する
        $("#TopListView").listview("refresh");
        
        // 引数にコールバックが渡されていた場合はそれを実行する
        if (callback) {
          callback();
        }
      },
      error: function(error) {
        // 検索失敗時はエラーをログに出力する
        console.log("Error(find): " + error.message);
      }
    });
}

///// 詳細ページへ遷移処理 (トップページのメモリストのうち１つをクリックしたときの処理)
function onShowLink() {
    // クリックされた要素の先祖で一番近いli要素を取得する
    var $li = $(this).closest("li");
    
    // 取得したli要素にセットされている各種データを詳細ページの対応する場所にセットする
    $("#ShowPage h1").text($li.find("h3").text());
    $("#ShowPage p").html($li.find("p").html().replace(/\n/g, "<br>"));
    $("#ShowPage").data("lat", $li.data("lat"));
    $("#ShowPage").data("lng", $li.data("lng"));

    // 詳細ページに遷移する
    $.mobile.changePage("#ShowPage");
}

/////  削除処理
function onDeleteLink() {
    // 確認ダイアログを表示
    if (!confirm("Are you sure to delete this memo?")) {
      // NOを選んだ場合は何もしない
      return;
    }

    // クリックされた要素の親要素のliを取得する
    var $li = $(this).parent();
    
    // 取得したliからidを取り出す
    var id = $li.data("id");
    
    // Locationクラスのインスタンスを生成し、objectIdにidを設定する
    var location = new Location();
    location.set("objectId", id);
    
    // 削除処理を実行する
    location.destroy({
      success: function(obj) {
        // 削除成功時はトップページの再構築後、トップページに遷移する
        initTopPage(function(){
            $.mobile.changePage("#TopPage", { reverse: true });
        });
      },
      error: function(obj, error) {
        // 削除失敗時はログにエラーを出力する
        console.log("Error(delete): " + error.message);
        
        // トップページ再構築後、トップページに遷移する
        initTopPage(function(){
            $.mobile.changePage("#TopPage", { reverse: true });
        });
      }
    });
    
}

// 地図の初期化
function initMap() {
    // メモ追加ページ用の地図 (id=addMapCanvasの要素に地図を表示する)
    var addMapOptions = {
      center: new google.maps.LatLng(35.690921, 139.700258),    //地図上で表示させる緯度経度
      zoom: 14,                                                 //地図の倍率
      mapTypeId: google.maps.MapTypeId.ROADMAP                  //地図の種類
    };
    addMap = new google.maps.Map(document.getElementById("addMapCanvas"), addMapOptions);

    // 詳細ページ用の地図 (id=detailMapCanvasの要素に地図を表示する)
    var detailMapOptions = {
      center: new google.maps.LatLng(35.690921, 139.700258),    //地図上で表示させる緯度経度
      zoom: 14,                                                 //地図の倍率
      mapTypeId: google.maps.MapTypeId.ROADMAP                  //地図の種類
    };
    detailMap = new google.maps.Map(document.getElementById("detailMapCanvas"), detailMapOptions);
    
    // 詳細ページ用のマーカー（詳細ページ用の地図の指定位置にマーカーを表示する、初期化時は仮の位置)
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(35.690921, 139.700258),
      map: detailMap
    });
}

///// アプリ起動じの初期化処理
function onReady() {
    // NIFTY Cloud mobile backend javascript SDK の初期化 (ApplicationKeyとClientKeyを設定する)
    NCMB.initialize("YOUR_NCMB_APPLICATION_KEY",
                    "YOUR_NCMB_CLIENT_KEY");
                    
    // データストアのクラス：locationに対応するLocationクラスを生成する
    Location = NCMB.Object.extend("location");
  
    // トップページの初期化
    initTopPage();
    
    // GoogleMapsの初期化
    initMap();
    
    // メモ追加ページのsaveボタンをクリック時にonSaveBtnメソッドを呼ぶ設定
    $("#SaveBtn").click(onSaveBtn);
    
    // トップページのリストの要素をクリックした時にonShowLinkメソッドを呼ぶ設定
    $("#TopListView a.show").live("click", onShowLink);
    
    // トップページのリストの要素の右にある削除ボタンをクリックした時にonDeleteLinkメソッドを呼ぶ設定
    $("#TopListView a.delete").live("click", onDeleteLink);
    
    // メモ追加ページでpageshowイベント(遷移して来た時に発生)が発生した時の処理
    $("#AddPage").bind("pageshow", function(){
      // メモ追加ページの地図のリサイズを実行 (画像欠け対策)
      google.maps.event.trigger(addMap, 'resize');
    });
    
    // メモ詳細ページでpageshowイベント(遷移して来た時に発生)が発生した時の処理
    $("#ShowPage").bind("pageshow", function(){
      // メモ追加ページの地図のリサイズを実行 (画像欠け対策)
      google.maps.event.trigger(detailMap, 'resize');
      
      // 地図の中心地点を、表示対象のメモが保持する緯度経度情報に変更
      var position = new google.maps.LatLng($("#ShowPage").data("lat"), $("#ShowPage").data("lng"));
      detailMap.setCenter(position);

      // マーカーも地図の中心に変更
      marker.setOptions({ position: position});
    });

    // 初期化処理が終わったのでスプラッシュ画面を閉じる
    monaca.splashScreen.hide();
}

$(onReady); // on DOMContentLoaded

