"use strict";
var lf2 = (function (lf2) {
    const Utils = lf2.Utils;
    const BDY_START_TAG = 'bdy:';
    const BDY_END_TAG = 'bdy_end:';
    const ITR_START_TAG = 'itr:';
    const ITR_END_TAG = 'itr_end:';
    const SOUND_TAG = 'sound:';
    const OPOINT_START_TAG = 'opoint:';
    const OPOINT_END_TAG = 'opoint_end:';
    const BPOINT_START_TAG = 'bpoint:';
    const BPOINT_END_TAG = 'bpoint_end:';

    const Body = lf2.Body;
    const ObjectPoint = lf2.ObjectPoint;
    const BloodPoint = lf2.BloodPoint;
    const Interaction = lf2.Interaction;
    const Point = Framework.Point;
    const Point3D = Framework.Point3D;
    const KeyboardConfig = lf2.KeyboardConfig;

    /**
     * Frame
     *
     * @type {Frame}
     * @class lf2.Frame
     */
    lf2.Frame = class Frame {
        /**
         *
         * @param {String} context
         * @param {lf2.GameObject} gameObj Game Object
         */
        constructor(context, gameObj) {
            this.sourceCode = context;
            let lines = context.lines();
            let infoArr = lines[0].split(/\s+/);

            this._gameObj = gameObj;

            this.id = intval(infoArr[0]);
            this.name = infoArr[1];

            let picIndex = 1;
            while (picIndex < lines.length && lines[picIndex].indexOf('pic') === -1) picIndex++;

            this.data = Utils.parseDataLine(lines[picIndex]);

            let itr = context.getStringBetween(ITR_START_TAG, ITR_END_TAG);
            let bdy = context.getStringBetween(BDY_START_TAG, BDY_END_TAG);
            let opoint = context.getStringBetween(OPOINT_START_TAG, OPOINT_END_TAG);
            let bpoint = context.getStringBetween(BPOINT_START_TAG, BPOINT_END_TAG);

            this.itr = itr ? new Interaction(itr) : undefined;
            this.bdy = bdy ? new Body(bdy) : undefined;
            this.opoint = opoint ? new ObjectPoint(opoint) : undefined;
            this.bpoint = bpoint ? new BloodPoint(bpoint) : undefined;

            this.mp = intval(this.data.get('mp') || 0);

            this.soundPath = (function () {
                let soundStr = undefined;
                for (let i = 0; i < lines.length; i++) {
                    const lineStr = lines[i].trim();
                    if (lineStr.startsWith(SOUND_TAG)) {
                        soundStr = Utils.parseDataLine(lineStr).get('sound');
                        break;
                    }
                }

                if (soundStr !== undefined) {
                    soundStr = define.MUSIC_PATH + soundStr;

                    return soundStr;
                }

                return undefined;
            })();

            this.hit = (() => {
                let ret = {};
                KeyboardConfig.HIT_KEY.HIT_LIST.forEach((k) => {
                    const val = intval(this.data.get('hit_' + k) || 0);
                    ret[KeyboardConfig.HIT_KEY[k]] = ret[k] = val;
                });

                return ret;
            })();
        }

        /**
         * Get picture index
         * @property pictureIndex
         * @returns {Number}
         */
        get pictureIndex() {
            return intval(this.data.get('pic') || 0);
        }

        /**
         * Get current state
         *
         * 0=站立(stand)
         * 1=行走(walk)
         * 2=跑步(run)
         * 3=普通拳腳攻擊(punch)
         * 4=跳(jump)
         * 5=突進(dash，即跑+跳)
         * 7=擋(defend)
         * 8=破擋(broken defend)
         * 9=捉人(catching)
         * 10=被捉(picked caught)
         * 11=被攻擊(injured)
         * 12=fall大於60才會被打到
         * 13=有冰碎效果
         * 14=倒在地上(lying，可使com不會追你)
         * 15=被冰封(ice，可被同盟攻擊)
         * 16=暈眩(tired)可被敵人捉住
         * 17=喝(weapon drink)可以喝的物件被消耗
         * 18=燃燒(fire，可攻擊我方同盟)
         * 19=firen的烈火焚身(burn run)
         * 301=deep的鬼哭斬(dash sword，此state具有人物上下移動的功能)
         * 400=woody瞬間轉移(teleport，移往最近的敵人)
         * 401=woody瞬間轉移(teleport，移往最近的隊友)
         * 500=rudolf轉換成其他角色(transform)
         * 501=rudolf轉換回來(transform_b)
         * 1700=治療自己
         * 9995=變身成LouisEX(transform，任何人都可以)
         * 9996=爆出盔甲(transform，任何人都可以)
         * 9997=訊息(come,move之類，能在任何地方看見)
         * 9998=訊息刪除
         * 9999=毀壞的武器(broken weapon)
         *
         * @returns {Number}
         */
        get state() {
            return intval(this.data.get('state') || 0);
        }

        /**
         * get wait()
         *
         * Gets the wait.
         *
         * @return  {Number}   A get.
         */
        get wait() {
            return intval(this.data.get('wait') || 0) + 1;
        }

        /**
         * Get Next frame id
         * @returns {Number}
         */
        get nextFrameId() {
            return intval(this.data.get('next') || 0);
        }

        /**
         * Get offset of item
         * @returns {Framework.Point3D}
         */
        get velocity() {
            return new Point3D(
                intval(this.data.get('dvx') || 0),
                intval(this.data.get('dvy') || 0),
                intval(this.data.get('dvz') || 0)
            );
        }

        /**
         *
         * @returns {Framework.Point}
         */
        get center() {
            return new Point(
                intval(this.data.get('centerx')),
                intval(this.data.get('centery'))
            );
        }

        get size() {
            /**
             * @type {lf2.ImageInformation}
             */
            const img = this._gameObj.bmpInfo.imageNormal[this.pic];


            return new Point(
                img.rect.width, img.rect.height
            );
        }
    };


    return lf2;
})(lf2 || {});