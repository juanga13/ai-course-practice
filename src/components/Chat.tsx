import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { useState, useCallback } from 'react';

// interface Message {
//   role: 'user' | 'ai';
//   content: string;
// }

interface ClassificationResult {
  cardNumber: string;
  imageInsights: string[];
  manufacturer: string;
  notes: string;
  parallelOrVariant: string;
  playerName: string;
  psa: {
    grade: string;
    certNumber: string;
    qualifier: string;
  };
  setName: string;
  team: string;
  type: string;
  year: string;
}

export const Chat = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [classificationResult, setClassificationResult] =
    useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleClassifyImage = async () => {
    if (!uploadedFile) return;

    setIsClassifying(true);
    setError(null);
    setClassificationResult(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setClassificationResult(result);
      } else {
        setError('Failed to classify image. Please try again.');
      }
    } catch {
      setError(
        'Error classifying image. Please check your connection and try again.'
      );
    } finally {
      setIsClassifying(false);
    }
  };

  const renderContent = () => {
    if (isClassifying) {
      return (
        <div className="bg-white win95-shadow-inset h-full flex items-center justify-center">
          <Text className="text-gray-600">Loading...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white win95-shadow-inset h-full flex items-center justify-center">
          <Text className="text-red-600 text-center">{error}</Text>
        </div>
      );
    }

    if (classificationResult) {
      return (
        <div className="bg-white win95-shadow-inset h-full overflow-y-auto">
          <div className="p-4 space-y-3">
            <div className="border-b pb-2">
              <Text className="text-lg font-bold">
                {classificationResult.playerName}
              </Text>
              <Text className="text-sm text-gray-600">
                {classificationResult.team} • {classificationResult.year}
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="font-semibold">Card Details:</Text>
                <Text>Manufacturer: {classificationResult.manufacturer}</Text>
                <Text>Set: {classificationResult.setName}</Text>
                <Text>Type: {classificationResult.parallelOrVariant}</Text>
                <Text>Card #: {classificationResult.cardNumber}</Text>
              </div>

              <div>
                <Text className="font-semibold">PSA Grade:</Text>
                <Text>
                  Grade: {classificationResult.psa.grade}
                  {classificationResult.psa.qualifier}
                </Text>
                <Text>Cert #: {classificationResult.psa.certNumber}</Text>
                <Text>Type: {classificationResult.type}</Text>
              </div>
            </div>

            {classificationResult.notes && (
              <div>
                <Text className="font-semibold">Notes:</Text>
                <Text>{classificationResult.notes}</Text>
              </div>
            )}

            <div>
              <Text className="font-semibold">Image Insights:</Text>
              <ul className="list-disc list-inside space-y-1">
                {classificationResult.imageInsights.map((insight, index) => (
                  <li key={index}>
                    <Text className="text-sm">{insight}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white win95-shadow-inset h-full flex items-center justify-center">
        <Text className="text-gray-600">Waiting for upload...</Text>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-background p-2 gap-2 h-full overflow-hidden">
      <div className="flex-1 min-h-0">{renderContent()}</div>

      {imagePreview && (
        <div className="bg-white win95-shadow-inset p-4 flex flex-shrink-0 flex-col gap-2">
          <Button
            onClick={handleClassifyImage}
            disabled={isClassifying}
            className="self-start"
          >
            {isClassifying ? 'Classifying...' : 'Send'}
          </Button>
          <div className="flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-[200px] w-auto"
            />
          </div>
        </div>
      )}

      <div className="flex flex-row bg-white win95-shadow-inset flex-shrink-0 h-12">
        <div
          className={`flex-1 flex items-start justify-start p-2 transition-colors ${
            dragActive ? 'bg-blue-100' : 'bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="*/*"
          />
          <Text className="text-gray-500">
            {uploadedFile ? uploadedFile.name : 'Drag & drop a file here'}
          </Text>
        </div>
        <Button onClick={() => document.getElementById('file-input')?.click()}>
          Upload
        </Button>
      </div>
    </div>
  );
};
