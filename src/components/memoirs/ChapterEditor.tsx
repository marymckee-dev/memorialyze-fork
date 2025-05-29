import { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Pencil, Trash2, GripVertical, Plus, Wand2 } from 'lucide-react';
import Button from '../ui/Button';
import RichTextEditor from './RichTextEditor';
import { Chapter } from '../../types/Memoir';
import { generateChapter, suggestImages } from '../../lib/ai';

interface ChapterEditorProps {
  chapters: Chapter[];
  onChange: (chapters: Chapter[]) => void;
  selectedStories: string[];
}

const ChapterEditor = ({ chapters, onChange, selectedStories }: ChapterEditorProps) => {
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedChapters = items.map((chapter, index) => ({
      ...chapter,
      order: index + 1
    }));

    onChange(updatedChapters);
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: 'New Chapter',
      content: '',
      storyIds: [],
      order: chapters.length + 1
    };
    onChange([...chapters, newChapter]);
    setEditingChapterId(newChapter.id);
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    const updatedChapters = chapters.map(chapter =>
      chapter.id === updatedChapter.id ? updatedChapter : chapter
    );
    onChange(updatedChapters);
    setEditingChapterId(null);
  };

  const handleDeleteChapter = (chapterId: string) => {
    const updatedChapters = chapters
      .filter(chapter => chapter.id !== chapterId)
      .map((chapter, index) => ({
        ...chapter,
        order: index + 1
      }));
    onChange(updatedChapters);
  };

  const handleGenerateChapter = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      if (!selectedStories || selectedStories.length === 0) {
        throw new Error('Please select at least one story to generate a chapter');
      }

      const suggestion = await generateChapter(selectedStories);
      
      if (!suggestion || !suggestion.title || !suggestion.content) {
        throw new Error('Failed to generate chapter content');
      }

      const images = await suggestImages(suggestion.content);
      
      const newChapter: Chapter = {
        id: crypto.randomUUID(),
        title: suggestion.title,
        content: suggestion.content,
        storyIds: selectedStories,
        order: chapters.length + 1,
        suggestedImages: images
      };
      
      onChange([...chapters, newChapter]);
      setEditingChapterId(newChapter.id);
    } catch (error) {
      console.error('Error generating chapter:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate chapter');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Chapters</h2>
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleGenerateChapter}
            disabled={generating || !selectedStories?.length}
          >
            <Wand2 size={16} />
            {generating ? 'Generating...' : 'Generate Chapter'}
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddChapter}>
            <Plus size={16} />
            Add Chapter
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {chapters.map((chapter, index) => (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg border border-neutral-200 p-4"
                    >
                      {editingChapterId === chapter.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => handleUpdateChapter({
                              ...chapter,
                              title: e.target.value
                            })}
                            className="w-full p-2 border border-neutral-200 rounded-lg"
                            placeholder="Chapter title"
                          />
                          <RichTextEditor
                            content={chapter.content}
                            onChange={(content) => handleUpdateChapter({
                              ...chapter,
                              content
                            })}
                          />
                          {chapter.suggestedImages && chapter.suggestedImages.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Suggested Images</h4>
                              <div className="grid grid-cols-3 gap-2">
                                {chapter.suggestedImages.map((image, i) => (
                                  <img
                                    key={i}
                                    src={image}
                                    alt={`Suggested image ${i + 1}`}
                                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                                    onClick={() => {
                                      const editor = document.querySelector('.ProseMirror');
                                      if (editor) {
                                        editor.focus();
                                        document.execCommand('insertImage', false, image);
                                      }
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingChapterId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdateChapter(chapter)}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div {...provided.dragHandleProps}>
                            <GripVertical size={20} className="text-neutral-400" />
                          </div>
                          <span className="text-sm text-neutral-500">
                            Chapter {chapter.order}
                          </span>
                          <h3 className="flex-1 font-medium">{chapter.title}</h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingChapterId(chapter.id)}
                              className="p-1 text-neutral-400 hover:text-neutral-600"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteChapter(chapter.id)}
                              className="p-1 text-neutral-400 hover:text-error-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ChapterEditor;