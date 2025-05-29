import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
// import { parse } from 'gedcom-parser';
import { Parser } from '@thoughtsunificator/gedcom-parser';
import Button from '../ui/Button';

interface GedcomUploaderProps {
  onUpload: (data: any) => void;
}

const GedcomUploader = ({ onUpload }: GedcomUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        // const gedcomData = parse(event.target.result as string);
        const gedcomData = Parser.parse(event.target.result as string);
        onUpload(gedcomData);
      }
    };

    reader.readAsText(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.ged', '.gedcom']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        isDragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-primary-500'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto mb-4 text-neutral-400" size={32} />
      <h3 className="text-lg font-medium mb-2">Upload GEDCOM File</h3>
      <p className="text-neutral-600 mb-4">
        Drag and drop your GEDCOM file here, or click to select
      </p>
      <Button variant="primary" size="sm">
        Choose File
      </Button>
      <p className="text-xs text-neutral-500 mt-2">
        Supports .ged and .gedcom files
      </p>
    </div>
  );
};

export default GedcomUploader;