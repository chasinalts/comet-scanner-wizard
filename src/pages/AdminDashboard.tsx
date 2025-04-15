import { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import DragDropUpload from '../components/ui/DragDropUpload';
import { TextField, TextArea, CheckboxField, SelectField } from '../components/ui/FormField';
import { useTheme } from '../contexts/ThemeContext';
import { handleImageUpload } from '../utils/imageHandlers';
import { useQuestions } from '../hooks/useQuestions';
import { useSections } from '../hooks/useSections';
import type { Question, QuestionOption } from '../types/questions';
import type { Section } from '../hooks/useSections';

interface UploadingState {
  questionId: string;
  optionId: string;
}

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion
  } = useQuestions();
  const {
    sections,
    addSection,
    updateSection,
    deleteSection,
    reorderSections
  } = useSections();

  const [uploadingImage, setUploadingImage] = useState<UploadingState | null>(null);

  const handleAddOption = (questionId: string) => {
    const currentQuestion = questions.find(q => q.id === questionId);
    if (!currentQuestion) return;

    const newOption: QuestionOption = {
      id: `option-${Date.now()}`,
      text: '',
      value: '',
      scale: 1
    };

    updateQuestion(questionId, {
      options: [...(currentQuestion.options || []), newOption]
    });
    
    showToast('success', 'New answer option added');
  };

  const handleOptionTextChange = (questionId: string, optionId: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentQuestion = questions.find(q => q.id === questionId);
      if (!currentQuestion) return;

      updateQuestion(questionId, {
        options: currentQuestion.options?.map((opt: QuestionOption) =>
          opt.id === optionId ? {
            ...opt,
            text: e.target.value,
            value: e.target.value.toLowerCase()
          } : opt
        )
      });
    };
  };

  const handleOptionScaleChange = (questionId: string, optionId: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentQuestion = questions.find(q => q.id === questionId);
      if (!currentQuestion) return;

      updateQuestion(questionId, {
        options: currentQuestion.options?.map((opt: QuestionOption) =>
          opt.id === optionId ? {
            ...opt,
            scale: parseFloat(e.target.value)
          } : opt
        )
      });
    };
  };

  const handleOptionImageUpload = async (questionId: string, optionId: string, file: File) => {
    if (uploadingImage) {
      showToast('error', 'Please wait for the current upload to complete');
      return;
    }

    try {
      setUploadingImage({ questionId, optionId });
      
      await new Promise<void>((resolve) => {
        handleImageUpload(file, (imageUrl: string, imagePreview: string) => {
          const currentQuestion = questions.find(q => q.id === questionId);
          if (!currentQuestion) return;

          updateQuestion(questionId, {
            options: currentQuestion.options?.map((opt: QuestionOption) =>
              opt.id === optionId ? {
                ...opt,
                imageUrl,
                imagePreview,
                scale: 1
              } : opt
            )
          });
          resolve();
        });
      });

      showToast('success', 'Image uploaded successfully');
    } catch (error) {
      showToast('error', 'Failed to upload image');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleRemoveOptionImage = (questionId: string, optionId: string) => {
    const currentQuestion = questions.find(q => q.id === questionId);
    if (!currentQuestion) return;

    updateQuestion(questionId, {
      options: currentQuestion.options?.map((opt: QuestionOption) =>
        opt.id === optionId ? {
          ...opt,
          imageUrl: undefined,
          imagePreview: undefined,
          scale: undefined
        } : opt
      )
    });

    showToast('success', 'Image removed');
  };

  const handleOptionSectionLink = (questionId: string, optionId: string) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      const currentQuestion = questions.find(q => q.id === questionId);
      if (!currentQuestion) return;

      updateQuestion(questionId, {
        options: currentQuestion.options?.map((opt: QuestionOption) =>
          opt.id === optionId ? {
            ...opt,
            linkedSectionId: e.target.value || undefined
          } : opt
        )
      });
    };
  };

  const handleQuestionSectionLink = (questionId: string) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateQuestion(questionId, { linkedSectionId: e.target.value || undefined });
    };
  };

  const handlePlaceholderVariableChange = (questionId: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      updateQuestion(questionId, { placeholderVariable: e.target.value });
    };
  };

  if (!currentUser?.isOwner) {
    return <div className="p-8 text-center text-gray-900 dark:text-white">You don't have permission to access this page.</div>;
  }

  return (
    <div className={`max-w-7xl mx-auto p-6 space-y-12 ${theme === 'dark' ? 'dark' : ''}`}>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>

      {/* Template Builder Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Template Builder</h2>
        <div className="space-y-6">
          <Button onClick={addSection}>Add New Section</Button>
          <Reorder.Group axis="y" values={sections} onReorder={reorderSections} className="space-y-4">
            {sections.map((section: Section) => (
              <Reorder.Item
                key={section.id}
                value={section}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <TextField
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    className="text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    placeholder="Section Title"
                  />
                  <div className="flex items-center space-x-4">
                    <CheckboxField
                      label="Mandatory"
                      checked={section.isMandatory}
                      onChange={(e) => updateSection(section.id, { isMandatory: e.target.checked })}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteSection(section.id)}
                    >
                      Delete Section
                    </Button>
                  </div>
                </div>
                <TextArea
                  value={section.code}
                  onChange={(e) => updateSection(section.id, { code: e.target.value })}
                  className="w-full font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  rows={5}
                  placeholder="Enter section code here..."
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </section>

      {/* Questions Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Questions</h2>
        <div className="space-y-6">
          <div className="flex space-x-4">
            <Button onClick={() => addQuestion('text')}>Add Text Question</Button>
            <Button onClick={() => addQuestion('choice')}>Add Choice Question</Button>
            <Button onClick={() => addQuestion('boolean')}>Add Yes/No Question</Button>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div className="space-y-8">
              {questions.map((question: Question) => (
                <motion.div
                  key={question.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-6">
                    <TextArea
                      value={question.text}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateQuestion(question.id, { text: e.target.value })}
                      className="w-full text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      placeholder="Enter your question..."
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="ml-4"
                    >
                      Delete
                    </Button>
                  </div>

                  {/* Common Question Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <CheckboxField
                      label="Required Question"
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                    />
                    {/* Link section for Text and Boolean questions */}
                    {(question.type === 'text' || question.type === 'boolean') && (
                      <SelectField
                        label="Link to Code Section"
                        value={question.linkedSectionId || ''}
                        onChange={handleQuestionSectionLink(question.id)}
                        className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      >
                        <option value="">None</option>
                        {sections.map((section: Section) => (
                          <option key={section.id} value={section.id}>
                            {section.title || `Section ${section.id}`}
                          </option>
                        ))}
                      </SelectField>
                    )}
                  </div>

                  {/* Text Question Specific Settings */}
                  {question.type === 'text' && (
                    <TextField
                      label="Placeholder Variable Name"
                      value={question.placeholderVariable || ''}
                      onChange={handlePlaceholderVariableChange(question.id)}
                      placeholder="e.g., {{USER_INPUT}}"
                      className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 mb-6"
                    />
                  )}

                  {/* Choice Question Specific Settings */}
                  {question.type === 'choice' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Answer Options</h3>
                        <Button onClick={() => handleAddOption(question.id)}>Add Option</Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                          {question.options?.map((option: QuestionOption) => (
                            <motion.div
                              key={option.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="group border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <div className="p-4 space-y-4">
                                <TextField
                                  label="Option Text"
                                  value={option.text}
                                  onChange={handleOptionTextChange(question.id, option.id)}
                                  placeholder="Enter answer option text"
                                  className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                />

                                <SelectField
                                  label="Link to Code Section"
                                  value={option.linkedSectionId || ''}
                                  onChange={handleOptionSectionLink(question.id, option.id)}
                                  className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                >
                                  <option value="">None</option>
                                  {sections.map((section: Section) => (
                                    <option key={section.id} value={section.id}>
                                      {section.title || `Section ${section.id}`}
                                    </option>
                                  ))}
                                </SelectField>

                                <div className="pt-4">
                                  {option.imageUrl ? (
                                    <div className="space-y-4">
                                      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                        <img
                                          src={option.imagePreview || option.imageUrl}
                                          alt={option.text || 'Option image'}
                                          className="w-full h-full object-contain"
                                          style={{ transform: `scale(${option.scale || 1})` }}
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                          Image Scale ({((option.scale || 1) * 100).toFixed(0)}%)
                                        </label>
                                        <input
                                          type="range"
                                          min="0.1"
                                          max="2"
                                          step="0.1"
                                          value={option.scale || 1}
                                          onChange={handleOptionScaleChange(question.id, option.id)}
                                          className="w-full"
                                        />
                                      </div>

                                      <div className="flex justify-end">
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() => handleRemoveOptionImage(question.id, option.id)}
                                        >
                                          Remove Image
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <DragDropUpload
                                      onFileSelect={(file: File) => handleOptionImageUpload(question.id, option.id, file)}
                                      accept="image/*"
                                      title="Add Answer Image"
                                      description="Drag and drop or click to upload"
                                      maxSize={2}
                                      variant="compact"
                                      isLoading={uploadingImage?.questionId === question.id && uploadingImage?.optionId === option.id}
                                    />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}