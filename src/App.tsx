import { useState } from 'react';
import type { ParsedDocument, ThemeMode, SourceLocator } from '@/types';
import { UploadScreen } from '@/components/UploadScreen';
import { ReportView } from '@/components/ReportView';
import { ChatWidget } from '@/components/ChatWidget';
import { DocumentViewer } from '@/components/DocumentViewer';

function App() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [view, setView] = useState<'upload' | 'report'>('upload');
  const [currentDoc, setCurrentDoc] = useState<ParsedDocument | null>(null);
  const [highlight, setHighlight] = useState<SourceLocator | null>(null);

  const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  const handleSelectDocument = (doc: ParsedDocument) => {
    setCurrentDoc(doc);
    setView('report');
  };

  const handleBack = () => {
    setView('upload');
    setCurrentDoc(null);
  };

  const handleViewSource = (source: SourceLocator) => {
    setHighlight(source);
  };

  return (
    <>
      {view === 'upload' && (
        <UploadScreen
          mode={mode}
          onToggleMode={toggleMode}
          onSelectDocument={handleSelectDocument}
        />
      )}
      {view === 'report' && currentDoc && (
        <>
          <ReportView
            key={currentDoc.id}
            document={currentDoc}
            mode={mode}
            onToggleMode={toggleMode}
            onBack={handleBack}
            onViewSource={handleViewSource}
          />
          <ChatWidget
            document={currentDoc}
            mode={mode}
            category={currentDoc.category}
            onViewSource={handleViewSource}
          />
        </>
      )}
      {highlight && currentDoc && (
        <DocumentViewer
          document={currentDoc}
          mode={mode}
          category={currentDoc.category}
          highlight={highlight}
          onClose={() => setHighlight(null)}
        />
      )}
    </>
  );
}

export default App;
