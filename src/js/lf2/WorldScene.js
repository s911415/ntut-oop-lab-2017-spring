"use strict";
var lf2 = (function (lf2) {
    const GameMapPool = lf2.GameMapPool;
    const Point = Framework.Point;
    /**
     * World Scene
     *
     * @class lf2.WorldScene
     * @extends {Framework.Scene}
     * @implements {Framework.AttachableInterface}
     */
    lf2.WorldScene = class WorldScene extends Framework.Scene {
        constructor(config) {
            super();
            this.config = config;

            /**
             * position of camera, from 0 to 1
             * @type {Number}
             */
            this.cameraPosition = 0;
            this.map = GameMapPool.get(this.config.mapId);


            this.addCharacters(this.config.players);
        }


        /**
         *
         * @param {lf2.Player[]} playerArray
         */
        addCharacters(playerArray) {
            playerArray.forEach((player) => {
                this.attach(player.character);
            });
        }

        update() {
            super.update();
        }

        _getCameraPositionAsPoint() {
            let x = this.map.width - Framework.Config.canvasWidth;
            x *= this.cameraPosition;

            return new Point(x, 0);
        }

        /**
         *
         * @param {CanvasRenderingContext2D} ctx The painter.
         * @override
         */
        draw(ctx) {
            //Reset translate
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            let canvasTranslate = this._getCameraPositionAsPoint();
            ctx.save();
            ctx.translate(-canvasTranslate.x, -canvasTranslate.y);
            this.attachArray.forEach(function (ele) {
                ele.draw(ctx);
            }, this);

            ctx.restore();

        }
    };

    return lf2;
})(lf2 || {});