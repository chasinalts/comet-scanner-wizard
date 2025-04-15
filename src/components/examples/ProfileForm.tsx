import { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import { useFieldDependencies } from '../../hooks/useFieldDependencies';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { useAbortController } from '../../hooks/useAbortController';
import { FormProvider, useForm, useField } from '../../contexts/FormContext';
import Button from '../../components/ui/Button';
import { commonRules } from '../../utils/validation';
import { mockProfileApi, ApiErrorType } from '../../utils/mockApi';
import { ConfirmModal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import FormValidationSummary from '../../components/ui/FormValidationSummary';
import SubmissionProgress, { SubmissionStep } from '../../components/ui/SubmissionProgress';
import {
  TextField,
  TextArea,
  SelectField,
  CheckboxField
} from '../../components/ui/FormField';

// Types and interfaces
interface ProfileFormData {
  username: string;
  email: string;
  role: string;
  bio: string;
  notifications: boolean;
}

interface ProfileFormContentProps {
  isSubmitting: boolean;
  submissionSteps: SubmissionStep[];
  showProgress: boolean;
  onCloseProgress: () => void;
  isCanceling: boolean;
  onCancel: () => void;
}

// Constants
const FORM_VERSION = '1.0.0';

const initialValues: ProfileFormData = {
  username: '',
  email: '',
  role: '',
  bio: '',
  notifications: false
};

const roleOptions = [
  { value: 'user', label: 'Regular User' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Administrator' }
];

const formValidationRules = {
  username: commonRules.username,
  email: commonRules.email,
  role: { required: true },
  bio: { maxLength: 500 }
};

// Components
const ProfileForm: React.FC = () => {
  const { showToast } = useToast();
  const { getSignal, abort } = useAbortController();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [submissionSteps, setSubmissionSteps] = useState<SubmissionStep[]>([
    { id: 'validate', label: 'Validating form data', status: 'pending' },
    { id: 'save', label: 'Saving profile information', status: 'pending' },
    { id: 'notify', label: 'Updating notification preferences', status: 'pending' }
  ]);
  const [showProgress, setShowProgress] = useState(false);

  const updateStep = useCallback((stepId: string, update: Partial<SubmissionStep>) => {
    setSubmissionSteps(steps =>
      steps.map(step =>
        step.id === stepId ? { ...step, ...update } : step
      )
    );
  }, []);

  const handleCancel = useCallback(() => {
    setIsCanceling(true);
    abort();
  }, [abort]);

  const handleSubmit = async (values: ProfileFormData): Promise<void> => {
    setIsSubmitting(true);
    setShowProgress(true);
    setIsCanceling(false);

    try {
      const signal = getSignal();

      // Validate
      updateStep('validate', { status: 'processing' });
      await mockProfileApi.validateProfile(values, signal);
      updateStep('validate', { status: 'complete' });

      // Save profile
      updateStep('save', { status: 'processing' });
      await mockProfileApi.updateProfile(values, signal);
      updateStep('save', { status: 'complete' });

      // Update notifications
      updateStep('notify', { status: 'processing' });
      await mockProfileApi.updateNotifications({ enabled: values.notifications }, signal);
      updateStep('notify', { status: 'complete' });

      showToast('success', 'Profile updated successfully!');
      setTimeout(() => {
        setShowProgress(false);
        setIsCanceling(false);
      }, 2000);
    } catch (error) {
      if ((error as ApiErrorType).type === 'abort') {
        showToast('info', 'Operation canceled');
        const currentStep = submissionSteps.find(step => step.status === 'processing');
        if (currentStep) {
          updateStep(currentStep.id, { status: 'pending', message: 'Canceled' });
        }
      } else {
        showToast('error', `Failed to update profile: ${(error as Error).message}`);
        const currentStep = submissionSteps.find(step => step.status === 'processing');
        if (currentStep) {
          updateStep(currentStep.id, {
            status: 'error',
            message: `Error: ${(error as ApiErrorType).message}`
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider
      initialValues={initialValues}
      validationRules={formValidationRules}
      onSubmit={handleSubmit}
    >
      <ProfileFormContent
        isSubmitting={isSubmitting}
        submissionSteps={submissionSteps}
        showProgress={showProgress || isCanceling}
        onCloseProgress={() => {
          setShowProgress(false);
          setIsCanceling(false);
        }}
        isCanceling={isCanceling}
        onCancel={handleCancel}
      />
    </FormProvider>
  );
};

const ProfileFormContent: React.FC<ProfileFormContentProps> = ({
  isSubmitting,
  submissionSteps,
  showProgress,
  onCloseProgress,
  isCanceling,
  onCancel
}) => {
  const {
    submitForm,
    values,
    errors,
    validateForm,
    setFieldValue,
    resetForm
  } = useForm<ProfileFormData>();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  
  const formRefs = useRef<Record<keyof ProfileFormData, HTMLElement | null>>({
    username: null,
    email: null,
    role: null,
    bio: null,
    notifications: null
  });

  const username = useField<ProfileFormData>('username');
  const email = useField<ProfileFormData>('email');
  const role = useField<ProfileFormData>('role');
  const bio = useField<ProfileFormData>('bio');
  const notifications = useField<ProfileFormData>('notifications');

  const { clearStorage, hasSavedState } = useFormPersistence<ProfileFormData>({
    key: 'profile-form',
    values,
    version: FORM_VERSION,
    excludeFields: ['notifications'],
    onRestore: (savedValues: ProfileFormData) => {
      Object.entries(savedValues).forEach(([key, value]) => {
        setFieldValue(key as keyof ProfileFormData, value);
      });
    }
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    setShowValidationSummary(!isValid);
    if (isValid) {
      await submitForm();
      clearStorage();
    }
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  return (
    <>
      {showValidationSummary && Object.keys(errors).length > 0 && (
        <FormValidationSummary
          errors={Object.entries(errors).map(([field, message]) => ({
            field,
            message: `${field}: ${message}`
          }))}
          onFieldFocus={(field) => {
            const element = formRefs.current[field as keyof ProfileFormData];
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus();
            }
          }}
        />
      )}

      <form onSubmit={handleFormSubmit} className="space-y-6 max-w-md">
        {hasSavedState && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You have unsaved changes that have been automatically saved.
                </p>
              </div>
            </div>
          </div>
        )}

        <TextField
          ref={el => formRefs.current.username = el}
          label="Username"
          type="text"
          value={username.field.value as string}
          onChange={(e: ChangeEvent<HTMLInputElement>) => username.field.onChange(e.target.value)}
          onBlur={username.field.onBlur}
          error={username.meta.touched ? username.meta.error : undefined}
          helperText="Choose a unique username"
          required
          fullWidth
        />

        <TextField
          ref={el => formRefs.current.email = el}
          label="Email"
          type="email"
          value={email.field.value as string}
          onChange={(e: ChangeEvent<HTMLInputElement>) => email.field.onChange(e.target.value)}
          onBlur={email.field.onBlur}
          error={email.meta.touched ? email.meta.error : undefined}
          required
          fullWidth
        />

        <SelectField
          ref={el => formRefs.current.role = el}
          label="Role"
          value={role.field.value as string}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => role.field.onChange(e.target.value)}
          onBlur={role.field.onBlur}
          error={role.meta.touched ? role.meta.error : undefined}
          required
          fullWidth
        >
          <option value="">Select a role</option>
          {roleOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        <TextArea
          ref={el => formRefs.current.bio = el}
          label="Bio"
          value={bio.field.value as string}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => bio.field.onChange(e.target.value)}
          onBlur={bio.field.onBlur}
          error={bio.meta.touched ? bio.meta.error : undefined}
          helperText={`${(bio.field.value as string).length}/500 characters`}
          rows={4}
          fullWidth
        />

        <CheckboxField
          ref={el => formRefs.current.notifications = el}
          label="Receive notifications"
          checked={notifications.field.value as boolean}
          onChange={(e: ChangeEvent<HTMLInputElement>) => notifications.field.onChange(e.target.checked)}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Saving..."
          >
            Save Profile
          </Button>
        </div>
      </form>

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetForm();
          clearStorage();
          setShowResetConfirm(false);
        }}
        title="Reset Form"
        message="Are you sure you want to reset the form? All changes and saved drafts will be lost."
        confirmText="Reset"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {showProgress && (
        <SubmissionProgress
          steps={submissionSteps}
          onClose={onCloseProgress}
          showCloseButton={!isCanceling && submissionSteps.every(
            step => step.status === 'complete' || step.status === 'error'
          )}
          footer={
            isSubmitting && !isCanceling ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onCancel}
              >
                Cancel Operation
              </Button>
            ) : null
          }
        />
      )}
    </>
  );
};

export default ProfileForm;