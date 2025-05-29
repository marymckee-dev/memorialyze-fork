import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Plus, Upload, AlertCircle, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import FamilyTreeNode from '../components/family-tree/FamilyTreeNode';
import FamilyMemberModal from '../components/family-tree/FamilyMemberModal';
import GedcomUploader from '../components/family-tree/GedcomUploader';
import FamilyTreeVisualization from '../components/family-tree/FamilyTreeVisualization';
import { FamilyMember } from '../types/FamilyMember';
import { sampleFamilyMembers } from '../data/sampleData';
import TipsSection from '../components/ui/TipsSection';

const FamilyTreePage = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gedcomData, setGedcomData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'default' | 'visualization'>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGedcomModal, setShowGedcomModal] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(sampleFamilyMembers);
  
  useEffect(() => {
    // In a real app, fetch family members from the database
    setIsLoading(true);
    try {
      // Simulated API call
      setTimeout(() => {
        setFamilyMembers(sampleFamilyMembers);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load family members');
      setIsLoading(false);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowAddMenu(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNodeClick = (member: FamilyMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleGedcomUpload = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate GEDCOM data
      if (!data || !data.families) {
        throw new Error('Invalid GEDCOM file format');
      }

      setGedcomData(data);
      setViewMode('visualization');
      setShowGedcomModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process GEDCOM file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (memberData: Partial<FamilyMember>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required fields
      if (!memberData.name || !memberData.birthYear) {
        throw new Error('Name and birth year are required');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newMember: FamilyMember = {
        id: crypto.randomUUID(),
        name: memberData.name,
        birthYear: memberData.birthYear,
        deathYear: memberData.deathYear || null,
        biography: memberData.biography || null,
        photoUrl: memberData.photoUrl || null,
        storyCount: 0,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
      };

      setFamilyMembers(prev => [...prev, newMember]);
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add family member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMember = async (memberId: string, updates: Partial<FamilyMember>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFamilyMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, ...updates } : member
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update family member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete family member');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Family Tree</h1>
            <p className="text-neutral-600">
              {familyMembers.length} family members
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'default' ? 'primary' : 'ghost'} 
              onClick={() => setViewMode('default')}
            >
              Simple View
            </Button>
            <Button 
              variant={viewMode === 'visualization' ? 'primary' : 'ghost'} 
              onClick={() => setViewMode('visualization')}
            >
              Tree View
            </Button>
            
            {/* Add Dropdown Menu */}
            <div className="relative">
              <Button 
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddMenu(!showAddMenu);
                }}
              >
                <Plus size={18} />
                Add
                <ChevronDown size={16} />
              </Button>

              {showAddMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-2 z-10">
                  <button
                    onClick={() => {
                      setShowAddModal(true);
                      setShowAddMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Plus size={16} className="text-primary-500" />
                    Add Family Member
                  </button>
                  <button
                    onClick={() => {
                      setShowGedcomModal(true);
                      setShowAddMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Upload size={16} className="text-primary-500" />
                    Import GEDCOM
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* GEDCOM Modal */}
        {showGedcomModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Import GEDCOM File</h2>
              <GedcomUploader onUpload={handleGedcomUpload} />
              <div className="flex justify-end mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowGedcomModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
            </div>
          ) : viewMode === 'default' ? (
            <div className="min-w-[800px] flex flex-col items-center">
              {/* Default tree view */}
              <div className="flex justify-center mb-16">
                <FamilyTreeNode 
                  member={familyMembers[0]} 
                  onClick={handleNodeClick} 
                />
              </div>
              
              <div className="flex justify-center gap-24 mb-16 relative">
                <div className="absolute top-[-50px] left-[calc(50%-1px)] w-2 h-[50px] border-l-2 border-neutral-300"></div>
                <div className="absolute top-[-50px] left-[calc(25%-1px)] right-[calc(25%-1px)] h-[50px] border-t-2 border-l-2 border-r-2 border-neutral-300"></div>
                
                <FamilyTreeNode 
                  member={familyMembers[1]} 
                  onClick={handleNodeClick} 
                />
                <FamilyTreeNode 
                  member={familyMembers[2]} 
                  onClick={handleNodeClick} 
                />
              </div>
              
              <div className="flex justify-center gap-16 relative">
                <div className="absolute top-[-50px] left-[calc(20%-1px)] w-2 h-[50px] border-l-2 border-neutral-300"></div>
                <div className="absolute top-[-50px] left-[calc(50%-1px)] w-2 h-[50px] border-l-2 border-neutral-300"></div>
                <div className="absolute top-[-50px] left-[calc(80%-1px)] w-2 h-[50px] border-l-2 border-neutral-300"></div>
                <div className="absolute top-[-50px] left-[calc(20%-1px)] right-[calc(20%-1px)] h-[50px] border-t-2 border-neutral-300"></div>
                
                <FamilyTreeNode 
                  member={familyMembers[3]} 
                  onClick={handleNodeClick} 
                />
                <FamilyTreeNode 
                  member={familyMembers[4]} 
                  onClick={handleNodeClick} 
                />
                <FamilyTreeNode 
                  member={familyMembers[5]} 
                  onClick={handleNodeClick} 
                />
              </div>
            </div>
          ) : (
            <FamilyTreeVisualization
              data={gedcomData || familyMembers[0]}
              onSelectMember={handleNodeClick}
            />
          )}
        </div>
        
        <TipsSection
          title="Family Tree Tips"
          icon={<Users className="text-primary-500" size={24} />}
          tips={[
            "Upload a GEDCOM file to import your existing family tree",
            "Click on any family member to view their details and associated stories",
            "Add new family members to expand your tree",
            "Link stories to specific family members to create connections between narratives",
            "Switch between simple and detailed tree views",
            "Export your family tree as a GEDCOM file to share with relatives"
          ]}
        />
        
        {selectedMember && (
          <FamilyMemberModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            member={selectedMember}
          />
        )}
      </motion.div>
    </div>
  );
};

export default FamilyTreePage;