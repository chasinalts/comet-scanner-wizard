import React, { useState, useCallback, ChangeEvent, JSX } from 'react';
import type { ReactNode } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../contexts/WizardContext';
import type { Question } from '../../types/questions';
import type { Section } from '../../hooks/useSections';

// Define specific question types for type casting
interface TextQuestion extends Question {
  type: 'text';
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

interface ChoiceQuestion extends Question {
  type: 'choice';
  options: {
    id: string;
    text: string;
    value: string;
  }[];
  allowMultiple: boolean;
}

interface BooleanQuestion extends Question {
  type: 'boolean';
  trueLabel: string;
  falseLabel: string;
}

import Button, { IconButton, ButtonGroup } from '../../components/ui/Button';
import { TextField, SelectField, CheckboxField, TextArea } from '../../components/ui/FormField';
import Input from '../../components/ui/Input'; // For option editing

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 }
};

const StepThree: React.FC = () => {
  const { state, dispatch } = useWizard();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const handleAddQuestion = useCallback((type: Question['type']) => {
    let newQuestion: Question;

    if (type === 'choice') {
      newQuestion = {
        id: `question-${Date.now()}`,
        type: 'choice' as const,
        text: '',
        required: false,
        options: [],
        allowMultiple: false
      } as ChoiceQuestion;
    } else if (type === 'boolean') {
      newQuestion = {
        id: `question-${Date.now()}`,
        type: 'boolean' as const,
        text: '',
        required: false,
        trueLabel: 'Yes',
        falseLabel: 'No'
      } as BooleanQuestion;
    } else {
      newQuestion = {
        id: `question-${Date.now()}`,
        type: 'text' as const,
        text: '',
        required: false,
        validation: {}
      } as TextQuestion;
    }

    dispatch({ type: 'SET_QUESTIONS', payload: [...state.questions, newQuestion] });
    setEditingQuestionId(newQuestion.id);
  }, [dispatch, state.questions]);

  const handleUpdateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    const currentQuestion = state.questions.find((q: Question) => q.id === id);
    if (!currentQuestion) return;

    const updatedQuestion = { ...currentQuestion, ...updates } as Question;
    dispatch({
      type: 'SET_QUESTIONS',
      payload: state.questions.map((q: Question) =>
        q.id === id ? updatedQuestion : q
      )
    });
  }, [dispatch, state.questions]);

  const handleDeleteQuestion = useCallback((id: string) => {
    dispatch({
      type: 'SET_QUESTIONS',
      payload: state.questions.filter((q: Question) => q.id !== id)
    });
    if (editingQuestionId === id) {
      setEditingQuestionId(null);
    }
  }, [dispatch, state.questions, editingQuestionId]);

  const handleReorderQuestions = useCallback((newOrder: Question[]) => {
    dispatch({ type: 'SET_QUESTIONS', payload: newOrder });
  }, [dispatch]);

  const handleCompleteStep = useCallback(() => {
    // Basic validation: ensure at least one question exists
    if (state.questions.length > 0) {
      dispatch({ type: 'SET_PROGRESS', payload: { step1Complete: true } });
      dispatch({ type: 'SET_STEP', payload: 4 });
    } else {
      // Optionally show a toast message here
      console.warn("Cannot complete step: No questions added.");
    }
  }, [dispatch, state.questions.length]);

  // --- Choice Option Handlers ---
  const handleAddOption = (questionId: string) => {
    const question = state.questions.find((q: Question) => q.id === questionId) as any;
    if (question && question.type === 'choice') {
      const newOption = { id: `option-${Date.now()}`, text: '', value: '' };
      handleUpdateQuestion(questionId, { options: [...question.options, newOption] });
    }
  };

  const handleUpdateOption = (questionId: string, optionId: string, updates: Partial<{ text: string; value: string }>) => {
    const question = state.questions.find((q: Question) => q.id === questionId);
    if (question && question.type === 'choice') {
      const updatedOptions = (question as ChoiceQuestion).options.map((opt: { id: string; text: string; value: string }) =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      );
      handleUpdateQuestion(questionId, { options: updatedOptions });
    }
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    const question = state.questions.find((q: Question) => q.id === questionId);
    if (question && question.type === 'choice') {
      const updatedOptions = (question as ChoiceQuestion).options.filter((opt: { id: string }) => opt.id !== optionId);
      handleUpdateQuestion(questionId, { options: updatedOptions });
    }
  };
  // --- End Choice Option Handlers ---

  const renderQuestionEditor = (question: Question): JSX.Element => {
    return (
      <motion.div
        key={`${question.id}-editor`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-4 pt-4 border-t border-gray-200 space-y-4"
      >
        {question.type === 'text' && (
          <>
            <TextField
              label="Min Length"
              type="number"
              value={(question as TextQuestion).validation?.minLength || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleUpdateQuestion(question.id, {
                  validation: {
                    ...(question as TextQuestion).validation,
                    minLength: parseInt(e.target.value) || undefined
                  }
                })
              }
              placeholder="Optional"
            />
            <TextField
              label="Max Length"
              type="number"
              value={(question as TextQuestion).validation?.maxLength || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleUpdateQuestion(question.id, {
                  validation: {
                    ...(question as TextQuestion).validation,
                    maxLength: parseInt(e.target.value) || undefined
                  }
                })
              }
              placeholder="Optional"
            />
            <TextField
              label="Pattern (Regex)"
              type="text"
              value={(question as TextQuestion).validation?.pattern || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleUpdateQuestion(question.id, {
                  validation: {
                    ...(question as TextQuestion).validation,
                    pattern: e.target.value || undefined
                  }
                })
              }
              placeholder="Optional, e.g., ^[A-Za-z]+$"
            />
          </>
        )}

        {question.type === 'choice' && (
          <>
            <CheckboxField
              label="Allow multiple selections"
              checked={(question as ChoiceQuestion).allowMultiple}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleUpdateQuestion(question.id, { allowMultiple: e.target.checked } as Partial<ChoiceQuestion>)
              }
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Options</label>
              {(question as ChoiceQuestion).options?.map((option: { id: string; text: string; value: string }, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Input
                    value={option.text}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleUpdateOption(question.id, option.id, {
                        text: e.target.value,
                        value: e.target.value.toLowerCase().replace(/\s+/g, '-')
                      })
                    }
                    placeholder={`Option ${index + 1}`}
                    className="flex-grow"
                  />
                  <IconButton variant="ghost" size="sm" onClick={() => handleDeleteOption(question.id, option.id)} className="text-red-500 hover:bg-red-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </IconButton>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => handleAddOption(question.id)}>
                Add Option
              </Button>
            </div>
          </>
        )}

        {question.type === 'boolean' && (
          <>
            <TextField
              label="Label for 'True'"
              value={(question as BooleanQuestion).trueLabel}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newTrueLabel = e.target.value;
                handleUpdateQuestion(question.id, { trueLabel: newTrueLabel } as Partial<BooleanQuestion>);
              }}
            />
            <TextField
              label="Label for 'False'"
              value={(question as BooleanQuestion).falseLabel}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleUpdateQuestion(question.id, { falseLabel: e.target.value } as Partial<BooleanQuestion>)
              }
            />
          </>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-2">Step 3: Build Questions</h2>
        <p className="text-gray-600 mb-6">
          Create questions to gather necessary information from the user.
          You can link questions to specific code sections created in the previous step.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ButtonGroup>
          <Button onClick={() => handleAddQuestion('text')}>Add Text Question</Button>
          <Button onClick={() => handleAddQuestion('choice')}>Add Choice Question</Button>
          <Button onClick={() => handleAddQuestion('boolean')}>Add Boolean Question</Button>
        </ButtonGroup>
      </motion.div>

      <Reorder.Group
        axis="y"
        values={state.questions}
        onReorder={handleReorderQuestions}
        className="space-y-4"
      >
        {state.questions.map((question: Question): ReactNode => (
         <Reorder.Item
           key={question.id}
           value={question}
           variants={itemVariants}
           initial="initial"
           animate="animate"
           exit="exit"
           className="bg-white rounded-lg shadow p-4 border border-gray-200"
           whileDrag={{ scale: 1.02, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
         >
            <div className="flex items-start justify-between mb-3">
              <TextArea
                value={question.text}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  const newText = e.target.value;
                  handleUpdateQuestion(question.id, { text: newText });
                }}
                placeholder="Enter question text..."
                className="text-lg font-medium flex-grow mr-4 border-0 p-0 focus:ring-0"
                rows={1}
              />
              <div className="flex items-center space-x-3 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingQuestionId(editingQuestionId === question.id ? null : question.id)}
                  aria-expanded={editingQuestionId === question.id}
                >
                  {editingQuestionId === question.id ? 'Hide' : 'Show'} Options
                </Button>
                <IconButton variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)} className="text-red-500 hover:bg-red-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </IconButton>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-3">
              <CheckboxField
                label="Required"
                checked={question.required}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleUpdateQuestion(question.id, { required: e.target.checked })
                }
              />
              <SelectField
                label=""
                value={question.linkedSectionId || ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const newSectionId = e.target.value || undefined;
                  handleUpdateQuestion(question.id, { linkedSectionId: newSectionId });
                }}
                className="text-sm"
              >
                <option value="">Link to section (Optional)</option>
                {state.sections.map((section: Section) => (
                  <option key={section.id} value={section.id}>
                    {section.title || `Section ${section.id}`}
                  </option>
                ))}
              </SelectField>
            </div>

            <AnimatePresence mode="wait">
              {editingQuestionId === question.id && renderQuestionEditor(question)}
            </AnimatePresence>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <motion.div variants={itemVariants} className="flex justify-between items-center pt-4 border-t">
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
        >
          Back
        </Button>
        <Button
          onClick={handleCompleteStep}
          disabled={state.questions.length === 0}
        >
          Next: Preview & Validate
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default StepThree;
