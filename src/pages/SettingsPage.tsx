import { useState, useEffect, useRef } from 'react';
import { getSettings, saveSettings, exportAllData, importAllData, deleteAllData } from '../lib/storage';
import type { AppSettings } from '../lib/storage';
import { Volume2, Download, Upload, Trash2, Check, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [exportMsg, setExportMsg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { saveSettings(settings); }, [settings]);

  const toggleTts = () => setSettings((s) => ({ ...s, ttsEnabled: !s.ttsEnabled }));

  const handleExport = () => {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitfollow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg(true);
    setTimeout(() => setExportMsg(false), 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importAllData(reader.result as string);
      if (result.success) {
        setImportMsg({ ok: true, text: `导入了 ${result.plansCount} 个计划 + ${result.historyCount} 条记录` });
      } else {
        setImportMsg({ ok: false, text: result.error || '导入失败' });
      }
      setTimeout(() => setImportMsg(null), 3000);
    };
    reader.readAsText(file);
    // 允许重复选择同一文件
    e.target.value = '';
  };

  const handleDeleteAll = () => {
    if (confirm('确定删除所有数据？\n\n包括：自定义计划、训练历史、设置。\n\n此操作不可恢复！')) {
      deleteAllData();
      setSettings(getSettings());
      setImportMsg({ ok: true, text: '所有数据已删除' });
      setTimeout(() => setImportMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <h2 className="text-xl font-bold text-white">设置</h2>

      {/* 提示消息 */}
      {importMsg && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
          importMsg.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {importMsg.ok ? <Check size={16} /> : <AlertTriangle size={16} />}
          {importMsg.text}
        </div>
      )}

      {/* 语音播报 */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 size={20} className="text-indigo-400" />
            <div>
              <p className="text-white text-sm font-medium">语音播报</p>
              <p className="text-xs text-gray-500">训练时用中文语音提示动作名称</p>
            </div>
          </div>
          <button
            onClick={toggleTts}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.ttsEnabled ? 'bg-indigo-500' : 'bg-gray-700'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              settings.ttsEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
        <p className="text-sm text-gray-500 font-medium">数据管理</p>

        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-left"
        >
          <Download size={18} className="text-cyan-400" />
          <div className="flex-1">
            <p className="text-white text-sm">导出数据</p>
            <p className="text-xs text-gray-500">备份计划、历史记录到 JSON 文件</p>
          </div>
          {exportMsg && <span className="text-xs text-green-400">已导出 ✓</span>}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-left"
        >
          <Upload size={18} className="text-purple-400" />
          <div className="flex-1">
            <p className="text-white text-sm">导入数据</p>
            <p className="text-xs text-gray-500">从备份文件恢复</p>
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <button
          onClick={handleDeleteAll}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-colors text-left"
        >
          <Trash2 size={18} className="text-red-400" />
          <div className="flex-1">
            <p className="text-red-400 text-sm">删除所有数据</p>
            <p className="text-xs text-gray-500">清空计划、历史和设置</p>
          </div>
        </button>
      </div>

      {/* 关于 */}
      <div className="bg-gray-900 rounded-2xl p-4 space-y-2">
        <p className="text-sm text-gray-500 font-medium">关于</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">版本</span>
          <span className="text-gray-500 text-xs">v1.0.0</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">动作库</span>
          <span className="text-gray-500 text-xs">1,324 个动作</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">数据来源</span>
          <span className="text-gray-500 text-xs">ExerciseDB + WorkoutX</span>
        </div>
      </div>
    </div>
  );
}
