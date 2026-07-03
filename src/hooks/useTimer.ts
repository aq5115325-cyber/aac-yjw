import { useEffect, useRef, useCallback } from 'react';

/**
 * 倒计时 hook — 基于 Date.now() 绝对时间，不受 setInterval 后台节流影响
 *
 * @param seconds  本次阶段秒数（闭包捕获，effect 不依赖）
 * @param running  是否运行
 * @param onTick   每秒回调
 * @param onComplete 完成回调
 * @param resetKey 变化时强制重置计时器（传入 phase + exerciseIndex 组合）
 */
export function useTimer(
  seconds: number,
  running: boolean,
  onTick?: (remaining: number) => void,
  onComplete?: () => void,
  resetKey?: string,
) {
  const endTimeRef = useRef(0);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  onTickRef.current = onTick;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 用当前 seconds 计算绝对结束时间
    endTimeRef.current = Date.now() + seconds * 1000;

    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      onTickRef.current?.(remaining);

      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onCompleteRef.current?.();
      }
    }, 200);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // ✅ running 和 resetKey 控制重启：phase 变了就重新计时
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, resetKey]);

  const skipToEnd = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onCompleteRef.current?.();
  }, []);

  return { skipToEnd };
}
