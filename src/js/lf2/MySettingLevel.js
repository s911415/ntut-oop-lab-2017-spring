﻿"use strict";
var lf2 = (function (lf2) {
    const Game = Framework.Game;
    const ResourceManager = Framework.ResourceManager;
    const KeyBoardManager = Framework.KeyBoardManager;
    const _SETTING_CONTAINER_ID = "__setting_container";
    const CUR = "cur";

    const setCur = (ele) => {
        $("." + CUR).removeClass(CUR);
        if (ele) {
            ele.classList.add(CUR);
        }
    };

    /**
     * @class lf2.MySettingLevel
     * @extends Framework.Level
     * @implements Framework.MouseEventInterface
     * @implements Framework.KeyboardEventInterface
     */
    lf2.MySettingLevel = class extends Framework.Level {
        constructor() {
            super();
        }

        load() {
            //載入要被播放的音樂清單
            //資料夾內只提供mp3檔案, 其餘的音樂檔案, 請自行轉檔測試
            //播放時, 需要給name, 其餘參數可參考W3C
            this.audio = new Framework.Audio({
                ok: {
                    ogg: define.MUSIC_PATH + 'm_ok.ogg',
                },
                cancel: {
                    ogg: define.MUSIC_PATH + 'm_cancel.ogg',
                },
            });

            this.config = JSON.parse(localStorage.getItem(define.KEYBOARD_CONFIG_KEY)) || [
                    {
                        NAME: "Player1",
                        UP: 87, DOWN: 83, LEFT: 65, RIGHT: 68,
                        ATTACK: 78, JUMP: 66, DEFEND: 86
                    },
                    {
                        NAME: "Player2",
                        UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39,
                        ATTACK: 221, JUMP: 219, DEFEND: 80
                    }
                ];

            this.html = '';
            this.players = [];
            this._attached = false;
            this._settingContainer = undefined;
            //Load Setting view
            ResourceManager.loadResource(define.DATA_PATH + 'SettingScreen.html', {method: "GET"}).then((data) => {
                return data.text();
            }).then((html) => {
                this.html = html;
            });

        }

        initialize() {
            $("#" + _SETTING_CONTAINER_ID).remove();
        }

        update() {
            super.update();

            if (this.html !== "" && !this._settingContainer) {
                this._settingContainer = $(this.html);
                this._settingContainer.attr("id", _SETTING_CONTAINER_ID);

                this._settingContainer.bind('mousedown', function (e) {
                    setCur(null);
                });

                this._settingContainer.find(".btn_ok").click((e) => {
                    this.audio.play({name: 'ok'});
                    this.saveConfig();
                    Game.goToLevel('menu');
                });

                this._settingContainer.find(".btn_cancel").click((e) => {
                    this.audio.play({name: 'cancel'});
                    Game.goToLevel('menu');
                });
                this.forceDraw();
            }
        }

        draw(parentCtx) {
            super.draw(parentCtx);

            if (!this._attached) {
                let playerElement = this._settingContainer.find(".player:first");
                let playerContainer = this._settingContainer.find(".players");

                for (let i = 0; i < define.PLAYER_COUNT; i++) {
                    this.players[i] = playerElement.clone();
                    this.players[i].attr('data-player', i);
                    this.bindPlayerEvent(this.players[i]);
                    playerContainer.append(this.players[i]);
                }

                playerElement.remove();
                $("body").append(this._settingContainer);
                this._attached = true;
                Game.resizeEvent();
            }


            const KEY_CLASS = ["UP", "DOWN", "LEFT", "RIGHT", "ATTACK", "JUMP", "DEFEND"];
            //refresh key
            for (let i = 0; i < define.PLAYER_COUNT; i++) {
                const p = this.players[i], c = this.config[i];
                if (c === undefined) continue;

                KEY_CLASS.forEach((k) => {
                    //Convert Keycode to readable text
                    p.find(".keys." + k).text(KeyBoardManager.mappingTable()[c[k]]);
                });

                p.find('.name').val(c['NAME']);
            }
        }

        keydown(e, list, oriE) {
            super.keydown(e, list, oriE);
            console.log(oriE.keyCode);
            let curElement = $(".cur");
            let playerId = curElement.parent().data('player');

            if (curElement.length > 0) {
                const ce=curElement[0];
                if (ce.classList.contains('keys')) {
                    let key = curElement.data('key');
                    this.config[playerId][key] = oriE.keyCode;
                    setCur(null);
                }
            }

            this.forceDraw();

        }

        bindPlayerEvent(playerElement) {
            const _this=this;
            playerElement.find(".name").bind('keydown', function (e) {
                e.stopImmediatePropagation();
            }).bind('mousedown', function (e) {
                setCur(e.target);
                e.stopImmediatePropagation();
            }).bind('keyup', function(e){
                let playerId = $(this.parentNode).data('player');
                _this.config[playerId]['NAME'] = this.value;
            });

            playerElement.find(".keys").bind('mousedown', function (e) {
                setCur(e.target);
                e.stopImmediatePropagation();
            });
        }

        click(e) {

        }

        autodelete() {
            if (this._settingContainer) {
                this._settingContainer.remove();
            }
        }

        /**
         * Store config into local storage
         */
        saveConfig(){
            localStorage.setItem(define.KEYBOARD_CONFIG_KEY, JSON.stringify(this.config));
        }
    };

    return lf2;
})(lf2 || {});