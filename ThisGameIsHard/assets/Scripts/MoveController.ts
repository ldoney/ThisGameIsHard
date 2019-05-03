const {ccclass, property} = cc._decorator;

@ccclass
export default class MoveController extends cc.Component {
    onLoad () {
        this.node.parent.on('touchmove', this.onDeviceTouchEvent, this);
        this.node.on("touchstart", this.onDeviceTouchEvent, this);
        this.node.on("touchend", this.onDeviceTouchEvent, this);
    }
    onDeviceTouchEvent(touch, event)
    {
        if(this.node.parent.getComponent("Game").inSession)
        {
            var a = touch.getLocation();
            this.node.setPosition(
                (a.x - this.node.parent.width / 2),
                (a.y - this.node.parent.height / 2)
            );
        }
    }

    update (dt) {
        if(this.node.parent.getComponent("Game").inSession)
        {
            var ball = this.node.parent.getChildByName("Ball");
            var distX = this.node.x - ball.x;
            var distY = this.node.y - ball.y;
                var angle = Math.atan2(distX,
                    distY) * (180 / Math.PI);
                this.node.setRotation(
                    angle
                );
        }
    }
}
