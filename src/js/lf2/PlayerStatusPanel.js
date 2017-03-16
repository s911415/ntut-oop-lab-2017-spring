"use strict";
var lf2 = (function (lf2) {
    const Sprite = Framework.Sprite;
    const Point = Framework.Point;
    const PANEL_SIZE = new Point(198, 53);
    const PANEL_PER_ROW_COUNT = Math.floor(Framework.Config.canvasWidth / PANEL_SIZE.x);
    const PANEL_COL_COUNT = 2;
    const ColorBar = lf2.ColorBar;
    const Utils = lf2.Utils;

    const HP_COLOR = "#ff0000";
    const HP_DARK_COLOR = "#6f081f";

    const MP_COLOR = "#0000ff";
    const MP_DARK_COLOR = "#1f086f";

    const SMALL_POSITION = new Point(7, 4);
    const BAR_SIZE = new Point(124, 10);

    const HP_POSITION = new Point(57, 15);
    const MP_POSITION = new Point(57, 35);
    /**
     * Player HP Panel
     *
     * @type {PlayerStatusPanel}
     * @class lf2.PlayerStatusPanel
     * @implements Framework.AttachableInterface
     */
    lf2.PlayerStatusPanel = class PlayerStatusPanel {
        /**
         *
         * @param {lf2.Player} player
         */
        constructor(player) {
            this._player = player;
            const playerIndex = this._player.playerId;
            const _ROW = (playerIndex / PANEL_PER_ROW_COUNT) | 0;
            const _COL = (playerIndex % PANEL_PER_ROW_COUNT);

            this.panelPosition = new Point(
                _COL * PANEL_SIZE.x,
                _ROW * PANEL_SIZE.y
            );

            this._realHPPosition = this.getRealPosition(HP_POSITION);
            this._realMPPosition = this.getRealPosition(MP_POSITION);

            this._darkHPBar = new ColorBar(HP_DARK_COLOR, BAR_SIZE.x, BAR_SIZE.y);
            this._darkHPBar.position = this._realHPPosition;

            this._darkMPBar = new ColorBar(MP_DARK_COLOR, BAR_SIZE.x, BAR_SIZE.y);
            this._darkMPBar.position = this._realMPPosition;

            this._hpBar = new ColorBar(HP_COLOR, BAR_SIZE.x, BAR_SIZE.y);
            this._hpBar.position = this._realHPPosition;
            this._hpRatio = 1;

            this._mpBar = new ColorBar(MP_COLOR, BAR_SIZE.x, BAR_SIZE.y);
            this._mpBar.position = this._realMPPosition;
            this._mpRatio = 1;
        }

        load() {
        }


        update() {
            this._hpRatio = this._player.hp / lf2.Player.prototype.DEFAULT_HP;
            this._mpRatio = this._player.mp / lf2.Player.prototype.DEFAULT_HP;

            this._hpRatio = Utils.returnInRangeValue(this._hpRatio, 0, 1);
            this._mpRatio = Utils.returnInRangeValue(this._mpRatio, 0, 1);

            this._hpBar.width = BAR_SIZE.x * this._hpRatio;
            this._mpBar.width = BAR_SIZE.x * this._mpRatio;
        }


        /**
         *
         * @param {CanvasRenderingContext2D} ctx
         */
        draw(ctx) {
            //Draw small people
            ctx.drawImage(
                this._player.character.small,
                SMALL_POSITION.x + this.panelPosition.x,
                SMALL_POSITION.y + this.panelPosition.y
            );

            //Draw dark hp and mp bar
            this._darkHPBar.draw(ctx);
            this._darkMPBar.draw(ctx);

            //Draw hp and mp bar
            this._hpBar.draw(ctx);
            this._mpBar.draw(ctx);
        }

        /**
         *
         * @param {Framework.Point} point
         */
        getRealPosition(point){
            let x= point.x + this.panelPosition.x;
            let y= point.y + this.panelPosition.y;

            return new Point(x, y);
        }
    };
    lf2.PlayerStatusPanel.prototype.PANEL_SIZE
        = lf2.PlayerStatusPanel.PANEL_SIZE = PANEL_SIZE;

    lf2.PlayerStatusPanel.prototype.PANEL_PER_ROW_COUNT
        = lf2.PlayerStatusPanel.PANEL_PER_ROW_COUNT = PANEL_PER_ROW_COUNT;

    lf2.PlayerStatusPanel.prototype.PANEL_COL_COUNT
        = lf2.PlayerStatusPanel.PANEL_COL_COUNT = PANEL_COL_COUNT;

    return lf2;
})(lf2 || {});