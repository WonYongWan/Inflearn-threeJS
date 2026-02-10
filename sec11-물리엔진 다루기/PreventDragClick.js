export class PreventDragClick {
  constructor(elm) {
    // 생성자
    this.mouseMoved;
    let clickStartX;
    let clickStartY;
    let clickStartTime;

    elm.addEventListener('mousedown', (e) => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      clickStartTime = Date.now();
    });

    elm.addEventListener('mouseup', (e) => {
      const xGap = Math.abs(e.clientX - clickStartX);
      const yGap = Math.abs(e.clientY - clickStartY);
      const timeGap = Date.now() - clickStartTime;

      // xGap, yGap이 5보다 클 경우 클릭으로 인정하지 않도록 하면 됨. 또한 시간이 .5초 지났을 경우도 추가
      if (xGap > 5 || yGap > 5 || timeGap > 500) {
        this.mouseMoved = true;
      } else {
        this.mouseMoved = false;
      }
    });
  }
}
