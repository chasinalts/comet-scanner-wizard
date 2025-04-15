import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../components/ui/Modal';
import { useAdminContent, type ImageContent } from '../hooks/useAdminContent';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import LiveCodePreview from '../components/LiveCodePreview';
import { useWizard } from '../contexts/WizardContext';
import { useQuestions } from '../hooks/useQuestions';
import { useSections } from '../hooks/useSections';
import type { Question, QuestionOption } from '../types/questions';
import { TextField, TextArea, CheckboxField, SelectField } from '../components/ui/FormField'; // Assuming FormField exports these
import Button from '../components/ui/Button';

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

const ScannerWizard = () => {
  const { getBannerImage, getScannerImages } = useAdminContent();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { state: wizardState, dispatch: wizardDispatch } = useWizard();
  const { questions } = useQuestions(); // Load questions managed by admin
  const { sections } = useSections(); // Load sections managed by admin
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  // Load admin-managed questions and sections into wizard context
  useEffect(() => {
    wizardDispatch({ type: 'SET_QUESTIONS', payload: questions });
  }, [questions, wizardDispatch]);

  useEffect(() => {
    wizardDispatch({ type: 'SET_SECTIONS', payload: sections });
  }, [sections, wizardDispatch]);

  // Get banner and scanner images from admin content
  const bannerContent = getBannerImage();
  const scannerImages = getScannerImages();

  const handleAnswerChange = (questionId: string, value: any) => {
    wizardDispatch({ type: 'SET_ANSWER', payload: { questionId, value } });
  };

  const renderQuestionInput = (question: Question) => {
    const answer = wizardState.answers[question.id];

    switch (question.type) {
      case 'text':
        return (
          <TextField
            label={question.text}
            value={(answer as string) || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
            className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        );
      case 'choice':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {question.text} {question.required && <span className="text-red-500">*</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {question.options?.map((option: QuestionOption) => (
                <label
                  key={option.id}
                  className={`
                    flex flex-col items-center p-4 border rounded-lg cursor-pointer 
                    transition-all duration-150 ease-in-out
                    ${(answer === option.value) 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <input
                    type="radio" // Assuming single choice for now
                    name={question.id}
                    value={option.value}
                    checked={answer === option.value}
                    onChange={() => handleAnswerChange(question.id, option.value)}
                    className="sr-only" // Hide default radio
                  />
                  {option.imageUrl && (
                    <img
                      src={option.imagePreview || option.imageUrl}
                      alt={option.text}
                      className="w-full h-32 object-contain mb-2 rounded"
                      style={{ transform: `scale(${option.scale || 1})` }}
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'boolean':
        return (
          <CheckboxField
            label={question.text}
            checked={!!answer}
            onChange={(e) => handleAnswerChange(question.id, e.target.checked)}
            required={question.required}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <ThemeToggle />
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="relative"
        >
          {/* Title Section */}
          <motion.div
            variants={itemVariants}
            className="py-12 px-4 text-center"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white font-display tracking-tight">
              COMET Scanner
              <br />
              Template Wizard
            </h1>
          </motion.div>

          {/* Banner Section */}
          <motion.div
            variants={itemVariants}
            className="relative w-full mb-12 bg-gray-100 dark:bg-gray-800"
          >
            {bannerContent ? (
              <div className="relative w-full flex items-center justify-center overflow-hidden">
                <div className="w-full" style={{ paddingBottom: '42.85%' }}>
                  <img
                    src={bannerContent.src}
                    alt="COMET Scanner Banner"
                    className="absolute top-0 left-0 w-full h-full object-contain transition-transform duration-300"
                    style={{ 
                      transform: `scale(${bannerContent.scale || 1})`,
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full" style={{ paddingBottom: '42.85%' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-3xl text-white font-semibold">
                    Visualize Your Data with COMET Scanner
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Content Area */}
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Questions */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Configure Your Template
                </h2>
                <div className="space-y-6">
                  {wizardState.questions.map((question: Question) => (
                    <div key={question.id} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                      {renderQuestionInput(question)}
                    </div>
                  ))}
                  {wizardState.questions.length === 0 && (
                     <p className="text-gray-500 dark:text-gray-400">No questions configured yet. Please set them up in the Admin Dashboard.</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Live Preview */}
            <div className="lg:col-span-1">
              <LiveCodePreview />
            </div>
          </div>
        </motion.div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <Modal
            isOpen={true}
            onClose={() => {
              setSelectedImage(null);
              setSelectedTitle('');
            }}
            title={selectedTitle}
            size="xl"
          >
            <div className="relative">
              <div className="flex justify-center items-center bg-white dark:bg-gray-800 rounded-lg p-4">
                <img
                  src={selectedImage}
                  alt={selectedTitle}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ScannerWizard;