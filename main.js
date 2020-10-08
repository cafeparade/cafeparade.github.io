/**
 * Created by beat on 2016/01/14.
 */

(function ($) {
    //画像関連
    var img;
    var img2;
    var stage;

    //画像ロード
    function loadImage(imageData) {
        //画像のロード
        // var baseImg = new Image();
        // baseImg.src = 'base.png';
        // img = new createjs.Bitmap(baseImg);

        var attribution = document.getElementById("attribution").value;

        if(attribution !== null){

            var baseImg = new Image();

            switch (attribution){
                case 'fire':
                    baseImg.src = 'fire.png';
                    break;
                case 'darkness':
                    baseImg.src = 'darkness.png'
                    break;
                case 'grass':
                    baseImg.src = 'grass.png'
                    break;
                case 'ice':
                    baseImg.src = 'ice.png'
                    break;
                case 'machine':
                    baseImg.src = 'machine.png'
                    break;
                case 'soil':
                    baseImg.src = 'soil.png'
                    break;
                case 'thunder':
                    baseImg.src = 'thunder.png'
                    break;
                case 'water':
                    baseImg.src = 'water.png'
                    break;
                default:
                    baseImg.src = 'base.png'
            }

            img = new createjs.Bitmap(baseImg);

        }

        //画像が選択されている時のみ合成
        if (imageData !== null) {
            var baseImg2 = new Image();
            baseImg2.src = imageData;
            img2 = new createjs.Bitmap(baseImg2);
        }

        stage = new createjs.Stage('result');
    }

    //画像と文字を合成する処理
    function genImage(imageIni, txt) {
        //合成画像の設定
        //上下は10ピクセルごと移動
        img2.x = imageIni.xPos * 10;
        img2.y = imageIni.yPos * 10;
        //拡縮は10％ずつ
        img2.scaleX = img2.scaleX * (1 + imageIni.Scale / 10);
        img2.scaleY = img2.scaleY * (1 + imageIni.Scale / 10);

        //ステージ生成
        stage.addChild(img2);
        stage.addChild(img);

        //文字オブジェクトを生成してステージに追加
        $.each(txt, function (key, value) {
            //本文は入力された内容をそのまま取る
            var content = $('#' + key).val();

            //30文字で改行を行う
            if (key == 'txt02') {
                var content = content.replace(/[\r|\r\n|\n]/g, "").replace(/(.{30})/g, "$1" + "\n");
            }

            //文字生成
            var obj = new createjs.Text(content);

            //文字設定
            obj.textAlign = value.align;
            obj.font = value.font;
            obj.color = value.color;
            obj.x = value.x;
            obj.y = value.y;

            stage.addChild(obj);
        });

        //ステージ反映
        stage.update();
    }

    function downloadImage(imageData) {
        window.location = imageData;
    }

    $(function () {
        //読込画像のオブジェクト
        var imageIni = {
            xPos: 0,
            yPos: 0,
            Scale: 0,
            imageData: null,
            attribution: null,
            resetImage: function () {
                this.xPos = 0;
                this.yPos = 0;
                this.Scale = 0;
            },
            makeImage: function () {
                if (this.imageData !== null && attribution !== null) {
                    loadImage(this.imageData);
                    genImage(this, txt);
                }
            }
        };

        //合成する文字の位置情報などを定義
        var txt = {
            'txt01': {
                'x': 320,
                'y': 510,
                'font': '27px/1.5 Meiryo,sans-serif',
                'align': 'center',
                'color': 'black'
            },
            'txt02': {
                'x': 55,
                'y': 565,
                'font': '23px/1.5 MS UI Gothic,sans-serif',
                'align': 'left',
                'color': 'black'
            },
            'txt03': {
                'x': 190,
                'y': 735,
                'font': '30px/1.5 arial black,sans-serif',
                'align': 'center',
                'color': 'red'
            },
            'txt04': {
                'x': 490,
                'y': 735,
                'font': '30px/1.5 arial black,sans-serif',
                'align': 'center',
                'color': 'blue'
            }
        };

        //イベント関連処理
        //初回のみCanvasを作成しておく
        $(window).on('load', function () {
            loadImage(null);
        });

        //画像読込
        $('#getfile').change(function () {
            //読み込み
            var fileList = $('#getfile').prop('files');
            var reader = new FileReader();
            reader.readAsDataURL(fileList[0]);

            //読み込み後
            $(reader).on('load', function () {
                $('#preview').prop('src', reader.result);
                imageIni.imageData = reader.result;
            });
        });


        //ボタンイベントまとめ
        $('.btn').on('click', function (e) {
            if (e.target.id === "update") {
                //画像生成は個別処理なし
            } else if (e.target.id === "up") {
                imageIni.yPos -= 1;
            } else if (e.target.id === "down") {
                imageIni.yPos += 1;
            } else if (e.target.id === "left") {
                imageIni.xPos -= 1;
            } else if (e.target.id === "right") {
                imageIni.xPos += 1;
            } else if (e.target.id === "zoomin") {
                imageIni.Scale += 1;
            } else if (e.target.id === "zoomout") {
                imageIni.Scale -= 1;
            } else if (e.target.id === "reset") {
                imageIni.resetImage();
            } else if (e.target.id === "dl") {
                //TODO
                downloadImage(imageIni.imageData);
                return;
            }

            //画像操作時は再描画を行う
            if (imageIni.imageData !== null) {
                imageIni.makeImage();
                $("#alert").text("");
            } else {
                $("#alert").text("画像を選択してから画像生成を行ってください");
            }
        });
    });
})($);