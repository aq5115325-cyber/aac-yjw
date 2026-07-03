import { useState, memo } from 'react';
import { getExerciseGifUrl } from '../lib/exerciseMedia';
import { Dumbbell } from 'lucide-react';

interface ExerciseImageProps {
  exerciseId: string;
  exerciseName?: string;
  target?: string;
  alt?: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
}

type ImageStatus = 'loading' | 'loaded' | 'error';

/**
 * 动作媒体图片组件
 * - 已配置有效 API key 时加载 GIF
 * - 未配置、key 无效或加载失败时显示本地占位图
 */
function ExerciseImage({
  exerciseId,
  exerciseName,
  target,
  alt,
  className = '',
  objectFit = 'cover',
}: ExerciseImageProps) {
  const [status, setStatus] = useState<ImageStatus>(getExerciseGifUrl(exerciseId) ? 'loading' : 'error');
  const url = getExerciseGifUrl(exerciseId);

  const isLoaded = status === 'loaded';
  const showPlaceholder = status === 'error' || status === 'loading';

  return (
    <div className={`relative overflow-hidden bg-gray-800 ${className}`}>
      {url && (
        <img
          src={url}
          alt={alt ?? exerciseName ?? '动作示范'}
          loading="lazy"
          className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}

      {showPlaceholder && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-3 text-center transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
            <Dumbbell size={20} className="text-indigo-400" />
          </div>
          {exerciseName && (
            <p className="text-xs font-medium text-gray-300 line-clamp-2 leading-snug">{exerciseName}</p>
          )}
          {target && <p className="text-[10px] text-gray-500 mt-1">{target}</p>}
        </div>
      )}
    </div>
  );
}

export default memo(ExerciseImage);
