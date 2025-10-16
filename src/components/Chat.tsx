import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { useState, useCallback } from 'react';
import Image from 'next/image';

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

export const Chat = ({
  activeChat: _activeChat,
}: {
  activeChat: string | null;
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<File | null>(null);
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
      if (file.type.startsWith('image/')) {
        setImagePreview(file);
      } else {
        setImagePreview(null);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('file', file, file.type.startsWith('image/'));
      if (file.type.startsWith('image/')) {
        setImagePreview(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleClassifyImage = async () => {
    if (!imagePreview) return;

    setIsClassifying(true);
    setError(null);
    setClassificationResult(null);

    try {
      const formData = new FormData();
      formData.append('file', imagePreview);

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
      return <Text className="text-gray-600">Classifying...</Text>;
    }

    if (error) {
      return <Text className="text-red-600 text-center">{error}</Text>;
    }

    if (classificationResult) {
      return (
        <>
          <div className="p-4 space-y-3">
            <div className="border-b pb-2">
              <Text className="text-lg font-bold mr-2">
                {classificationResult.playerName}
              </Text>
              <Text className="text-sm text-gray-600">
                {classificationResult.team} • {classificationResult.year}
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="font-semibold mr-2">Card Details:</Text>
                <Text>Manufacturer: {classificationResult.manufacturer}</Text>
                <Text>Set: {classificationResult.setName}</Text>
                <Text>Type: {classificationResult.parallelOrVariant}</Text>
                <Text>Card #: {classificationResult.cardNumber}</Text>
              </div>

              <div>
                <Text className="font-semibold mr-2">PSA Grade:</Text>
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
                <Text className="font-semibold mr-2">Notes:</Text>
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
        </>
      );
    }

    return (
      <Text className="text-gray-600">
        {imagePreview
          ? 'Please upload an image to classify'
          : 'Please upload an image to classify'}
      </Text>
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-background p-2 gap-2 h-full">
      <div className="flex flex-1 flex-col w-full overflow-auto win95-shadow-inset">
        {renderContent()}
      </div>

      {imagePreview && (
        <div className="bg-white win95-shadow-inset p-4 flex flex-0 flex-shrink-0 flex-col gap-2">
          <div className="flex justify-center">
            <Image
              width={35}
              height={70}
              src={URL.createObjectURL(imagePreview)}
              alt="Preview"
              className="h-[70px] w-auto"
            />
          </div>
        </div>
      )}

      <div className="flex flex-0 flex-row bg-white win95-shadow-inset flex-shrink-0 h-12 gap-2">
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
            {imagePreview ? imagePreview.name : 'Drag & drop a file here'}
          </Text>
        </div>
        <Button onClick={() => document.getElementById('file-input')?.click()}>
          Upload
        </Button>
        {imagePreview && (
          <Button
            onClick={handleClassifyImage}
            // disabled={isClassifying}
            // className="self-start"
          >
            Classify
          </Button>
        )}
      </div>
    </div>
  );
};
