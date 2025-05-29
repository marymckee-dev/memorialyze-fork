import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Edit, Mic, FileText, Upload, Image as ImageIcon, FileUp } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { FamilyMember } from '../../types/FamilyMember';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
}

const FamilyMemberModal = ({ isOpen, onClose, member }: FamilyMemberModalProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      // Handle file upload here
      console.log('Uploaded files:', acceptedFiles);
    }
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    onClick={onClose}
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.photoUrl ? (
                      <img 
                        src={member.photoUrl} 
                        alt={member.name || 'Family Member'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                        {member.name ? member.name.charAt(0) : '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold"
                    >
                      {member.name || 'Unknown Member'}
                    </Dialog.Title>
                    <p className="text-sm text-neutral-500">
                      {member.birthYear} - {member.deathYear || 'Present'}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-500 uppercase mb-2">Documents & Photos</h4>
                  <div {...getRootProps()} className="border-2 border-dashed border-neutral-200 rounded-lg p-4 text-center hover:border-primary-500 transition-colors cursor-pointer">
                    <input {...getInputProps()} />
                    <Upload className="mx-auto mb-2 text-neutral-400" size={24} />
                    <p className="text-sm text-neutral-600">Drop files here or click to upload</p>
                    <p className="text-xs text-neutral-400 mt-1">Supports images and PDFs</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {member.documents?.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {doc.type === 'image' ? <ImageIcon size={16} /> : <FileUp size={16} />}
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <button className="text-neutral-400 hover:text-neutral-600">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-500 uppercase mb-2">About</h4>
                  <p className="text-neutral-700">
                    {member.biography || 'No biography has been added yet.'}
                  </p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-500 uppercase mb-2">Stories</h4>
                  {member.storyCount > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Mic size={18} className="text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium">Summer at Grandpa's Farm</h5>
                          <p className="text-xs text-neutral-500">Recorded on June 12, 2023</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <FileText size={18} className="text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium">Wedding Day Memories</h5>
                          <p className="text-xs text-neutral-500">Written on March 5, 2023</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 border border-dashed border-neutral-200 rounded-lg">
                      <p className="text-neutral-500 mb-2">No stories yet</p>
                      <Button 
                        as={Link}
                        to="/record" 
                        size="sm" 
                        variant="primary"
                        onClick={onClose}
                      >
                        <Mic size={16} />
                        Record a Story
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" className="text-neutral-600">
                    <Edit size={18} />
                    Edit Profile
                  </Button>
                  <Button variant="primary">
                    View All Stories
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FamilyMemberModal;